import { ForwardRefFn } from './dependencies/forward-ref';
import { MODULE_OPTION_KEYS as moduleOptionKeys } from './constants/common.constant';
import { ModuleUtil } from './module-util';
import { CONSTRUCTOR_PARAM_METADATA_KEY, InjectionToken } from './dependencies';
import { Module } from './module';

/**
 * @description Static class - External API - Used to validate module class
 */
export class ModuleValidator {
  public static validateImports(
    imports: (Type | ForwardRefFn<Type>)[],
    targetModule: Type,
    level = 0,
    resolvedModules = new Set<Type>(),
  ): void {
    const circularDependencyIndex = imports.findIndex((module) => module === undefined);
    if (circularDependencyIndex !== -1) {
      throw new Error(
        `Cannot import undefined module, possibly a circular dependency in ${targetModule.name}.imports[${circularDependencyIndex}]`,
      );
    }

    const lazyImports = imports.map(ModuleUtil.resolveModuleForwardRef);
    const isImportModuleItself = lazyImports.includes(targetModule);
    if (isImportModuleItself) {
      throw new Error(`Cannot import module itself ${targetModule.name}`);
    }

    ModuleUtil.setImportsForModule(targetModule, lazyImports);

    for (const module of lazyImports) {
      if (resolvedModules.has(targetModule)) {
        continue;
      }

      resolvedModules.add(module);

      ModuleValidator.validateImports(
        ModuleUtil.getImportsForModule(module),
        module,
        level + 1,
        resolvedModules,
      );
    }
  }

  public static validateProviders(providers: Type[]): void {
    const invalidProviders = providers.filter(
      (provider) => !Reflect.hasMetadata(CONSTRUCTOR_PARAM_METADATA_KEY, provider),
    );

    if (invalidProviders.length > 0) {
      throw new Error(
        `Cannot provide non-injectable providers ${invalidProviders.map((m) => m.name).join(', ')}`,
      );
    }

    const providerIsModule = providers
      .map((provider, index) => ({
        index,
        provider,
      }))
      .filter((m) => ModuleUtil.isModule(m.provider));

    if (providerIsModule.length > 0) {
      throw new Error(
        `Cannot provide module as provider - ${providerIsModule.map((m) => m.provider.name).join(', ')}`,
      );
    }
  }

  public static validateExports(exports: Type[], targetModule: Type): void {
    const providers = ModuleUtil.getProvidersForModule(targetModule);

    if (exports.length > 0 && providers.length === 0) {
      throw new Error(`Cannot export module ${targetModule.name} without providing any providers`);
    }

    const providerConstructors = providers.map((provider) => {
      if (ModuleUtil.isUseClassProvider(provider)) {
        return provider.useClass;
      }

      return provider;
    });

    const invalidExports = exports.filter(
      (exportedModule) =>
        !providerConstructors.includes(exportedModule) && !ModuleUtil.isModule(exportedModule),
    );
    if (invalidExports.length > 0) {
      throw new Error(
        `Cannot export module ${targetModule.name} with invalid providers ${invalidExports
          .map((m) => m.name)
          .join(', ')}`,
      );
    }

    const isExportModuleItself = exports.includes(targetModule);
    if (isExportModuleItself) {
      throw new Error(`Cannot export module itself ${targetModule.name}`);
    }
  }

  public static isInjectingValidProvider(targetModule: Module, token: InjectionToken) {
    return targetModule.providers.has(token.token);
  }

  public static validateControllers(controllers: Type[]): void {
    // Not implement
  }

  public static validateModel(model: Type): void {
    // Not implement
  }
}
