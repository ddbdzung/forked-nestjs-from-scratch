import type { CorsOptions } from 'cors';

import { ApplicationConfig } from './application';
import { DependencyContainer } from './dependency-injection/container';
import { IApplication } from './interfaces/application.interface';
import { VERSION_API } from './constants/common.constant';

export class ApplicationFactory implements IApplication {
  enableCors(options: CorsOptions): void {
    throw new Error('Method not implemented.');
  }

  enableVersioning(options: VERSION_API): this {
    throw new Error('Method not implemented.');

    return this;
  }
}

export class ApplicationFactoryStatic {
  static create<T extends IApplication = IApplication>(module: unknown) {
    const appConfig = new ApplicationConfig();
    const container = new DependencyContainer(appConfig);
  }
}
