import { Module } from '@/core/decorators';

import { bootstrapBaseEnv, bootstrapExtendedEnv } from './env.service';
import { AbstractModule } from '@/core/helpers/abstract.helper';

export abstract class AbstractEnvModule extends AbstractModule {
  constructor() {
    super();

    this.isGlobal = true;
  }
}
@Module()
export class EnvModule extends AbstractEnvModule {
  constructor() {
    super();
  }

  public static register() {
    bootstrapBaseEnv();
    bootstrapExtendedEnv();

    return EnvModule;
  }
}
