import { Module } from '@/core/common/module.decorator';
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
