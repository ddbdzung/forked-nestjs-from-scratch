import debug from 'debug';

import { Module } from '@/core/decorators/module.decorator';
import { AbstractLoggerModule } from '@/core/helpers/module.helper';

import { DEBUG_CODE } from '@/core/constants/common.constant';
import { ServerFactory } from '@/core/helpers/bootstrap.helper';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Module()
export class LoggerModule extends AbstractLoggerModule {
  public static register() {
    return class extends AbstractLoggerModule {
      constructor() {
        super();

        const instance = new LoggerModule();
        instance.name = 'LoggerModule';
        sysLogInfo(`[${instance.name}]: Module initialized!`);

        ServerFactory.globalModuleRegistry[instance.name] = instance;
        return instance;
      }
    };
  }
}
