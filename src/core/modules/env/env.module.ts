import debug from 'debug';

import { DEBUG_CODE } from '@/core/constants/common.constant';
import { Module } from '@/core/decorators/module.decorator';
import {
  ServerFactory,
  bootstrapBaseEnv,
  bootstrapExtendedEnv,
} from '@/core/helpers/bootstrap.helper';
import { AbstractEnvModule } from '@/core/helpers/module.helper';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Module()
export class EnvModule extends AbstractEnvModule {
  public static register() {
    bootstrapBaseEnv();
    bootstrapExtendedEnv();

    return class extends AbstractEnvModule {
      public override model = null;

      constructor() {
        super();

        const instance = new EnvModule();
        instance.name = 'EnvModule';
        sysLogInfo(`[${instance.name}]: Module initialized!`);

        ServerFactory.moduleRegistry[instance.name] = instance;
        return instance;
      }
    };
  }
}
