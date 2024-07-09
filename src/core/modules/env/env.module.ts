import debug from 'debug';

import { DEBUG_CODE } from '@/core/constants/common.constant';
import { Module } from '@/core/decorators/module.decorator';
import {
  ServerFactory,
  bootstrapBaseEnv,
  bootstrapExtendedEnv,
} from '@/core/helpers/bootstrap.helper';
import { _registerModule, AbstractEnvModule } from '@/core/helpers/module.helper';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Module({
  dynamicModule: true,
})
export class EnvModule extends AbstractEnvModule {
  constructor() {
    super();

    console.log('[DEBUG][DzungDang] fuk:');
  }

  public static register() {
    bootstrapBaseEnv();
    bootstrapExtendedEnv();

    // _registerModule<EnvModule>(EnvModule);
    // console.log('[DEBUG][DzungDang] after there:');
    return EnvModule;
  }
}
