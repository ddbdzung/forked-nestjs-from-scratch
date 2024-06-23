import type { Schema } from 'mongoose';

import dotenv from 'dotenv';
import debug from 'debug';
import { expand } from 'dotenv-expand';

import { DEBUG_CODE, MAIN_MODULE_NAME } from '@/core/constants/common.constant';
import { BaseEnv } from '@/core/modules/env/env.service';
import { webappRegister } from '@/core/bootstraps/webapp.bootstrap';

import { Env } from '@/app/modules/env/env.service';
import { AbstractModule } from './module.helper';
import { SystemException } from './exception.helper';

let isBootstrapBaseEnvRun = false;
let isBootstrapExtendedEnvRun = false;

const sysLogError = debug(DEBUG_CODE.APP_SYSTEM_ERROR);

const _preloadEnv = () => {
  let _isEnvLoaded = false;
  let _loadedEnv = {};
  return () => {
    if (_isEnvLoaded) {
      return _loadedEnv;
    }

    const NODE_ENV = process.env.NODE_ENV;
    if (!NODE_ENV) {
      sysLogError('Environment variable NODE_ENV is required but not found.');
      process.exit(1);
    }

    const env = dotenv.config({
      path: `.env.${NODE_ENV}`,
    });
    // With dotenv-expand, we can do something like this in .env file
    // DATABASE_URL=postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}
    if (env.error) {
      sysLogError('Error while loading environment variables', env.error);
      process.exit(1);
    }

    expand(env);
    if (!env.parsed) {
      sysLogError('Environment variables are not loaded');
      process.exit(1);
    }

    _isEnvLoaded = true;
    _loadedEnv = env.parsed;
    env.parsed.NODE_ENV = NODE_ENV;
    return env.parsed;
  };
};

export const preloadEnv = _preloadEnv();

export const bootstrapBaseEnv = () => {
  const env = preloadEnv();

  BaseEnv.init(env);
  const baseEnv = BaseEnv.getInstance();
  baseEnv.validateEnvVars();
  isBootstrapBaseEnvRun = true;
};

export const bootstrapExtendedEnv = () => {
  if (!isBootstrapBaseEnvRun) {
    sysLogError('Base environment is not bootstrapped yet');
    process.exit(1);
  }

  const env = preloadEnv();
  Env.init(env);
  const envInstance = Env.getInstance();
  envInstance.validateEnvVars();
  isBootstrapExtendedEnvRun = true;
};

type RegistryName = string;
export class ServerFactory {
  static isMainModuleCreated = false;
  static moduleRegistry: Record<RegistryName, unknown> = {};
  static schemaRegistry: Record<RegistryName, Schema> = {};
  static modelRegistry: Record<RegistryName, unknown> = {};
  static repositoryRegistry: Record<RegistryName, unknown> = {};
  static prefixBaseRoute = '';

  static create<T extends new (...args: unknown[]) => unknown>(ctor: T) {
    const moduleInstance = new ctor();
    if (!(moduleInstance instanceof AbstractModule)) {
      throw new SystemException('Module must be an instance of AbstractModule!');
    }

    const moduleName = moduleInstance.constructor.name;
    if (moduleName !== MAIN_MODULE_NAME) {
      throw new SystemException('MainModule is required when using create method!');
    }

    return webappRegister({
      registryMap: ServerFactory.moduleRegistry,
      prefixBaseRoute: ServerFactory.prefixBaseRoute,
    });
  }

  static setPrefixBaseRoute(prefix: string) {
    ServerFactory.prefixBaseRoute = prefix;
  }
}
