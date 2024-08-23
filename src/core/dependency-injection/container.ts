import { IApplicationConfig } from '../interfaces/application.interface';
import { Module } from './injectors/module';
import { ModuleContainer } from './module-container';
import { Type } from '../interfaces/common.interface';
import { ModuleFactory } from './dependency-injection.type';
import { GLOBAL_MODULE_METADATA } from '../constants';

export class DependencyContainer {
  private readonly _globalModules = new Set<Module>();
  private readonly _modules = new ModuleContainer();

  constructor(private readonly _applicationConfig: IApplicationConfig) {}

  public get applicationConfig(): IApplicationConfig {
    return this._applicationConfig;
  }

  public get globalModules(): Set<Module> {
    return this._globalModules;
  }

  public get modules(): ModuleContainer {
    return this._modules;
  }

  private _setModule({ token, type }: ModuleFactory) {
    // As module instance
    const moduleRef = new Module(type, this);
    moduleRef.token = token;
    this._modules.set(token, moduleRef);

    if (this.isGlobalModule(type)) {
      this._globalModules.add(moduleRef);
    }
  }

  public addGlobalModule(module: Module) {
    this._globalModules.add(module);
  }

  public isGlobalModule(metatype: Type<unknown>): boolean {
    return !!Reflect.getMetadata(GLOBAL_MODULE_METADATA, metatype);
  }

  public addModule(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metatype: Type<any>,
  ) {}
}
