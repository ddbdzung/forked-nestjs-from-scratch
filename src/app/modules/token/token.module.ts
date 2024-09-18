import { Module } from '@/core/common';
import { forwardRef } from '@/core/dependencies';

import { TokenService } from './token.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'TokenServiceInterface',
      useClass: TokenService,
    },
  ],
  exports: [TokenService],
})
export class TokenModule {}
