import debug from 'debug';

import { Injectable } from '@/core/dependencies';
import { DEBUG_CODE } from '@/core/constants';

import { CompanyServiceInterface } from './interfaces/company.service.interface';
import { TokenServiceInterface } from '../token/interfaces/token.service.interface';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Injectable()
export class CompanyService implements CompanyServiceInterface {
  getCompany(): void {
    sysLogInfo('Company service: Get company!');
  }
}
