/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Express } from 'express';

import express from 'express';
import debug from 'debug';

import { DEBUG_CODE, MAIN_MODULE_NAME, VERSION_API } from '@/core/constants/common.constant';
import { ServerFactory } from '@/core/helpers/bootstrap.helper';
import type { IModel, IModuleOptions } from '@/core/interfaces/common.interface';
import { AbstractModule } from '@/core/helpers/module.helper';
import { modelHandler } from '@/core/helpers/model.helper';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);
const isMainModuleCreated = ServerFactory.isMainModuleCreated;

const _verifyMainModule = (name: string) => {
  if (name === MAIN_MODULE_NAME && isMainModuleCreated) {
    throw new Error('Main module has been created!');
  }

  if (!(name === MAIN_MODULE_NAME && !isMainModuleCreated)) {
    return;
  }

  ServerFactory.isMainModuleCreated = true;
};

const _verifyModule = <T extends new (...args: any[]) => any>(ctor: T) => {
  _verifyMainModule(ctor.name);
};

function ModuleDecoratorFactory(options: IModuleOptions = {}) {
  const { name, registry, model, prefix, version } = options;

  if (registry && registry.length > 0) {
    if (registry.some((imp) => imp.name === MAIN_MODULE_NAME)) {
      throw new Error('Main module cannot be in the registry!');
    }

    registry.forEach(_verifyModule);
    registry.forEach((imp) => {
      const instance = new imp();
      // const res = Reflect.getMetadata('model:plugins', instance);
      // console.log('[DEBUG][DzungDang] res:', res, instance);
    });
  }

  return <T extends new (...args: any[]) => AbstractModule>(ctor: T) => {
    let instance: InstanceType<T> | null = null;

    if (ctor.name !== MAIN_MODULE_NAME && Object.hasOwn(options, 'registry')) {
      throw new Error(`In ${ctor.name}, registry property must be declared in MainModule!`);
    }

    if (!isMainModuleCreated && ctor.name === MAIN_MODULE_NAME) {
      ServerFactory.isMainModuleCreated = true;
    }

    if (!name) {
      options = {
        name: ctor.name,
      };
    }

    return class extends ctor {
      public override model: IModel | null = null;

      constructor(...args: any[]) {
        if (instance) {
          return instance;
        }

        super(...args);
        instance = new ctor(...args) as InstanceType<T>;
        sysLogInfo(`[${ctor.name}]: Module initialized!`);
        if (model) {
          instance.prefix = prefix || model.name;
          instance.version = version || VERSION_API.V1;
          instance.model = model;
          instance.cb = modelHandler({ model });
        }

        ServerFactory.moduleRegistry[ctor.name] = instance;
        return instance;
      }
    };
  };
}

export { ModuleDecoratorFactory as Module };
