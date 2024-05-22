/* eslint-disable @typescript-eslint/no-explicit-any */
import debug from 'debug';

import { DEBUG_CODE, MAIN_MODULE_NAME } from '@/core/constants/common.constant';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

export const moduleRegistry: Record<string, any> = {};
export let _isMainModuleCreated = false;

const _verifyMainModule = (name: string) => {
  if (name === MAIN_MODULE_NAME && _isMainModuleCreated) {
    throw new Error('Main module has been created!');
  }

  if (name === MAIN_MODULE_NAME && !_isMainModuleCreated) {
    _isMainModuleCreated = true;
  }
};

const _verifyModule = <T extends new (...args: any[]) => any>(ctor: T) => {
  _verifyMainModule(ctor.name);
};

export default function ModuleDecoratorFactory(options: ModuleOptions = {}) {
  const { name, registry } = options;

  if (registry && registry.length > 0) {
    if (registry.some((imp) => imp.name === MAIN_MODULE_NAME)) {
      throw new Error('Main module cannot be in the registry!');
    }

    registry.forEach(_verifyModule);
    registry.forEach((imp) => new imp());
  }

  return <T extends new (...args: any[]) => any>(ctor: T): T => {
    let instance: T;
    if (ctor.name !== MAIN_MODULE_NAME && Object.hasOwn(options, 'registry')) {
      throw new Error(`In ${ctor.name}, registry property must be declared in MainModule!`);
    }

    if (!_isMainModuleCreated && ctor.name === MAIN_MODULE_NAME) {
      _isMainModuleCreated = true;
    }

    if (!name) {
      options = {
        name: ctor.name,
      };
    }

    return class {
      constructor(...args: any[]) {
        if (instance) {
          return instance;
        }

        instance = new ctor(...args);
        sysLogInfo(`[${ctor.name}]: Module initialized!`);

        moduleRegistry[ctor.name] = instance;
        return instance;
      }
    } as T;
  };
}
