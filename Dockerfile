#############
## Builder ##
#############

# Builder image uses node/pnpm to create production build of frontend
FROM node:20.18.3 as builder

# Yes no maybe. This is strange. Although all default shells are bash and bash has been set as the shell for pnpm to use,
# it still runs everything as /bin/sh for some weird reason. Let's make sure it doesn't.
RUN rm /bin/sh \
    && ln -s /bin/bash /bin/sh

# Setup /app/ with current code
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install Cypress dependencies
# https://docs.cypress.io/guides/continuous-integration/introduction#Dependencies
# RUN apt-get update && apt-get install --no-install-recommends -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb xdg-utils

# Copy only package.json and pnpm-lock.yaml first to properly leverage Docker build caching for node_modules, greatly speeds up build times
COPY package.json /app/package.json
COPY pnpm-lock.yaml /app/pnpm-lock.yaml

# Install all required modules first, `--prod=false` ensures dev dependencies are installed
RUN pnpm install --frozen-lockfile

# Copy project sources
COPY . /app/

ARG VITE_COMMIT_HASH=unspecified

# Build project and copy to nginx folder, then clean up sources
# Re-export build args to strip double quotes from them (taken from https://stackoverflow.com/a/9733456 @ 2018-08-20)
# set -e stops the execution of the script if a command has an error.
RUN set -e \
    && cd /app \
    && export PUBLIC_URL=. \
    && export VITE_COMMIT_HASH=$(sed -e 's/^"//' -e 's/"$//' <<<"$VITE_COMMIT_HASH") \
    && export VITE_BUILD_DATE=$(TZ=":Europe/Vienna" date) \
    && export NODE_ENV=production \
    && pnpm build
  
############
## Runner ##
############

# Runner image uses minimal nginx setup (on alpine linux) required for serving frontend
FROM nginx:alpine as runner
EXPOSE 80

ENV VITE_API_BASE_URL=/api
ENV VITE_BASE_NAME=/
ENV VITE_DEPLOYMENT_ENV=unspecified

# Copy entrypoint script for replacing API base URL dynamically via environment variable
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Copy default nginx config in repo
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# Copy only minified build files from builder setup
COPY --from=builder /app/build /etc/nginx/html/app

# Entrypoint ensures correct API base URL is set via environment variables on runtime
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
