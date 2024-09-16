import type { CorsOptions } from 'cors';

import { ApplicationConfig } from './application';
import { IApplication } from './interfaces/application.interface';
import { VERSION_API } from './constants/common.constant';
import { InjectionToken } from './dependencies';
import { Type } from './interfaces/common.interface';
import { ModuleValidator } from './module-validator';
import { ModuleUtil } from './module-util';
import { ModuleFactory } from './module-factory';
import { TokenService } from '@/app/modules/token/token.service';
import { CompanyService } from '@/app/modules/company/company.service';

export class Application implements IApplication {
  enableCors(options: CorsOptions): void {
    throw new Error('Method not implemented.');
  }

  enableVersioning(options: VERSION_API): this {
    throw new Error('Method not implemented.');

    return this;
  }
}

class ApplicationFactoryStatic {
  static create<T extends IApplication = IApplication>(module: Type) {
    const appConfig = new ApplicationConfig();

    const moduleFactory = new ModuleFactory(module);

    // TODO: Add test
    // TODO: Change interface to <Name>Interface
    // TODO: Add @Controller() decorator
    // TODO: Add @Model() decorator
    const companyService = moduleFactory.diContainer.getDependencyByToken<CompanyService>(
      moduleFactory.moduleTokenFactory.getTokenByCtor(CompanyService) as InjectionToken,
    );
    companyService.getCompany();
  }
}

export const ApplicationFactory = ApplicationFactoryStatic;
