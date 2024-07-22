import type { Express, Router } from 'express';
import { VERSION_API } from '../constants/common.constant';
import { DECORATOR_TYPE } from '../constants/decorator.constant';

/** @public */
export abstract class AbstractModule {
  public readonly decoratorType = DECORATOR_TYPE.MODULE;

  public modelHandler?: (app: Express) => Router;
  public modelName?: string;

  public moduleName?: string;
  public version?: VERSION_API; // Version of module route
  public prefix?: string; // Prefix for module route

  public registry?: ConstructorType[];
  public isGlobal = false;
}

/** @public */
export abstract class AbstractConfig {
  public readonly decoratorType = DECORATOR_TYPE.CONFIG;
  public name?: string; // Name of the class
  public prefixModule?: string;
  public version: VERSION_API = VERSION_API.V1;
}
