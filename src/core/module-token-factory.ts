import { uid } from 'uid/secure';

import { InjectionToken } from './dependencies';
import { UseClassProvider } from './interfaces/common.interface';
import { ModuleUtil } from './module-util';
import { createHash } from 'crypto';
import { isString } from './utils/validator.util';

type TokenIdentifier = InjectionToken['identifier'];
type TokenId = InjectionToken['id'];
type TokenValue = InjectionToken['token'];

export class ModuleTokenFactory {
  private readonly _moduleTokenCacheByCtor = new WeakMap<Type, InjectionToken>();
  private readonly _moduleTokenCacheByValue = new Map<TokenValue, InjectionToken>();
  private readonly _moduleIdsCache = new Map<TokenIdentifier, TokenId>();

  private _generateTokenId() {
    return uid(21);
  }

  private _generateToken(id: TokenId, identifier: TokenIdentifier): string {
    return createHash('sha256').update(`${id}_${identifier}`).digest('hex');
  }

  private _syncSetModuleCache(ctor: Type, token: InjectionToken) {
    this._moduleTokenCacheByCtor.set(ctor, token);
    this._moduleIdsCache.set(token.identifier, token.id);
    this._moduleTokenCacheByValue.set(token.token, token);
  }

  private _addUseClassProvider(provider: UseClassProvider): InjectionToken {
    const { provide, useClass } = provider;

    if (this._moduleTokenCacheByCtor.has(useClass)) {
      return this._moduleTokenCacheByCtor.get(useClass) as InjectionToken;
    }

    const token = new InjectionToken(this._generateTokenId(), provide).bindTo(useClass);
    this._syncSetModuleCache(useClass, token);

    return this._moduleTokenCacheByCtor.get(useClass) as InjectionToken;
  }

  private _addStandardProvider(provider: Type): InjectionToken {
    if (this._moduleTokenCacheByCtor.has(provider)) {
      return this._moduleTokenCacheByCtor.get(provider) as InjectionToken;
    }

    const token = new InjectionToken(this._generateTokenId(), provider);
    this._syncSetModuleCache(provider, token);

    return this._moduleTokenCacheByCtor.get(provider) as InjectionToken;
  }

  public create(provider: Type | UseClassProvider): InjectionToken {
    if (ModuleUtil.isUseClassProvider(provider)) {
      return this._addUseClassProvider(provider);
    }

    return this._addStandardProvider(provider);
  }

  public getTokenByIdentifier(identifier: TokenIdentifier): InjectionToken | undefined {
    const name = isString(identifier) ? identifier : identifier.name;
    const id = this._moduleIdsCache.get(name);
    if (!id) {
      return undefined;
    }

    return this._moduleTokenCacheByValue.get(this._generateToken(id, name));
  }

  public getTokenByCtor(ctor: Type): InjectionToken | undefined {
    return this._moduleTokenCacheByCtor.get(ctor);
  }
}
