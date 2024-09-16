import { CompanyModule } from './../company/company.module';
import { Module } from '@/core/decorators/module.decorator.v2';
import { CommonService } from './common.service';
import { UserModule } from '../user/user.module.v2';

@Module({
  imports: [CompanyModule, UserModule],
  exports: [CommonService],
  providers: [
    {
      provide: 'CommonServiceInterface',
      useClass: CommonService,
    },
  ],
})
export class CommonModule {}
