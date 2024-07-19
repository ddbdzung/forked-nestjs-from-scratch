import type { Schema } from 'mongoose';
import type { Express, Router } from 'express';

import debug from 'debug';

type RegistryName = string;
type ProviderName = string;

import { MAIN_MODULE_NAME, VERSION_API } from '@/core/constants/common.constant';
import { webappRegister } from '@/core/bootstraps';
import { DEBUG_CODE } from '@/core/constants/common.constant';
import { ISchemaType } from '@/core/interfaces/common.interface';

import { SystemException } from './exception.helper';
import { AbstractModule } from './abstract.helper';

/** @public */
export class ServerFactory {
  static isMainModuleCreated = false;
  static globalModuleRegistry: Record<RegistryName, unknown> = {};
  /**
   * Key by module name
   */
  static moduleRegistry: Record<RegistryName, unknown> = {};
  /**
   * Key by model name
   */
  static schemaRegistry: Record<RegistryName, Schema> = {};
  /**
   * Key by module name
   */
  static modelRegistry: Record<RegistryName, unknown> = {};
  /**
   * Key by module name
   */
  static repositoryRegistry: Record<RegistryName, { ctr: ConstructorType; instance?: unknown }> =
    {};
  /**
   * Key by module name
   */
  static configRegistry: Record<RegistryName, unknown> = {};

  private static _prefixBaseRoute = '';

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
}
