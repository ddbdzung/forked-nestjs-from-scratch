import { ApplicationConfigInterface } from './interfaces/application.interface';

export class ApplicationConfig implements ApplicationConfigInterface {
  private _globalPrefix: string;

  public get globalPrefix(): string {
    return this._globalPrefix;
  }

  public set globalPrefix(value: string) {
    this._globalPrefix = value;
  }
}
