import { Module } from '@/core/common';

import { BModule } from './b.module';

@Module({
  imports: [BModule],
})
export class AModule {}
