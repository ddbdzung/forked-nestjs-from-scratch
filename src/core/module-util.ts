import { ForwardRefFn } from './dependencies/forward-ref';
import { UseClassProvider } from './interfaces/common.interface';
import { MODULE_OPTION_KEYS as moduleOptionKeys } from './constants/common.constant';

/**
 * @description Static class - External API - Utility class to decorate module class
 */
export class ModuleUtil {
  public static isModule(ctor: Type) {
    return Object.values(moduleOptionKeys).some((key) => {
      const metadata = Reflect.getMetadata(key, ctor);
      return metadata !== undefined;
    });
  }

  public static getModuleOptions(module: Type) {
    return Object.values(moduleOptionKeys).reduce((acc, key) => {
      acc.set(key, Reflect.getMetadata(key, module));
      return acc;
    }, new Map<string, Type | Type[]>());
  }

  public static getImportsForModule(module: Type): Type[] {
    return (ModuleUtil.getModuleOptions(module).get(moduleOptionKeys.IMPORTS) as Type[]) || [];
  }

  /**
   * @returns Providers for module including useClass providers
   */
  public static getProvidersForModule(module: Type): Type[] | UseClassProvider[] {
    return (ModuleUtil.getModuleOptions(module).get(moduleOptionKeys.PROVIDERS) as Type[]) || [];
  }

  public static isUseClassProvider(provider: unknown): provider is UseClassProvider {
    const providerType = provider as UseClassProvider;

    return providerType.useClass !== undefined;
  }

  /**
   * @returns Providers for module excluding useClass providers
   */
  public static getStandardProvidersForModule(module: Type): Type[] {
    return ModuleUtil.getProvidersForModule(module).filter(
      (provider) => !ModuleUtil.isUseClassProvider(provider),
    ) as Type[];
  }

  /**
   * @returns useClass providers for module
   */
  public static getUseClassProvidersForModule(module: Type): UseClassProvider[] {
    return ModuleUtil.getProvidersForModule(module).filter(ModuleUtil.isUseClassProvider);
  }

  public static getExportsForModule(module: Type): Type[] {
    return (ModuleUtil.getModuleOptions(module).get(moduleOptionKeys.EXPORTS) || []) as Type[];
  }

  public static resolveModuleForwardRef(module: Type | ForwardRefFn<Type>): Type {
    if (module.name === 'forwardRefFn') {
      const resolvedModule = (module as ForwardRefFn<Type>)();
      if (!resolvedModule) {
        throw new Error('Undefined forward ref module');
      }

      return resolvedModule;
    }

    return module as Type;
  }

  public static setImportsForModule(module: Type, imports: Type[]) {
    const moduleOptions = ModuleUtil.getModuleOptions(module);
    moduleOptions.set(moduleOptionKeys.IMPORTS, imports);

    Reflect.defineMetadata(moduleOptionKeys, imports, module);
  }

  public static iterateModuleImports(
    entryModule: Type,
    callback: ({ targetModuleCtor, level }: { targetModuleCtor: Type; level: number }) => void,
    level = 0,
    resolvedModules = new Set<Type>(),
  ): Type[] {
    const imports = ModuleUtil.getImportsForModule(entryModule);

    const lazyImports = imports.map(ModuleUtil.resolveModuleForwardRef);
    ModuleUtil.setImportsForModule(entryModule, lazyImports);

    for (const moduleCtor of lazyImports) {
      if (resolvedModules.has(moduleCtor)) {
        continue;
      }

      resolvedModules.add(moduleCtor);
      ModuleUtil.iterateModuleImports(moduleCtor, callback, level + 1, resolvedModules);
    }

    if (!resolvedModules.has(entryModule)) {
      resolvedModules.add(entryModule);
    }

    callback({ targetModuleCtor: entryModule, level });

    return Array.from(resolvedModules);
  }
}
