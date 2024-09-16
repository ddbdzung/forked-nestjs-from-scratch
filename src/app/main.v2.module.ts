import { Module } from '@/core/decorators/module.decorator.v2';
import { UserModule } from './modules/user/user.module.v2';
import { TokenModule } from './modules/token/token.module';
import { TimelapseModule } from './modules/timelapse/timelapse.module';
import { InjectionToken } from '@/core/dependencies';
import { CompanyModule } from './modules/company/company.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [CompanyModule, CommonModule],
})
export class MainModule {}
