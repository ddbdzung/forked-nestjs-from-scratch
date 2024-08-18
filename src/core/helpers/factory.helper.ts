import type { Document, Model, Schema } from 'mongoose';
import type { Express, Router } from 'express';

import debug from 'debug';

type RegistryName = string;
type ProviderName = string;

import { MAIN_MODULE_NAME, VERSION_API } from '@/core/constants/common.constant';
import { webappRegister } from '@/core/bootstraps';
import { DEBUG_CODE } from '@/core/constants/common.constant';
import { ISchema } from '@/core/interfaces/common.interface';

import { SystemException } from './exception.helper';
import { AbstractModule } from './abstract.helper';
import { BaseRepository } from '../repository';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);
const sysLogError = debug(DEBUG_CODE.APP_SYSTEM_ERROR);

/** @public */
export class ServerFactory {
  static isMainModuleCreated = false;
  /**
   * Key by module name
   */
  static globalModuleRegistry: Record<RegistryName, unknown> = {};
  /**
   * Key by module name
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static mongooseModelRegistry: Record<RegistryName, Model<any>> = {};
  /**
   * Key by module name
   */
  static mongooseSchemaRegistry: Record<RegistryName, Schema> = {};
  /**
   * Key by module name
   */
  static moduleRegistry: Record<RegistryName, unknown> = {};
  /**
   * Key by model name
   */
  static schemaRegistry: Record<RegistryName, ISchema> = {};
  /**
   * Key by module name
   */
  static modelRegistry: Record<RegistryName, unknown> = {};
  /**
   * Key by module name
   */
  static repositoryRegistry: Record<
    RegistryName,
    { ctr: ConstructorType; instance?: BaseRepository<Document> }
  > = {};

  /**
   * Key by module name
   */
  static controllerRegistry: Record<RegistryName, unknown> = {};

  static getRepositoryByModelName(modelName: string) {
    const repoRegistry = ServerFactory.repositoryRegistry[modelName];

    if (!repoRegistry) {
      sysLogError(`[ServerFactory]: Repository registry not found for model ${modelName}`);
      return null;
    }

    const repository = repoRegistry.instance;
    if (!repository) {
      sysLogError(`[ServerFactory]: Repository instance not found for model ${modelName}`);
      return null;
    }

    return repository;
  }
  /**
   * Key by module name
   */
  static configRegistry: Record<RegistryName, unknown> = {};

  private static _sequenceModelName: string;

  /**
   * Prefix base route for all modules
   */
  private static _prefixBaseRoute = '';

  static get sequenceModelName() {
    if (!ServerFactory._sequenceModelName) {
      throw new SystemException('Sequence model option is not set!');
    }

    return ServerFactory._sequenceModelName;
  }

  static create<T extends new (...args: unknown[]) => unknown>(ctor: T) {
    const moduleInstance = new ctor();

    if (!(moduleInstance instanceof AbstractModule)) {
      throw new SystemException('Module must be an instance of AbstractModule!');
    }

    if (moduleInstance.moduleName !== MAIN_MODULE_NAME) {
      throw new SystemException('MainModule is required when using create method!');
    }

    return webappRegister({
      registryMap: ServerFactory.moduleRegistry,
      prefixBaseRoute: ServerFactory._prefixBaseRoute,
    });
  }

  static setPrefixBaseRoute(prefix: string) {
    ServerFactory._prefixBaseRoute = prefix;
  }

  static useSequenceModel(modelName?: string) {
    const sysSequenceModelName = modelName || 'SysSequence';
    ServerFactory._sequenceModelName = sysSequenceModelName;
    sysLogInfo(`[ServerFactory]: Sequence model ${sysSequenceModelName} initialized!`);
  }
}
