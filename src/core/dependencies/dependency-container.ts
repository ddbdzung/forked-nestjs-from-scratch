import 'reflect-metadata';

import { uid } from 'uid/secure';

import { InjectionToken } from './injection-token';
import { IPayloadInjector } from '@/core/interfaces/dependencies/injection-token.interface';
import { IDIContainer } from '@/core/interfaces/dependencies/dependency-container.interface';
import { UncaughtDependencyException, UninjectedTokenException } from './exception';

export const INJECT_CLASS_METADATA_KEY = '__INJECT_CLASS_METADATA_KEY__';
export const CONSTRUCTOR_PARAM_METADATA_KEY = 'design:paramtypes';

class DIContainer implements IDIContainer {
  private static _instance: DIContainer;

  private _instanceDict: Map<InjectionToken['token'], unknown>;

  private _setInstance(injectionToken: InjectionToken, instance: unknown) {
    this._instanceDict.set(injectionToken.token, instance);
  }

  private constructor() {
    this._instanceDict = new Map();
  }

  /**
   * @description DI Container must be singleton and early initialized
   */
  public static getInstance(): DIContainer {
    if (!DIContainer._instance) {
      DIContainer._instance = new DIContainer();
    }

    return DIContainer._instance;
  }

  public get instanceDict() {
    return this._instanceDict;
  }

  public getDependencyByToken<T>(injectionToken: InjectionToken): T {
    return this._instanceDict.get(injectionToken.token) as T;
  }

  // TODO: Implement scope, transient, singleton instance
  public construct<T>(ctr: Ctr, injectionToken: InjectionToken): T {
    if (this._instanceDict.has(injectionToken.token)) {
      return this.getDependencyByToken(injectionToken);
    }

    const constructorParamList =
      (Reflect.getMetadata(CONSTRUCTOR_PARAM_METADATA_KEY, ctr) as unknown[]) || [];

    const injectedMetadataList = (Reflect.getMetadata(INJECT_CLASS_METADATA_KEY, ctr) ||
      []) as IPayloadInjector[];

    const injectedMetadataDict = injectedMetadataList.reduce((acc, curr) => {
      acc.set(curr.index, curr);

      return acc;
    }, new Map<number, IPayloadInjector>());

    // Loop through constructor parameters, and construct dependencies recursively
    const args = constructorParamList.map((param, paramIndex) => {
      // If parameter is not decorated with @Inject, return the parameter as is
      if (!injectedMetadataDict.has(paramIndex)) {
        return param;
      }

      const injector = injectedMetadataDict.get(paramIndex) as IPayloadInjector;
      const { token, injected } = injector;
      if (!token) {
        throw new UninjectedTokenException(ctr.name, paramIndex);
      }

      if (injected) {
        if (typeof token === 'function' || !(token instanceof InjectionToken)) {
          throw new UncaughtDependencyException();
        }

        return this.getDependencyByToken<T>(token);
      }

      const tokenOfInjector = token instanceof InjectionToken ? token : token();

      injector.injected = true;
      injector.token = tokenOfInjector;

      Reflect.defineMetadata(
        INJECT_CLASS_METADATA_KEY,
        Array.from(injectedMetadataDict.values()),
        ctr,
      );

      return this.construct<T>(tokenOfInjector.boundTarget, tokenOfInjector);
    });

    const instance = new ctr(...args) as T;
    this._setInstance(injectionToken, instance);

    return instance;
  }
}

export const container = DIContainer.getInstance();
