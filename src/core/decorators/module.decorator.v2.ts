import type { Express, Router } from 'express';

import debug from 'debug';

import { IModuleOptionsV2 } from '@/core/interfaces/common.interface';
import { DECORATOR_TYPE } from '../constants/decorator.constant';
import { DEBUG_CODE, MAIN_MODULE_NAME, VERSION_API } from '../constants/common.constant';
import { SystemException } from '../helpers/exception.helper';
import { ServerFactory } from '../helpers/bootstrap.helper';

export { ModuleDecoratorFactory as ModuleV2 };

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

export abstract class AbstractModuleV2 {
  public readonly decoratorType = DECORATOR_TYPE.MODULE;

  public modelHandler?: (app: Express) => Router;
  public modelName?: string;

  public moduleName?: string;
  public version?: VERSION_API; // Version of module route
  public prefix?: string; // Prefix for module route

  public registry?: ConstructorType[];
  public isGlobal = false;
}

function _validateModuleOptions(options: IModuleOptionsV2) {
  let _validateMainModuleIsRun = false;
  let _validateNonMainModuleIsRun = false;

  /**
   * @description Validate not allowed properties of module
   */
  const _validatePropertyList = (notAllowedProps: string[], computedModuleName: string) => {
    const errorList = notAllowedProps
      .map((prop) => {
        if (Object.hasOwn(options, prop)) {
          return `In ${computedModuleName}, ${prop} property must be declared in ${MAIN_MODULE_NAME}!`;
        }

        return null;
      })
      .filter((x) => x);

    if (errorList.length > 0) {
      throw new SystemException(errorList.join('\n'));
    }
  };

  return {
    _validateMainModule: (computedModuleName: string) => {
      if (computedModuleName !== MAIN_MODULE_NAME) {
        return;
      }

      _validateMainModuleIsRun = true;

      if (ServerFactory.isMainModuleCreated) {
        throw new SystemException(`Can not create MainModule more than once!`);
      }

      const notAllowedProps = ['isGlobal', 'dynamicModule', 'repository', 'model', 'provider'];
      _validatePropertyList(notAllowedProps, computedModuleName);

      ServerFactory.isMainModuleCreated = true;
    },
    _validateNonMainModule: (computedModuleName: string) => {
      if (computedModuleName === MAIN_MODULE_NAME) {
        return;
      }

      _validateNonMainModuleIsRun = true;

      const notAllowedProps = ['bizModule', 'sysModule'];
      _validatePropertyList(notAllowedProps, computedModuleName);

      if (ServerFactory.moduleRegistry[computedModuleName]) {
        throw new SystemException(`Module ${computedModuleName} is already created!`);
      }
    },
  };
}

function ModuleDecoratorFactory(options: IModuleOptionsV2 = {}) {
  const { bizModule, sysModule, provider, repository, model, isGlobal, moduleName } = options;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <T extends new (...args: any[]) => AbstractModuleV2>(ctor: T) => {
    let instance: InstanceType<T> | null = null;
    const validator = _validateModuleOptions(options);

    const computedModuleName = moduleName || ctor.name;

    validator._validateMainModule(computedModuleName);
    validator._validateNonMainModule(computedModuleName);

    return class extends ctor {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(...args: any[]) {
        if (instance) {
          return instance;
        }

        super(...args);

        instance = new ctor(...args) as InstanceType<T>;
        instance.moduleName = computedModuleName;
        sysLogInfo(`[${computedModuleName}]: Module initialized!`);

        return instance;
      }
    };
  };
}
