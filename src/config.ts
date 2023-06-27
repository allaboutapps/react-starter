import * as _ from "lodash";

// Application specific configuration variables
// potentially sourced from import.meta.env.VITE_*

// Variables defined in `public/config.js`, created from environment variables via `docker-entrypoint.sh` script
// on Docker container start, will override "env" variables defined at runtime if set.
declare const ENV_API_BASE_URL: string;
declare const ENV_BASE_NAME: string;
declare const ENV_DEPLOYMENT_ENV: string;

export const API_BASE_URL = (
    _.isEmpty(ENV_API_BASE_URL) ? import.meta.env.VITE_API_BASE_URL : ENV_API_BASE_URL
) as string;
export const BASE_NAME = (_.isEmpty(ENV_BASE_NAME) ? import.meta.env.VITE_BASE_NAME : ENV_BASE_NAME) as string;
export const DEPLOYMENT_ENV = (
    _.isEmpty(ENV_DEPLOYMENT_ENV) ? import.meta.env.VITE_DEPLOYMENT_ENV : ENV_DEPLOYMENT_ENV
) as string;

// This is the actual complete public URL during runtime of the deployed frontend app.
export const PUBLIC_URL = window.location.origin + BASE_NAME;

export const LOADING_INDICATOR_DELAY_MS = 300;

// For debugging only: Make /dashboard route publicly accessible
export const DEBUG_PUBLIC_DASHBOARD = false;
