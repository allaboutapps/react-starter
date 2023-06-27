#!/bin/sh

# This file is run inside the nginx container, which serves the frontend, as ENTRYPOINT.
# It is responsible for replacing dynamic configuration at runtime in various files.

set -e

if [ "$1" == "test" ]; then
    NGINX_BASE=./nginx
else
    NGINX_BASE=/etc/nginx
fi

# Only update config with defined env variables if we are running an nginx process so we can still attach with debugging commands
# without accidentally modifying anything
if [ "$1" == "nginx" ] || [ "$1" == "test" ]; then
    if [ ! -z "${VITE_API_BASE_URL}" ]; then
        sed -i "/ENV_API_BASE_URL/c\var ENV_API_BASE_URL = \"${VITE_API_BASE_URL}\";" $NGINX_BASE/html/app/config.js
    fi

    if [ ! -z "${VITE_DEPLOYMENT_ENV}" ]; then
        sed -i "/ENV_DEPLOYMENT_ENV/c\var ENV_DEPLOYMENT_ENV = \"${VITE_DEPLOYMENT_ENV}\";" $NGINX_BASE/html/app/config.js
    fi

    if [ ! -z "${VITE_BASE_NAME}" ]; then
        sed -i "/ENV_BASE_NAME/c\var ENV_BASE_NAME = \"${VITE_BASE_NAME}\";" $NGINX_BASE/html/app/config.js
        sed -i "s#VITE_BASE_NAME#$VITE_BASE_NAME#g" $NGINX_BASE/conf.d/default.conf | sed "s#//#/#g"

        # The <base href="/"> is already set to "/". If the VITE_BASE_NAME is a "/", it will change the base href to "//" which is invalid.
        # Therefore we only run the command if the VITE_BASE_NAME is not "/".
        if [ "$VITE_BASE_NAME" != "/" ]; then
            sed -i "s#<base href=\"/\">#<base href=\"$VITE_BASE_NAME/\">#g" $NGINX_BASE/html/app/index.html | sed "s#<base href=\"//\">#<base href=\"/\">#g"
        fi
    fi
fi

# Test param is used during CI tests to see if the patching is correct -> skip exec "$@"
if [ "$1" != "test" ]; then
    exec "$@"
fi
