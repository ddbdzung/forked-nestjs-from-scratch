import debug from 'debug';

import { Inject, Injectable } from '@/core/dependencies';
import { DEBUG_CODE } from '@/core/constants';

import { IUserService } from './interfaces/user.service.interface';
import { TokenServiceInterface } from '../token/interfaces/token.service.interface';
import { TimelapseServiceInterface } from '../timelapse/interfaces/timelapse.service.interface';
import { CommonServiceInterface } from '../common/interfaces/common.service.interface';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('TokenServiceInterface') private readonly tokenService: TokenServiceInterface,
    @Inject('CommonServiceInterface') private readonly commonService: CommonServiceInterface,
    @Inject('TimelapseServiceInterface')
    private readonly timelapseService: TimelapseServiceInterface,
  ) {}
  getUser(): void {
    sysLogInfo('User service: Get user!');
    this.tokenService.getToken();
    this.timelapseService.getTimelapse();
    this.commonService.getCommon();
  }
}
