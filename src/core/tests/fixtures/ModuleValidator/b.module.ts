import { Module } from '@/core/common';

import { AModule } from './a.module';

@Module({
  imports: [AModule],
})
export class BModule {}
