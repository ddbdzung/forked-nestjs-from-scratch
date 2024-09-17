import debug from 'debug';

import { Injectable } from '@/core/dependencies';
import { IUserService } from './interfaces/user.service.interface';
import { DEBUG_CODE } from '@/core/index';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Injectable()
export class UserService implements IUserService {
  getUser(): void {
    sysLogInfo('User service: Get user!');
  }
}
