# allaboutapps `react-starter`

This is the [allaboutapps](https://allaboutapps.at/) TypeScript template for React single page applications. It uses [Vite](https://vitejs.dev/) as build system/bundler.

## How to use this template
- run `npm_config_yes=true npx tiged github:allaboutapps/react-starter my-project-name` to scaffold a new app, where `my-project-name` is the name of the target folder where you want to create your project.
- change the "name" to your project name in `package.json`.
- run `git init` if you want to initialize a repository.
- run `yarn && yarn start` to install packages and start the dev server
- The project will start with an example Login page. You can reuse this or remove it for your own project.

## What's included?
- We strive to support Visual Studio Code as much as possible.
- Automatically installs compatible versions of popular libraries within our organization.
- Support for compile-time safe i18n through customized typings and utils in the projects.
- Sample Login-Page in the frontend code.
- Docker setup

## Docker
The template comes with a ready to use Dockerfile for containerizgin your application. Use the following commands to build a ready to serve docker image of your application and run it:

```sh
docker build . --build-arg VITE_COMMIT_HASH=happy-commit-hash -t aaa-react-starter

docker run -p 80:80 aaa-react-starter
# http://localhost

docker run -p 80:80 -e VITE_API_BASE_URL="/whatever-api-url" -e VITE_BASE_NAME="/this-is-my-base" -e VITE_DEPLOYMENT_ENV="happy-env" aaa-react-starter
# http://localhost/this-is-my-base
```

or use the commands

- `yarn docker:build`
- `yarn docker:run`
- `yarn docker:run-with-overwrites`

## How to generate types from a Swagger specification

We provide a script that lets you generate TypeScript types for a Swagger specification.

### Local

Run `yarn codegen local <file_name>` to generate types from a swagger file in your local repository. Note that the file needs to be located at the root folder.

### Remote

To use a remote source run `yarn codegen dev`. Don't forget to set a correct `BASE_URL` in `swagger-codegen.sh` which can be found in `./scripts`.

## Setting env variables at runtime

Sometimes there is a need to set env variables at runtime in the environment where the constainer is being executed. We provide support for the following env variables which can be set at runtime per default:

| Name          | Default       | Description   |
| ------------- | ------------- | ------------- |
| VITE_API_BASE_URL | /api | The base URL where the API can be found. |
| VITE_BASE_NAME | / | "The base URL for all locations. If your app is served from a sub-directory on your server, you’ll want to set this to the sub-directory. A properly formatted basename should have a leading slash, but no trailing slash." Taken from https://v5.reactrouter.com/web/api/BrowserRouter/basename-string. |
| VITE_DEPLOYMENT_ENV | unspecified | This env variable is per default not used, but you can use it to customize your application depending on the environment it is running in. For example set it to `dev`, `staging` or `production` for your different environments. |

If you want to add other env variables that can be changed during runtime you need to add them in `Dockerfile`, `config.js`, `config.ts` and in `docker-entrypoint.sh`.

## Debug string keys

When you have many strings in your application it can be hard for QA and translators to figure out which string key in your language file (e.g. en.json) is used for which on screen text.

For this you can open your browser console (CMD+ALT+i in Mac Chrome or CTRL+SHIFT+i in Windows Chrome), enter `debugShowStringKeys(true)` and then press RETURN. This will display the string keys additionally to the translated text. Toggle this off again by using `debugShowStringKeys(false)`.

## Debug screen

Enable a screen with helpful debug options by entering `debugEnable(true)` in the browser console.

## Text styling

CSS styles for all in app texts are defined in `TextStyles.css`. Preferably all heading/paragraph styles should be defined there and then used in you components instead of using CSS inline styles in JSX.

## Third party licenses

A file containing all third party licenses is automatically generated upon build and is available unter `third-party-licenses.txt`.

## Icons

Icons are located and defined in `src/component/ui/Icon.tsx`.

To add new ones following steps are necessary:

* Copy SVG content
* Add content to path, set filename (Replace <svg> with a <g> if you want to set transformations for all child elements)
* Camel case the attributes inside the SVG

## Project origin

This project is based on [cra-template-aaa-typescript](https://github.com/allaboutapps/cra-template-aaa-typescript) which was our old template for create-react-app using webpack instead of Vite.
