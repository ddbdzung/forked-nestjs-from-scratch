import debug from 'debug';

import { Inject, Injectable } from '@/core/dependencies';
import { IUserService } from '../user/interfaces/user.service.interface';
import { TokenServiceInterface } from './interfaces/token.service.interface';
import { TimelapseServiceInterface } from '../timelapse/interfaces/timelapse.service.interface';
import { DEBUG_CODE } from '@/core/index';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Injectable()
export class TokenService implements TokenServiceInterface {
  constructor(
    @Inject('UserServiceInterface') private readonly userService: IUserService,
    @Inject('TimelapseServiceInterface')
    private readonly timelapseService: TimelapseServiceInterface,
  ) {}

  getToken(): void {
    sysLogInfo('Token service: Get token!');
    sysLogInfo('[DEBUG][DzungDang] xxx:', this.userService);
    this.userService.getUser();
    this.timelapseService.getTimelapse();
  }
}
