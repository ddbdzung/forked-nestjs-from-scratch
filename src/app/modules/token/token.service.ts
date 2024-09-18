import debug from 'debug';

import { Injectable } from '@/core/dependencies';
import { DEBUG_CODE } from '@/core/constants';

import { TokenServiceInterface } from './interfaces/token.service.interface';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Injectable()
export class TokenService implements TokenServiceInterface {
  getToken(): void {
    sysLogInfo('Token service: Get token!');
  }
}
