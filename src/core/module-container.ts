import { uid } from 'uid/secure';

import { Module } from './module';
import { InjectionToken } from './dependencies';

export class ModulesContainer {
  private readonly _modulesByCtor = new WeakMap<Type, Module>();
  private readonly _modulesByToken = new Map<InjectionToken['token'], Module>();
  private readonly _applicationId = uid(21);

  private _getTokenByCtor(ctor: Type): InjectionToken | undefined {
    const module = this._modulesByCtor.get(ctor);
    if (!module) {
      return undefined;
    }

    return module.injectionToken;
  }

  private _getCtorByToken(token: InjectionToken): Type | undefined {
    const module = this._modulesByToken.get(token.token);
    if (!module) {
      return undefined;
    }

    return module.ctor;
  }

  get applicationId(): string {
    return this._applicationId;
  }

  public get(token: InjectionToken): Module | undefined;
  public get(ctor: Type): Module | undefined;
  public get(tokenOrCtor: InjectionToken | Type): Module | undefined {
    if (tokenOrCtor instanceof InjectionToken) {
      return this._modulesByToken.get(tokenOrCtor.token);
    }

    return this._modulesByCtor.get(tokenOrCtor);
  }

  public has(token: InjectionToken): boolean;
  public has(ctor: Type): boolean;
  public has(tokenOrCtor: InjectionToken | Type): boolean {
    if (tokenOrCtor instanceof InjectionToken) {
      return this._modulesByToken.has(tokenOrCtor.token);
    }

    return this._modulesByCtor.has(tokenOrCtor);
  }

  public set(ctor: Type, module: Module): void;
  public set(token: InjectionToken, module: Module): void;
  public set(tokenOrCtor: InjectionToken | Type, module: Module): void {
    if (tokenOrCtor instanceof InjectionToken) {
      this._modulesByToken.set(tokenOrCtor.token, module);
      const ctor = this._getCtorByToken(tokenOrCtor) || module.ctor;
      this._modulesByCtor.set(ctor, module);

      return;
    }

    this._modulesByCtor.set(tokenOrCtor, module);
    const token = this._getTokenByCtor(tokenOrCtor) || module.injectionToken;
    this._modulesByToken.set(token.token, module);
  }

  public forEach(callback: (module: Module) => void) {
    this._modulesByToken.forEach(callback);
  }
}
