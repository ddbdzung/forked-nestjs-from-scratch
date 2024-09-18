import debug from 'debug';

import { Injectable } from '@/core/dependencies';
import { DEBUG_CODE } from '@/core/constants';

import { TimelapseServiceInterface } from './interfaces/timelapse.service.interface';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Injectable()
export class TimelapseService implements TimelapseServiceInterface {
  getTimelapse(): void {
    sysLogInfo('Timelapse service: Get timelapse!');
  }
}
