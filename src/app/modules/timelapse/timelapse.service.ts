import debug from 'debug';

import { Injectable } from '@/core/dependencies';
import { TimelapseServiceInterface } from './interfaces/timelapse.service.interface';
import { DEBUG_CODE } from '@/core/index';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Injectable()
export class TimelapseService implements TimelapseServiceInterface {
  getTimelapse(): void {
    sysLogInfo('Timelapse service: Get timelapse!');
  }
}
