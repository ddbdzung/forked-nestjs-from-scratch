import dotenv from 'dotenv';
import debug from 'debug';
import { expand } from 'dotenv-expand';
import { isEmpty, validateSync } from 'class-validator';
import { plainToClass, instanceToPlain } from 'class-transformer';

import { SystemException } from '@/core/helpers';
import { DEBUG_CODE, MAIN_MODULE_NAME } from '@/core/constants/common.constant';
import { DECORATOR_TYPE } from '@/core/constants/decorator.constant';
import { webappRegister } from '@/core/bootstraps';

import { Env } from '@/app/modules/env/env.service';

import { IEnv } from './env.interface';
import { ValidatorClass } from './env.validator';

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

let _instance: BaseEnv | null = null;
export class BaseEnv implements IEnv {
  protected _envVars: EnvironmentVariable = {};
  protected _rawEnvVars: EnvironmentVariable = {};
  protected _isValidated = false;

  protected constructor() {
    // sysLogInfo('[BaseEnv]: Instance created!');
  }

  public get envVars(): EnvironmentVariable {
    if (isEmpty(this._envVars)) {
      sysLogError('[BaseEnv]: Environment variables not loaded');
      throw new SystemException('[BaseEnv]: Environment variables not loaded');
    }

    return this._envVars;
  }

  static getInstance(): BaseEnv {
    if (!_instance) {
      sysLogError('[BaseEnv]: Instance not created');
      throw new SystemException('[BaseEnv]: Instance not created');
    }

    return _instance;
  }

  static init(rawEnvVars: EnvironmentVariable) {
    if (!_instance) {
      _instance = new BaseEnv();
      _instance._rawEnvVars = rawEnvVars;
      // sysLogInfo('[BaseEnv]: Instance initialized!');
      return;
    }

    sysLogError('[BaseEnv]: Instance already created');
    throw new SystemException('[BaseEnv]: Instance already created');
  }

  public get<T>(accessors: string) {
    if (!this._isValidated) {
      sysLogError('[BaseEnv]: Environment variables not validated');
      throw new SystemException('[BaseEnv]: Environment variables not validated');
    }

    const accessorsArray = accessors.split('.');
    let value: unknown = this.envVars;

    for (const accessor of accessorsArray) {
      value = (value as EnvironmentVariable)[accessor];
    }

    return value as T;
  }

  public validateEnvVars() {
    if (this._isValidated) {
      sysLogError('[BaseEnv]: Environment variables already validated');
      throw new SystemException('[BaseEnv]: Environment variables already validated');
    }

    const envVars = this._rawEnvVars;
    // Validate
    const validatorInstance = plainToClass(ValidatorClass, envVars);
    const errors = validateSync(validatorInstance, {
      validationError: { target: false },
    });

    if (errors.length > 0) {
      sysLogError('[BaseEnv]: Validation error', errors);
      throw new SystemException('[BaseEnv]: Validation error');
    }

    ValidatorClass.isValidated = true;

    // Transform
    this._envVars = instanceToPlain(validatorInstance, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
      exposeUnsetFields: false,
    });
    this._isValidated = true;
    // sysLogInfo('[BaseEnv]: Environment variables validated');
  }
}
