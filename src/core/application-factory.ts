import type { CorsOptions } from 'cors';

import { ApplicationConfig } from './application';
import { ApplicationInterface } from './interfaces/application.interface';
import { VERSION_API } from './constants/common.constant';
import { InjectionToken } from './dependencies';
import { ModuleFactory } from './module-factory';
import { UserService } from '@/app/modules/user/user.service';

export class Application implements ApplicationInterface {
  enableCors(options?: CorsOptions): void {
    throw new Error('Method not implemented.');
  }

  enableVersioning(options?: VERSION_API): this {
    throw new Error('Method not implemented.');

    return this;
  }
}

class ApplicationFactoryStatic {
  static create<T extends ApplicationInterface = ApplicationInterface>(module: Type) {
    const appConfig = new ApplicationConfig();

    const moduleFactory = new ModuleFactory(module);

    // TODO: Add test
    // TODO: Change interface to <Name>Interface if that interface will be implemented by class
    // TODO: Add @Controller() decorator
    // const userService = moduleFactory.diContainer.getDependencyByToken<UserService>(
    //   moduleFactory.moduleTokenFactory.getTokenByCtor(UserService) as InjectionToken,
    // );
    // userService.getUser();
  }
}

export const ApplicationFactory = ApplicationFactoryStatic;
