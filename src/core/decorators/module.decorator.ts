import groupBy from 'lodash/groupBy';

import type { Schema } from 'mongoose';
import type { Express, Router } from 'express';

import debug from 'debug';

import {
  ServerFactory,
  SystemException,
  AbstractConfig,
  AbstractModule,
  AbstractModel,
  modelHandler,
} from '@/core/helpers';
import { ISchemaType } from '@/core/interfaces/common.interface';
import { IModuleOptions } from '@/core/interfaces/common.interface';
import { DECORATOR_TYPE } from '@/core/constants/decorator.constant';
import { DEBUG_CODE, MAIN_MODULE_NAME, VERSION_API } from '@/core/constants/common.constant';

type RegistryName = string;
type ProviderName = string;

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

export interface IErrorList {
  name: string;
  message: string;
}

export class ModuleHelper {
  // General properties
  protected _isMainModule = false;
  protected _computedModuleName: string;
  protected _options: IModuleOptions;

  // Main module properties
  private _bizModuleErrorList: IErrorList[] = [];
  private _sysModuleErrorList: IErrorList[] = [];

  // Non-main module properties
  private _providerErrorList: IErrorList[] = [];
  private _modelErrorList: IErrorList[] = [];
  private _repositoryErrorList: IErrorList[] = [];

  constructor(computedModuleName: string, options: IModuleOptions) {
    this._isMainModule = computedModuleName === MAIN_MODULE_NAME;
    this._options = options;
    this._computedModuleName = computedModuleName;
  }

  public registerBizModule() {
    if (!this._isMainModule) {
      return;
    }

    const { bizModule } = this._options;
    if (!bizModule) {
      return;
    }

    bizModule.forEach((moduleCtor) => {
      const instance = new moduleCtor();

      if (!(instance instanceof AbstractModule)) {
        this._bizModuleErrorList.push({
          name: moduleCtor.name,
          message: 'must be an instance of AbstractModule!',
        });

        return;
      }

      const moduleName = instance.moduleName || moduleCtor.name;

      if (ServerFactory.moduleRegistry[moduleName]) {
        this._bizModuleErrorList.push({
          name: moduleName,
          message: 'is duplicated in biz registry!',
        });

        return;
      }

      ServerFactory.moduleRegistry[moduleName] = instance;
    });
  }

  public registerSysModule() {
    if (!this._isMainModule) {
      return;
    }

    const { sysModule } = this._options;
    if (!sysModule) {
      return;
    }

    sysModule.forEach((moduleCtor) => {
      const instance = new moduleCtor();

      if (!(instance instanceof AbstractModule)) {
        this._sysModuleErrorList.push({
          name: moduleCtor.name,
          message: 'must be an instance of AbstractModule!',
        });

        return;
      }

      const moduleName = moduleCtor.name;
      instance.moduleName = moduleName;
      instance.isGlobal = true;

      if (ServerFactory.moduleRegistry[moduleName]) {
        this._sysModuleErrorList.push({
          name: moduleName,
          message: 'is duplicated in sys registry!',
        });

        return;
      }

      ServerFactory.moduleRegistry[moduleName] = instance;
      ServerFactory.globalModuleRegistry[moduleName] = instance;
      sysLogInfo(`[${moduleName}]: Module initialized!`);
    });
  }

  public registerProvider() {
    const { provider } = this._options;
    if (!provider) {
      return;
    }

    if (this._isMainModule) {
      throw new SystemException(
        `In ${this._computedModuleName}, provider must be declared in non ${MAIN_MODULE_NAME}!`,
      );
    }

    provider.forEach((providerCtor) => {
      const instance = new providerCtor();
      if (!(instance instanceof AbstractConfig)) {
        this._providerErrorList.push({
          name: providerCtor.name,
          message: `must be an instance of AbstractConfig in ${this._computedModuleName}!`,
        });

        return;
      }

      ServerFactory.configRegistry[this._computedModuleName] = instance;
    });
  }

  public registerModel() {
    const { model: modelCtor, repository: repositoryCtor } = this._options;
    if (!modelCtor) {
      return;
    }

    if (this._isMainModule) {
      throw new SystemException(
        `In ${this._computedModuleName}, model must be declared in non ${MAIN_MODULE_NAME}!`,
      );
    }

    const instance = new modelCtor(this._computedModuleName);
    if (!(instance instanceof AbstractModel)) {
      throw new SystemException(
        `In ${this._computedModuleName}, model must be an instance of AbstractModel!`,
      );
    }

    if (modelCtor && !repositoryCtor) {
      throw new SystemException(`Model ${instance.name} must be declared with repository!`);
    }

    ServerFactory.modelRegistry[this._computedModuleName] = instance;
    ServerFactory.schemaRegistry[this._computedModuleName] = instance.schema;
  }

  public registerRepositoryCtor() {
    const { repository: repositoryCtor, model: modelCtor } = this._options;
    if (!repositoryCtor || !modelCtor) {
      return;
    }

    if (this._isMainModule) {
      throw new SystemException(
        `In ${this._computedModuleName}, repository must be declared in non ${MAIN_MODULE_NAME}!`,
      );
    }

    if (repositoryCtor && !modelCtor) {
      throw new SystemException(
        `In ${this._computedModuleName}, repository ${repositoryCtor.name} must be declared with model!`,
      );
    }

    ServerFactory.repositoryRegistry[this._computedModuleName] = {
      ctr: repositoryCtor,
    };
  }

  public throwErrorList() {
    const errorList = this._isMainModule
      ? [...this._bizModuleErrorList, ...this._sysModuleErrorList]
      : [...this._providerErrorList, ...this._modelErrorList];

    if (!errorList.length) {
      return;
    }

    const groupByMsg = groupBy(errorList, (e) => e.message);
    const errMsg = Object.keys(groupByMsg)
      .map((msgKey) => `${groupByMsg[msgKey].map((e) => e.name).join(', ')}: ${msgKey}: `)
      .join('\n');

    throw new SystemException(errMsg);
  }
}

export class ModuleValidator extends ModuleHelper {
  /**
   * @description Used to validate module properties
   */
  constructor(computedModuleName: string, options: IModuleOptions) {
    super(computedModuleName, options);
  }

  /**
   * @description Validate not allowed properties of module
   */
  private _validatePropertyList(notAllowedProps: string[]) {
    const errorList = notAllowedProps
      .map((prop) => {
        if (Object.hasOwn(this._options, prop)) {
          return `In ${this._computedModuleName}, ${prop} property must be declared in ${MAIN_MODULE_NAME}!`;
        }

        return null;
      })
      .filter((x) => x);

    if (errorList.length > 0) {
      throw new SystemException(errorList.join('\n'));
    }
  }

  public validateMainModule() {
    if (this._computedModuleName !== MAIN_MODULE_NAME) {
      return;
    }

    if (ServerFactory.isMainModuleCreated) {
      throw new SystemException(
        `In ${this._computedModuleName}, can not create MainModule more than once!`,
      );
    }

    const notAllowedProps = ['isGlobal', 'repository', 'model', 'provider', 'moduleName'];
    this._validatePropertyList(notAllowedProps);

    ServerFactory.isMainModuleCreated = true;
  }

  public validateNonMainModule() {
    if (this._computedModuleName === MAIN_MODULE_NAME) {
      return;
    }

    const notAllowedProps = ['bizModule', 'sysModule'];
    this._validatePropertyList(notAllowedProps);

    if (ServerFactory.moduleRegistry[this._computedModuleName]) {
      throw new SystemException(`Module ${this._computedModuleName} is already created!`);
    }
  }
}

/** @public */
export function ModuleDecoratorFactory(options: IModuleOptions = {}) {
  const { moduleName, isGlobal } = options;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <T extends new (...args: any[]) => AbstractModule>(ctor: T) => {
    let instance: InstanceType<T> | null = null;
    const computedModuleName = moduleName || ctor.name;

    const validator = new ModuleValidator(computedModuleName, options);

    validator.validateMainModule();
    validator.validateNonMainModule();

    const moduleHelper = new ModuleHelper(computedModuleName, options);

    moduleHelper.registerSysModule();
    moduleHelper.registerBizModule();
    moduleHelper.registerProvider();
    moduleHelper.registerModel();
    moduleHelper.registerRepositoryCtor();

    moduleHelper.throwErrorList();

    return class extends ctor {
      // Only work with biz module
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(...args: any[]) {
        if (instance) {
          return instance;
        }

        const instanceInRegistry = ServerFactory.moduleRegistry[computedModuleName];
        if (instanceInRegistry) {
          return instanceInRegistry as InstanceType<T>;
        }

        super(...args);

        instance = new ctor(...args) as InstanceType<T>;
        instance.moduleName = computedModuleName;

        if (isGlobal) {
          instance.isGlobal = isGlobal;
          ServerFactory.globalModuleRegistry[computedModuleName] = instance;
        }

        const configInstance = ServerFactory.configRegistry[computedModuleName] as AbstractConfig;
        if (configInstance) {
          const modelInstance = ServerFactory.modelRegistry[computedModuleName] as AbstractModel;
          let modelName = '';

          if (modelInstance) {
            modelName = modelInstance.name;
            instance.modelHandler = modelHandler({
              model: modelInstance,
              moduleName: computedModuleName,
            });
            instance.modelName = modelInstance.name;
          }

          const prefixModule =
            typeof configInstance.prefixModule === 'string'
              ? configInstance.prefixModule
              : modelName.trim().toLowerCase();

          instance.prefix = prefixModule;
          instance.version = configInstance.version || VERSION_API.V1;
        }

        sysLogInfo(`[${computedModuleName}]: Module initialized!`);

        return instance;
      }
    };
  };
}
