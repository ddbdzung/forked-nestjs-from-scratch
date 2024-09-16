import { Injectable } from '@/core/dependencies';
import { TimelapseServiceInterface } from './interfaces/timelapse.service.interface';

@Injectable()
export class TimelapseService implements TimelapseServiceInterface {
  getTimelapse(): void {
    console.log('Timelapse service: Get timelapse!');
  }
}
