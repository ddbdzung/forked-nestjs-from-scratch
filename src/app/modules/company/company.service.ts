import debug from 'debug';

import { Inject, Injectable } from '@/core/dependencies';
import { CompanyServiceInterface } from './interfaces/company.service.interface';
import { TokenServiceInterface } from '../token/interfaces/token.service.interface';
import { DEBUG_CODE } from '@/core/index';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Injectable()
export class CompanyService implements CompanyServiceInterface {
  constructor(
    @Inject('TokenServiceInterface') private readonly tokenService: TokenServiceInterface,
  ) {}
  getCompany(): void {
    sysLogInfo('Company service: Get company!');
    this.tokenService.getToken();
  }
}
