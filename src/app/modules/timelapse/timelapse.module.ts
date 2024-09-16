import { Module } from '@/core/decorators/module.decorator.v2';
import { TimelapseService } from './timelapse.service';
import { TimelapseMethodService } from './timelapse-method.service';

@Module({
  imports: [],
  exports: [TimelapseService],
  providers: [
    {
      provide: 'TimelapseServiceInterface',
      useClass: TimelapseService,
    },
    TimelapseMethodService,
  ],
})
export class TimelapseModule {}
