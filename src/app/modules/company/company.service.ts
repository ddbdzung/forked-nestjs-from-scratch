import { Inject, Injectable } from '@/core/dependencies';
import { CompanyServiceInterface } from './interfaces/company.service.interface';
import { TokenServiceInterface } from '../token/interfaces/token.service.interface';

@Injectable()
export class CompanyService implements CompanyServiceInterface {
  constructor(
    @Inject('TokenServiceInterface') private readonly tokenService: TokenServiceInterface,
  ) {}
  getCompany(): void {
    console.log('Company service: Get company!');
    this.tokenService.getToken();
  }
}
