import { Module } from '@/core/common';
import { forwardRef } from '@/core/dependencies';

import { CommonModule } from '../common/common.module';
import { TimelapseModule } from '../timelapse/timelapse.module';
import { CompanyModule } from '../company/company.module';
import { UserService } from './user.service';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [forwardRef<Type>(() => CommonModule), TokenModule, TimelapseModule, CompanyModule],
  exports: [TokenModule, UserService],
  providers: [
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
})
export class UserModule {}
