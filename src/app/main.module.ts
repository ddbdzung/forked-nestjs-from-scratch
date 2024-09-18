import { Module } from '@/core/common/module.decorator';
import { UserModule } from './modules/user/user.module';
import { TimelapseModule } from './modules/timelapse/timelapse.module';
import { CompanyModule } from './modules/company/company.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [UserModule, CommonModule, CompanyModule, TimelapseModule],
})
export class MainModule {}
