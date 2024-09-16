import { Module } from '@/core/decorators/module.decorator.v2';

import { UserService } from './user.service';
import { TokenModule } from '../token/token.module';
import { forwardRef } from '@/core/dependencies';
import { Type } from '@/core/index';

@Module({
  imports: [forwardRef<Type>(() => TokenModule)],
  exports: [UserService],
  providers: [
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
})
export class UserModule {}
