import { Module } from '@/core/decorators';

import { bootstrapBaseEnv, bootstrapExtendedEnv } from './env.service';
import { AbstractModule } from '@/core/helpers';

@Module()
export class EnvModule extends AbstractModule {
  public static register() {
    bootstrapBaseEnv();
    bootstrapExtendedEnv();

    return EnvModule;
  }
}
