import type { Express, Router } from 'express';

import { IModel } from '@/core/interfaces/common.interface';
import { VERSION_API } from '@/core/constants/common.constant';

export abstract class AbstractModule {
  public abstract model: IModel | null;
  public name?: string;
  public cb?: (app: Express) => Router;
  public version?: VERSION_API;
  public prefix?: string;
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
