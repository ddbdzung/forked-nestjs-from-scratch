export const DEBUG_CODE = {
  APP_SYSTEM_ERROR: 'app:sys:error', // Debug code for system log (e.g. env, config, etc.)
  APP_SYSTEM_INFO: 'app:sys:info', // Debug code for system log (e.g. env, config, etc.)
  APP_BIZ: 'app:biz', // Debug code for business log
  APP_API: 'app:api', // Debug code for API log
  APP_DB: 'app:db', // Debug code for DB log
  APP_WORKER: 'app:worker', // Debug code for worker log
  APP_TEST: 'app:test', // Debug code for test log
};

export const ENVIRONMENT_SYSTEM = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  USER_ACCEPTANCE_TEST: 'uat',
  PRODUCTION: 'production',
  TEST: 'test',
};

export const PROTOCOL = {
  HTTP: 'http',
  WEB_SOCKET: 'ws',
};

export const MAIN_MODULE_NAME = 'MainModule';

export enum VERSION_API {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
  V4 = 'v4',
  V5 = 'v5',
  V6 = 'v6',
  V7 = 'v7',
  V8 = 'v8',
  V9 = 'v9',
  V10 = 'v10',
}

export const PREFIX_API = '/rest';
