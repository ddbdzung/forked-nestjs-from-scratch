import debug from 'debug';
import { validateSync } from 'class-validator';
import { instanceToPlain, plainToClass } from 'class-transformer';

import { BaseEnv } from '@/core/modules/env/env.service';
import { SystemException } from '@/core/helpers';
import { DEBUG_CODE } from '@/core/constants/common.constant';

import { ValidatorClass } from './env.validator';

const sysLogError = debug(DEBUG_CODE.APP_SYSTEM_ERROR);

let _instance: Env | null = null;
export class Env extends BaseEnv {
  protected constructor() {
    super();
  }
  override get envVars() {
    return {
      ...this._envVars,
      ...BaseEnv.getInstance().envVars,
    };
  }
  static override init(rawEnvVars: EnvironmentVariable) {
    if (!_instance) {
      _instance = new Env();
      _instance._rawEnvVars = rawEnvVars;
      // sysLogInfo('[Env]: Instance initialized!');
      return;
    }

    sysLogError('[Env]: Instance already created');
    throw new SystemException('[Env]: Instance already created');
  }
  static override getInstance(): Env {
    if (!_instance) {
      sysLogError('[Env]: Instance not created');
      throw new SystemException('[Env]: Instance not created');
    }

    return _instance;
  }
  public override validateEnvVars(): void {
    if (this._isValidated) {
      sysLogError('[Env]: Environment variables already validated');
      throw new SystemException('[Env]: Environment variables already validated');
    }

    const envVars = this._rawEnvVars;
    // Validate
    const validatorInstance = plainToClass(ValidatorClass, envVars);
    const errors = validateSync(validatorInstance, {
      validationError: { target: false },
    });
    if (errors.length > 0) {
      sysLogError('[Env]: Validation error', errors);
      throw new SystemException('[Env]: Validation error');
    }
    ValidatorClass.isValidated = true;

    // Transform
    this._envVars = instanceToPlain(validatorInstance, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
      exposeUnsetFields: false,
    });
    this._isValidated = true;
    // sysLogInfo('[Env]: Environment variables validated');
  }
}
