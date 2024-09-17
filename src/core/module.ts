import { getClassScope, InjectionToken } from './dependencies';
import { InstanceWrapper } from './instance-wrapper';
import { CustomProvider, Type, UseClassProvider } from './interfaces/common.interface';
import { ModuleTokenFactory } from './module-token-factory';
import { ModuleUtil } from './module-util';
import { isString } from './utils/validator.util';

export type Injectable = unknown;

export type Controller = object;

export class Module {
  private _isImportsResolved = false;
  private _isExportsResolved = false;
  private _isEntryProviderResolved = false;
  private readonly _imports = new Set<Module>();
  private readonly _exports = new Set<InjectionToken>();

  // Is provider of its own instance and is also a provider of other imported instances
  private readonly _providers = new Map<InjectionToken['token'], InstanceWrapper<Injectable>>();

  // Is provider of its own instance
  private readonly _entryProviderKeys = new Set<InjectionToken>();

  private _level = 0;

  constructor(
    private readonly _ctor: Type,
    private readonly _injectionToken: InjectionToken,
    level = 0,
  ) {
    this._level = level;
  }

  get injectionToken() {
    return this._injectionToken;
  }

  get ctor() {
    return this._ctor;
  }

  get level() {
    return this._level;
  }

  get imports() {
    return this._imports;
  }

  get providers() {
    return this._providers;
  }

  get exports() {
    return this._exports;
  }

  get entryProviderKeys() {
    return this._entryProviderKeys;
  }

  get isImportsResolved() {
    return this._isImportsResolved;
  }

  set isImportsResolved(value: boolean) {
    this._isImportsResolved = value;
  }

  get isExportsResolved() {
    return this._isExportsResolved;
  }

  set isExportsResolved(value: boolean) {
    this._isExportsResolved = value;
  }

  get isEntryProviderResolved() {
    return this._isEntryProviderResolved;
  }

  set isEntryProviderResolved(value: boolean) {
    this._isEntryProviderResolved = value;
  }

  /**
   * Check if the module is a valid entry provider for the given token
   */
  public isEntryProvider(token: InjectionToken) {
    if (!this._isImportsResolved) {
      throw new Error('Imports are not resolved yet');
    }

    return Array.from(this._imports).every(
      (importedModule) => !importedModule.entryProviderKeys.has(token),
    );
  }

  public addCustomUseClassProvider(token: InjectionToken, provider: UseClassProvider) {
    if (this._providers.has(token.token)) {
      return;
    }

    if (this.isEntryProvider(token)) {
      this._entryProviderKeys.add(token);
    }

    this._providers.set(
      token.token,
      new InstanceWrapper({
        token,
        ctor: provider.useClass,
        instance: null,
        scope: provider.scope ? provider.scope : getClassScope(provider.useClass), // Default scope is singleton if scope not defined in provider
        identifier: provider.provide,
      }),
    );
  }

  public addCustomProvider(token: InjectionToken, provider: CustomProvider): void {
    if (ModuleUtil.isUseClassProvider(provider)) {
      this.addCustomUseClassProvider(token, provider);
    }
  }

  public addStandardProvider(token: InjectionToken, ctor: Type): void {
    if (this._providers.has(token.token)) {
      return;
    }

    if (this.isEntryProvider(token)) {
      this._entryProviderKeys.add(token);
    }

    const identifierName = isString(token.identifier) ? token.identifier : token.token;

    this._providers.set(
      token.token,
      new InstanceWrapper({
        token,
        ctor,
        instance: null,
        scope: getClassScope(ctor),
        identifier: ctor.name || identifierName,
      }),
    );
  }

  public addExistingProvider(instanceWrapper: InstanceWrapper<Injectable>): void {
    const tokenValue = instanceWrapper.token.token;
    if (this._providers.has(tokenValue)) {
      return;
    }

    this._providers.set(tokenValue, instanceWrapper);
  }

  public addImport(module: Module): void {
    this._imports.add(module);
  }

  public addExport(token: InjectionToken): void {
    this._exports.add(token);
  }

  public getProviderByToken(token: InjectionToken): InstanceWrapper<Injectable> | undefined {
    return this._providers.get(token.token);
  }
}
