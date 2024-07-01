/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Express } from 'express';
import type { IModel, IModuleOptions } from '@/core/interfaces/common.interface';

import express from 'express';
import debug from 'debug';

import { DEBUG_CODE, MAIN_MODULE_NAME, VERSION_API } from '@/core/constants/common.constant';
import { ServerFactory } from '@/core/helpers/bootstrap.helper';
import { AbstractConfig, AbstractModel, AbstractModule } from '@/core/helpers/module.helper';
import { modelHandler } from '@/core/helpers/model.helper';
import { SystemException } from '@/core/helpers/exception.helper';
import { BaseRepository } from '../repository/base.repository';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);
const isMainModuleCreated = ServerFactory.isMainModuleCreated;

const _verifyMainModule = (name: string) => {
  if (name === MAIN_MODULE_NAME && isMainModuleCreated) {
    throw new SystemException('Main module has been created!');
  }

  if (!(name === MAIN_MODULE_NAME && !isMainModuleCreated)) {
    return;
  }

  ServerFactory.isMainModuleCreated = true;
};

const _verifyModule = <T extends new (...args: any[]) => any>(ctor: T) => {
  _verifyMainModule(ctor.name);
};

function ModuleDecoratorFactory<M>(options: IModuleOptions = {}) {
  const { registry, provider, repository, model } = options;

  return <T extends new (...args: any[]) => AbstractModule>(ctor: T) => {
    let instance: InstanceType<T> | null = null;
    const name = options.name ? options.name : ctor.name;

    if (ctor.name !== MAIN_MODULE_NAME && Object.hasOwn(options, 'registry')) {
      throw new SystemException(
        `In ${ctor.name}, registry property must be declared in MainModule!`,
      );
    }

    if (Array.isArray(registry) && registry.length > 0) {
      if (registry.some((imp) => imp.name === MAIN_MODULE_NAME)) {
        throw new SystemException('Main module cannot be in the registry!');
      }

      registry.forEach(_verifyModule);
      registry.forEach((imp) => new imp());
    }

    if (model && !repository) {
      throw new SystemException('Model must be declared with repository!');
    }

    if (repository) {
      if (repository.name === MAIN_MODULE_NAME) {
        throw new SystemException('Main module cannot be a repository!');
      }

      ServerFactory.repositoryRegistry[name] = {
        ctr: repository,
      };
    }

    if (Array.isArray(provider) && provider.length > 0) {
      if (provider.some((imp) => imp.name === MAIN_MODULE_NAME)) {
        throw new SystemException('Main module cannot be in the provider!');
      }

      provider.forEach((imp) => {
        const providerInstance = new imp();
        const isInstanceOfAbstractConfig = providerInstance instanceof AbstractConfig;

        if (isInstanceOfAbstractConfig) {
          ServerFactory.configRegistry[name] = providerInstance;
        } else {
          throw new SystemException('Provider must be derived class of AbstractConfig!');
        }

        // TODO: More provider type can be added here
      });
    }

    let modelInstance: AbstractModel | null = null;
    if (model) {
      modelInstance = new model(name);
      if (!(modelInstance instanceof AbstractModel)) {
        throw new SystemException('Model must be derived class of AbstractModel!');
      }

      ServerFactory.modelRegistry[name] = modelInstance;
    }

    return class extends ctor {
      constructor(...args: any[]) {
        if (instance) {
          return instance;
        }

        super(...args);

        instance = new ctor(...args) as InstanceType<T>;
        instance.name = options.name || ctor.name;
        sysLogInfo(`[${ctor.name}]: Module initialized!`);

        const instanceConfig = ServerFactory.configRegistry[name] as AbstractConfig;
        if (instanceConfig) {
          const prefixModule =
            typeof instanceConfig.prefixModule === 'string'
              ? instanceConfig.prefixModule
              : modelInstance?.name?.trim()?.toLowerCase();

          instance.prefix = prefixModule;
          instance.version = instanceConfig.version || VERSION_API.V1;

          if (modelInstance) {
            instance.modelHandler = modelHandler({ model: modelInstance, moduleName: name });
            instance.modelName = modelInstance.name;
          }
        }

        ServerFactory.moduleRegistry[ctor.name] = instance;
        return instance;
      }
    };
  };
}

export { ModuleDecoratorFactory as Module };
