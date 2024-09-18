import { Module } from '@/core/common';
import { forwardRef } from '@/core/dependencies';

import { CommonService } from './common.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [forwardRef<Type>(() => UserModule)],
  exports: [CommonService],
  providers: [
    {
      provide: 'CommonServiceInterface',
      useClass: CommonService,
    },
  ],
})
export class CommonModule {}
