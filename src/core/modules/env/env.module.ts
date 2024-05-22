import { debug } from 'debug';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  isEmpty,
  validate,
  validateSync,
} from 'class-validator';
import {
  plainToClass,
  Expose,
  instanceToPlain,
  classToPlain,
  plainToInstance,
} from 'class-transformer';

import { SystemException } from '@/core/helpers/exception.helper';
import { DEBUG_CODE } from '@/core/constants/common.constant';

import { IEnv } from './env.interface';
import { ValidatorClass } from './env.validator';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);
const sysLogError = debug(DEBUG_CODE.APP_SYSTEM_ERROR);

let _instance: BaseEnv | null = null;
export class BaseEnv implements IEnv {
  protected _envVars: EnvironmentVariable = {};
  protected _rawEnvVars: EnvironmentVariable = {};
  protected _isValidated = false;

  protected constructor() {
    sysLogInfo('[BaseEnv]: Instance created!');
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
      sysLogInfo('[BaseEnv]: Instance initialized!');
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
    sysLogInfo('[BaseEnv]: Environment variables validated');
  }
}
