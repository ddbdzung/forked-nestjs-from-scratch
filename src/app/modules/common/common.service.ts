import { Injectable } from '@/core/dependencies';
import { CommonServiceInterface } from './interfaces/common.service.interface';

@Injectable()
export class CommonService implements CommonServiceInterface {
  getCommon(): void {
    console.log('Common service: Get common!');
  }
}
