import { ForwardRefFn } from '@/core/dependencies/forward-ref';
import { Module } from './module';
import { Type } from './interfaces/common.interface';
import { ModuleTokenFactory } from './module-token-factory';
import { ModuleUtil } from './module-util';
import { uid } from 'uid/secure';
import { ModulesContainer } from './module-container';
import { ModuleValidator } from './module-validator';
import { MODULE_OPTION_KEYS } from './constants';
import { InstanceWrapper } from './instance-wrapper';
import { DIContainer, InjectionToken, UncaughtDependencyException } from './dependencies';
import { UserModule } from '@/app/modules/user/user.module.v2';

export class ModuleFactory {
  private readonly _modules: ModulesContainer;
  private readonly _moduleTokenFactory: ModuleTokenFactory;
  private readonly _diContainer: DIContainer;
  private _entryModule: Module;

  constructor(private readonly _entryCtor: Type) {
    this._modules = new ModulesContainer();
    this._moduleTokenFactory = new ModuleTokenFactory();
    this._diContainer = DIContainer.getInstance(this._moduleTokenFactory);
    this._entryModule = this._addModule(this._entryCtor);

    this._initMetadata();

    this._modules.forEach((module) => {
      this._diContainer.construct(module.ctor, module.injectionToken, module);
      module.entryProviderKeys.forEach((token) => {
        this._diContainer.construct(token.boundTarget, token, module);
      });
    });
  }

  private _addModule(ctor: Type, level?: number): Module {
    if (this._modules.has(ctor)) {
      return this._modules.get(ctor) as Module;
    }

    const token = this._moduleTokenFactory.create(ctor);
    const module = new Module(ctor, token, level);
    this._modules.set(ctor, module);

    return module;
  }

  public get modules() {
    return this._modules;
  }

  public get moduleTokenFactory() {
    return this._moduleTokenFactory;
  }

  public get diContainer() {
    return this._diContainer;
  }

  private _initMetadata() {
    if (!this._entryModule) {
      throw new Error('Entry module is not defined');
    }

    ModuleValidator.validateImports(
      ModuleUtil.getImportsForModule(this._entryCtor),
      this._entryCtor,
    );

    const resolvedModuleCtors = ModuleUtil.iterateModuleImports(this._entryCtor, (params) => {
      const { level, targetModuleCtor } = params;

      this._addModule(targetModuleCtor, level);
    });

    resolvedModuleCtors.forEach((moduleCtor) =>
      ModuleValidator.validateExports(ModuleUtil.getExportsForModule(moduleCtor), moduleCtor),
    );

    resolvedModuleCtors.forEach((moduleCtor) => {
      const providerCtors = [
        ...ModuleUtil.getStandardProvidersForModule(moduleCtor),
        ...ModuleUtil.getUseClassProvidersForModule(moduleCtor).map(
          (provider) => provider.useClass,
        ),
      ];

      ModuleValidator.validateProviders(providerCtors);
    });

    // Add imported modules from metadata
    this._modules.forEach((module) => {
      // Resolve forwardRef modules
      const resolvedImports = ModuleUtil.getImportsForModule(module.ctor).map(
        ModuleUtil.resolveModuleForwardRef,
      );

      // Add imported modules based on imported ctor mapping from module container
      resolvedImports.forEach((imp) => {
        module.addImport(this._modules.get(imp) as Module);
      });

      module.isImportsResolved = true;
    });

    // Add providers from metadata
    this._modules.forEach((module) => {
      const standardProviders = ModuleUtil.getStandardProvidersForModule(module.ctor);
      const useClassProviders = ModuleUtil.getUseClassProvidersForModule(module.ctor);

      standardProviders.forEach((provider) => {
        module.addStandardProvider(this._moduleTokenFactory.create(provider), provider);
      });

      useClassProviders.forEach((provider) => {
        module.addCustomProvider(this._moduleTokenFactory.create(provider), provider);
      });

      module.isEntryProviderResolved = true;
    });

    // Add exports from metadata
    this._modules.forEach((module) => {
      const exports = ModuleUtil.getExportsForModule(module.ctor);

      if (exports.length === 0) {
        return;
      }

      exports.forEach((ctor) => {
        const token = this._moduleTokenFactory.getTokenByCtor(ctor);
        if (!token) {
          throw new UncaughtDependencyException('Exported provider is not initialized');
        }

        // If exported provider is a module, add it to exports
        if (ModuleUtil.isModule(ctor)) {
          module.addExport(token);

          return;
        }

        const provider = module.providers.get(token.token);
        if (!provider) {
          throw new Error('Exported provider is not existed in providers');
        }

        module.addExport(token);
      });

      module.isExportsResolved = true;
    });

    // Add providers from imported modules (add in exports)
    this._modules.forEach((module) => {
      const importedModules = Array.from(module.imports);

      importedModules.forEach((importedModule) => {
        this.addExportedProviderFromModule(module, importedModule, new Set<Module>());
      });
    });
  }

  public addExportedProviderFromModule(
    originModule: Module,
    currentModule: Module,
    resolvedModuleSet: Set<Module>,
  ) {
    if (resolvedModuleSet.has(currentModule)) {
      return;
    }

    resolvedModuleSet.add(currentModule);

    const exports = Array.from(currentModule.exports);

    exports.forEach((token) => {
      if (ModuleUtil.isModule(token.boundTarget)) {
        const targetModule = this._modules.get(token.boundTarget);
        if (!targetModule) {
          const msg = `Module '${token.boundTarget.name}' is not found`;
          throw new Error(msg);
        }

        this.addExportedProviderFromModule(originModule, targetModule, resolvedModuleSet);
        return;
      }

      const provider = currentModule.providers.get(token.token);
      if (!provider) {
        const msg = `Exported provider '${token.identifier}' is not existed in providers of module '${currentModule.ctor.name}'`;
        throw new Error(msg);
      }

      originModule.addExistingProvider(provider);
    });
  }
}
