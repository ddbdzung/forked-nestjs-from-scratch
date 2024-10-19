import { Module } from '@/core/common';

import { BModule } from './b.module';

@Module({
  imports: [BModule, AModule],
})
export class AModule {}
