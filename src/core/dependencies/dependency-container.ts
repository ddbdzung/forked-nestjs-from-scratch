import 'reflect-metadata';

import { uid } from 'uid/secure';

import { InjectionToken } from './injection-token';
import { IPayloadInjector } from '@/core/interfaces/dependencies/injection-token.interface';
import { IDIContainer } from '@/core/interfaces/dependencies/dependency-container.interface';
import { UncaughtDependencyException, UninjectedTokenException } from './exception';
import { ModuleTokenFactory } from '../module-token-factory';
import { ModulesContainer } from '../module-container';
import { ModuleValidator } from '../module-validator';
import { Module } from '../module';
import { isFunction, isString } from '../utils/validator.util';

export const INJECT_CLASS_METADATA_KEY = '__INJECT_CLASS_METADATA_KEY__';
export const CONSTRUCTOR_PARAM_METADATA_KEY = 'design:paramtypes';

export class DIContainer implements IDIContainer {
  private static _instance: DIContainer;

  private _instanceDict: Map<InjectionToken['token'], unknown>;

  private _setInstance(injectionToken: InjectionToken, instance: unknown) {
    this._instanceDict.set(injectionToken.token, instance);
  }

  private constructor(
    private readonly _moduleTokenFactory: ModuleTokenFactory = new ModuleTokenFactory(),
    private readonly _modulesContainer: ModulesContainer = new ModulesContainer(),
  ) {
    this._instanceDict = new Map();
  }

  /**
   * @description DI Container must be singleton and early initialized
   */
  public static getInstance(moduleTokenFactory?: ModuleTokenFactory): DIContainer {
    if (!DIContainer._instance) {
      DIContainer._instance = moduleTokenFactory
        ? new DIContainer(moduleTokenFactory)
        : new DIContainer();
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
  public construct<T>(ctr: Ctr, injectionToken: InjectionToken, originModule?: Module): T {
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
        if (isFunction(token) || !(token instanceof InjectionToken)) {
          throw new UncaughtDependencyException();
        }

        return this.getDependencyByToken<T>(token);
      }

      const rawToken = isFunction(token) ? token() : token;

      if (isString(rawToken)) {
        const identifier = rawToken;
        const tokenByIdentifer = this._moduleTokenFactory.getTokenByIdentifier(identifier);

        if (originModule) {
          if (!tokenByIdentifer) {
            const msg = `Provide identifier '${identifier}' not found in module '${originModule.ctor.name}'`;
            throw new UncaughtDependencyException(msg);
          }

          if (!ModuleValidator.isInjectingValidProvider(originModule, tokenByIdentifer)) {
            const msg = `Provide identifier '${identifier}' for constructor '${ctr.name}' at index ${paramIndex} in '${originModule.ctor.name}' is not registered.\nMaybe you forgot to export the provider from the imported modules`;
            throw new Error(msg);
          }
        }
      }

      const tokenOfInjector =
        rawToken instanceof InjectionToken
          ? rawToken
          : (this._moduleTokenFactory.getTokenByIdentifier(rawToken) as InjectionToken);

      injector.injected = true;
      injector.token = tokenOfInjector;

      Reflect.defineMetadata(
        INJECT_CLASS_METADATA_KEY,
        Array.from(injectedMetadataDict.values()),
        ctr,
      );

      return this.construct<T>(tokenOfInjector.boundTarget, tokenOfInjector, originModule);
    });

    const instance = new ctr(...args) as T;
    this._setInstance(injectionToken, instance);

    return instance;
  }
}

// export const container = DIContainer.getInstance();
