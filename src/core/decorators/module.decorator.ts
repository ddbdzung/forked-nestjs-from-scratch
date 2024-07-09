/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IModuleOptions } from '@/core/interfaces/common.interface';

import debug from 'debug';

import { DEBUG_CODE, MAIN_MODULE_NAME, VERSION_API } from '@/core/constants/common.constant';
import { ServerFactory } from '@/core/helpers/bootstrap.helper';
import { AbstractConfig, AbstractModel, AbstractModule } from '@/core/helpers/module.helper';
import { modelHandler } from '@/core/helpers/model.helper';
import { SystemException } from '@/core/helpers/exception.helper';
import { BaseRepository } from '../repository/base.repository';
import { AbstractController } from '../helpers/controller.helper';
import { DECORATOR_TYPE } from '../constants/decorator.constant';
import { omit } from '../utils/object.util';

type ModuleName = string;

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

function ModuleDecoratorFactory(options: IModuleOptions = {}) {
  const { registry, provider, repository, model, isGlobal, dynamicModule = false } = options;

  return <T extends new (...args: any[]) => AbstractModule>(ctor: T) => {
    let instance: InstanceType<T> | null = null;

    const name = options.name ? options.name : ctor.name;
    console.log('[DEBUG0][DzungDang] dynamicModule:', dynamicModule, name);

    if (ctor.name !== MAIN_MODULE_NAME && Object.hasOwn(options, 'registry')) {
      throw new SystemException(
        `In ${ctor.name}, registry property must be declared in MainModule!`,
      );
    }

    if (Array.isArray(registry) && registry.length > 0) {
      if (registry.some((constructorCaller) => constructorCaller.name === MAIN_MODULE_NAME)) {
        throw new SystemException('Main module cannot be in the registry!');
      }

      registry.forEach((constructorCaller) => new constructorCaller());
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

        //* NOTE: More provider type can be added here
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
    console.log('[DEBUG][DzungDang] im going here:', name);

    return class extends ctor {
      constructor(...args: any[]) {
        console.log('[DEBUG123][DzungDang] dynamicModule:', dynamicModule, name);
        if (instance) {
          return instance._instance as InstanceType<T>;
        }

        super(...args);

        instance = new ctor(...args) as InstanceType<T>;
        instance._instance = instance;
        instance.name = options.name || ctor.name;
        sysLogInfo(`[${instance.name}]: Module initialized!`);

        if (instance.name === MAIN_MODULE_NAME) {
          ServerFactory.isMainModuleCreated = true;
        }

        if (isGlobal) {
          ServerFactory.globalModuleRegistry[name] = instance;
        }

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

        ServerFactory.moduleRegistry[name] = instance;
        return instance;
      }
    };
  };
}

export { ModuleDecoratorFactory as Module };
