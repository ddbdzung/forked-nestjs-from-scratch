import { Module } from '@/core/decorators/module.decorator.v2';
import { UserModule } from '../user/user.module.v2';
import { TokenService } from './token.service';
import { TimelapseModule } from '../timelapse/timelapse.module';
import { forwardRef } from '@/core/dependencies';
import { Type } from '@/core/index';
import { UserService } from '../user/user.service';
import { TimelapseService } from '../timelapse/timelapse.service';

@Module({
  imports: [forwardRef<Type>(() => UserModule), TimelapseModule],
  providers: [
    {
      provide: 'TokenServiceInterface',
      useClass: TokenService,
    },
  ],
  exports: [TimelapseModule, TokenService],
})
export class TokenModule {}
