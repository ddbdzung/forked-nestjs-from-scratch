import { getClassScope, InjectionToken } from './dependencies';
import { InstanceWrapper } from './instance-wrapper';
import { CustomProvider, Type, UseClassProvider } from './interfaces/common.interface';
import { ModuleTokenFactory } from './module-token-factory';
import { ModuleUtil } from './module-util';
import { isString } from './utils/validator.util';

export type Injectable = unknown;

export class Module {
  /**
   * Indicates if the module imports are resolved
   */
  private _isImportsResolved = false;

  /**
   * Indicates if the module exports are resolved
   */
  private _isExportsResolved = false;

  /**
   * Indicates if the module is a provider of its own instance
   */
  private _isEntryProviderResolved = false;

  /**
   * Set of modules that are imported by this module
   */
  private readonly _imports = new Set<Module>();

  /**
   * Set of modules or providers that are exported by this module
   */
  private readonly _exports = new Set<InjectionToken>();

  /**
   * Providers that are provided by this module or imported modules (recursively resolved)
   */
  private readonly _providers = new Map<InjectionToken['token'], InstanceWrapper<Injectable>>();

  /**
   * Set of entry provider keys that are provided by this module (through metadata)
   */
  private readonly _entryProviderKeys = new Set<InjectionToken>();

  /**
   * Level of the module in the module tree <higher level, higher atomic>
   */
  private _level = 0;

  constructor(
    /**
     * Class constructor reference of the module
     */
    private readonly _ctor: Type,

    /**
     * Injection token of the module (identity card)
     */
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
   * Check if the module is a valid entry provider for the given token.
   * If the provider is not exist in the imported modules, then it is an entry provider
   */
  public isEntryProvider(token: InjectionToken) {
    if (!this._isImportsResolved) {
      throw new Error('Imports are not resolved yet');
    }

    return Array.from(this._imports).every(
      (importedModule) => !importedModule.entryProviderKeys.has(token),
    );
  }

  /**
   * Add a provider to the module as a custom provider (useClass)
   */
  private _addCustomUseClassProvider(token: InjectionToken, provider: UseClassProvider) {
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

  /**
   * Add a custom provider to the module
   */
  public addCustomProvider(token: InjectionToken, provider: CustomProvider): void {
    if (ModuleUtil.isUseClassProvider(provider)) {
      this._addCustomUseClassProvider(token, provider);
    }
  }

  /**
   * Add a standard provider to the module.
   * @description Standard providers are the providers that are not custom providers (plain Class Constructor)
   */
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

  /**
   * Add an existing provider to the module.
   */
  public addExistingProvider(instanceWrapper: InstanceWrapper<Injectable>): void {
    const tokenValue = instanceWrapper.token.token;
    if (this._providers.has(tokenValue)) {
      return;
    }

    this._providers.set(tokenValue, instanceWrapper);
  }

  /**
   * Add an external module to this target module's imports
   */
  public addImport(module: Module): void {
    this._imports.add(module);
  }

  /**
   * Add a provider or imported module to this target module's exports
   */
  public addExport(token: InjectionToken): void {
    this._exports.add(token);
  }

  /**
   * Get a provider by its token
   */
  public getProviderByToken(token: InjectionToken): InstanceWrapper<Injectable> | undefined {
    return this._providers.get(token.token);
  }
}
