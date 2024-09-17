import debug from 'debug';

import { Injectable } from '@/core/dependencies';
import { DEBUG_CODE } from '@/core/index';
import { CommonServiceInterface } from './interfaces/common.service.interface';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Injectable()
export class CommonService implements CommonServiceInterface {
  getCommon(): void {
    sysLogInfo('Common service: Get common!');
  }
}
