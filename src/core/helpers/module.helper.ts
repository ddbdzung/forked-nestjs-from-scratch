import type { Express, Router } from 'express';

import { IModel, ISchemaType, IVirtualType } from '@/core/interfaces/common.interface';
import { VERSION_API } from '@/core/constants/common.constant';

export abstract class AbstractModule {
  public abstract model: IModel | null;
  public name?: string;
  public cb?: (app: Express) => Router;
  public version?: VERSION_API;
  public prefix?: string;
  public modelname?: string;
}

export abstract class AbstractDatabaseModule extends AbstractModule {
  public override model = null;

  constructor() {
    super();
  }
}

export abstract class AbstractEnvModule extends AbstractModule {
  public override model = null;

  constructor() {
    super();
  }
}

export abstract class AbstractConfig {
  public name?: string; // Name of the class
  public abstract modelName: string;
  public abstract prefixModule: string;
  public version: VERSION_API = VERSION_API.V1;
}

export abstract class AbstractModel implements IModel {
  public abstract schema: Record<string, ISchemaType>;
  public name?: string;
  public virtuals?: Record<string, IVirtualType>;
  public plugins?: unknown[];
  public middlewares?: unknown[]; // TODO: Implement later
}
