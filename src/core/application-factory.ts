import { IApplication } from './interfaces/application-factory.interface';

export class ApplicationFactory implements IApplication {}

export class ApplicationFactoryStatic {
  static create<T extends IApplication = IApplication>() {
    return;
  }
}
