import { Module } from '@/core/common';

import { AModule } from './a.module';
import { BModule } from './b.module';

@Module({
  imports: [AModule, BModule],
})
export class MainModule {}
