import { uid } from 'uid/secure';

import { Module } from '../common/module.decorator';
import { Injectable, InjectionToken } from '../dependencies';
import { Module as ModuleConstructor } from '../module';
import { ModuleFactory } from '../module-factory';
import { CustomProvider, UseClassProvider } from '../interfaces/common.interface';
import { InstanceWrapper } from '../instance-wrapper';
import { initMetadataApplication } from './utils/init-metadata-application';
import { isString } from '../utils/validator.util';

describe('Module', () => {
  @Injectable()
  class MockService {}

  @Injectable()
  class MockAnotherService {}

  @Module({
    imports: [],
    exports: [MockAnotherService],
    providers: [MockAnotherService],
  })
  class MockAnotherModule {}

  @Module({
    imports: [MockAnotherModule],
    exports: [],
    providers: [MockService],
  })
  class MockModule {}

  @Module({
    imports: [],
    exports: [],
    providers: [],
  })
  class MockIndependentModule {}

  @Module({
    imports: [MockModule, MockAnotherModule, MockIndependentModule],
  })
  class MainModule {}

  const mockModuleInjectionToken = new InjectionToken(uid(21), MockModule);

  it('should have the correct injection token', () => {
    const module = new ModuleConstructor(MockModule, mockModuleInjectionToken);

    expect(module.injectionToken).toBe(mockModuleInjectionToken);
  });

  it('should have the correct constructor', () => {
    const module = new ModuleConstructor(MockModule, mockModuleInjectionToken);

    expect(module.ctor).toBe(MockModule);
  });

  it('should have the correct level', () => {
    const module = new ModuleConstructor(MockModule, mockModuleInjectionToken, 1);

    expect(module.level).toBe(1);
  });

  describe('.isEntryProvider()', () => {
    const moduleFactory = initMetadataApplication(MainModule);
    const mockModule = moduleFactory.modules.get(MockModule) as ModuleConstructor;
    const mockServiceInjectionToken = moduleFactory.moduleTokenFactory.getTokenByCtor(
      MockService,
    ) as InjectionToken;

    afterEach(() => {
      mockModule.isImportsResolved = true;
    });

    it('should init correct suite test', () => {
      expect(moduleFactory.modules.get(MockModule)).toBeDefined();
      expect(moduleFactory.moduleTokenFactory.getTokenByCtor(MockService)).toBeDefined();
    });

    it('should throw error if isImportsResolved is false', () => {
      mockModule.isImportsResolved = false;

      expect(() => mockModule.isEntryProvider(mockServiceInjectionToken)).toThrowError();
    });

    it('should return true if the provider key is not resolved provider in imports', () => {
      expect(mockModule.isEntryProvider(mockServiceInjectionToken)).toBe(true);
    });

    it('should return false if the provider key is resolved provider in imports', () => {
      const mockAnotherServiceInjectionToken = moduleFactory.moduleTokenFactory.getTokenByCtor(
        MockAnotherService,
      ) as InjectionToken;

      expect(mockModule.isEntryProvider(mockAnotherServiceInjectionToken)).toBe(false);
    });
  });

  describe('.addCustomProvider()', () => {
    const moduleFactory = initMetadataApplication(MainModule);
    class MockUseClassService {}
    const mockModule = moduleFactory.modules.get(MockModule) as ModuleConstructor;

    const mockUseClassProvider: UseClassProvider = {
      provide: 'MockUseClassService',
      useClass: MockUseClassService,
    };

    const mockUseClassServiceInjectionToken =
      moduleFactory.moduleTokenFactory.create(mockUseClassProvider);

    mockModule.addCustomProvider(mockUseClassServiceInjectionToken, mockUseClassProvider);

    moduleFactory.diContainer.construct(
      MockUseClassService,
      mockUseClassServiceInjectionToken,
      mockModule,
    );

    it('should init correct suite test', () => {
      expect(moduleFactory.modules.get(MockModule)).toBeDefined();
    });

    it('should add a custom provider', () => {
      expect(mockModule.entryProviderKeys.has(mockUseClassServiceInjectionToken)).toBe(true); // Not exist in imported modules

      const createdProvider = mockModule.providers.get(
        mockUseClassServiceInjectionToken.token,
      ) as InstanceWrapper<unknown>;

      expect(createdProvider).toBeDefined();
      expect(createdProvider).toBeInstanceOf(InstanceWrapper);
      expect(createdProvider.instance).toBeInstanceOf(MockUseClassService);
    });
  });

  describe('.addStandardProvider()', () => {
    const moduleFactory = initMetadataApplication(MainModule);
    const mockModule = moduleFactory.modules.get(MockModule) as ModuleConstructor;

    it('should init correct suite test', () => {
      expect(moduleFactory.modules.get(MockModule)).toBeDefined();
    });

    it('should add a standard provider', () => {
      class MockStandardService {}

      const mockStandardServiceInjectionToken =
        moduleFactory.moduleTokenFactory.create(MockStandardService);

      mockModule.addStandardProvider(mockStandardServiceInjectionToken, MockStandardService);

      moduleFactory.diContainer.construct(
        MockStandardService,
        mockStandardServiceInjectionToken,
        mockModule,
      );

      expect(mockModule.providers.has(mockStandardServiceInjectionToken.token)).toBe(true);
      expect(mockModule.entryProviderKeys.has(mockStandardServiceInjectionToken)).toBe(true); // Not exist in imported modules

      const createdProvider = mockModule.providers.get(
        mockStandardServiceInjectionToken.token,
      ) as InstanceWrapper<unknown>;

      expect(createdProvider).toBeDefined();
      expect(createdProvider).toBeInstanceOf(InstanceWrapper);
      expect(createdProvider.instance).toBeInstanceOf(MockStandardService);
    });
  });
  // TODO: Test addExistingProvider()

  describe('.addExistingProvider()', () => {
    const moduleFactory = initMetadataApplication(MainModule);
    const mockModule = moduleFactory.modules.get(MockModule) as ModuleConstructor;

    it('should init correct suite test', () => {
      expect(moduleFactory.modules.get(MockModule)).toBeDefined();
    });

    it('should add an existing provider', () => {
      class MockExistingService {}

      const mockExistingServiceInjectionToken =
        moduleFactory.moduleTokenFactory.create(MockExistingService);

      const instanceWrapper = new InstanceWrapper({
        token: mockExistingServiceInjectionToken,
        ctor: MockExistingService,
        identifier: isString(mockExistingServiceInjectionToken.identifier)
          ? mockExistingServiceInjectionToken.identifier
          : MockExistingService.name,
        instance: null,
      });
      mockModule.addExistingProvider(instanceWrapper);

      moduleFactory.diContainer.construct(
        MockExistingService,
        mockExistingServiceInjectionToken,
        mockModule,
      );

      expect(mockModule.providers.has(mockExistingServiceInjectionToken.token)).toBe(true);
      expect(mockModule.entryProviderKeys.has(mockExistingServiceInjectionToken)).toBe(false);

      const createdProvider = mockModule.providers.get(
        mockExistingServiceInjectionToken.token,
      ) as InstanceWrapper<unknown>;

      expect(createdProvider).toBeDefined();
      expect(createdProvider).toBeInstanceOf(InstanceWrapper);
      expect(createdProvider.instance).toBeInstanceOf(MockExistingService);
    });
  });

  describe('.addImport()', () => {
    const moduleFactory = initMetadataApplication(MainModule);
    const mockModule = moduleFactory.modules.get(MockModule) as ModuleConstructor;
    const mockIndependentModule = moduleFactory.modules.get(
      MockIndependentModule,
    ) as ModuleConstructor;

    it('should init correct suite test', () => {
      expect(mockModule).toBeDefined();
      expect(mockIndependentModule).toBeDefined();
    });

    it('should add module to imports', () => {
      mockModule.addImport(mockIndependentModule);

      expect(mockModule.imports.has(mockIndependentModule)).toBe(true);
    });
  });

  describe('.addExport()', () => {
    const moduleFactory = initMetadataApplication(MainModule);
    const mockModule = moduleFactory.modules.get(MockModule) as ModuleConstructor;
    const mockServiceInjectionToken = moduleFactory.moduleTokenFactory.getTokenByCtor(
      MockService,
    ) as InjectionToken;

    it('should init correct suite test', () => {
      expect(mockModule).toBeDefined();
      expect(moduleFactory.moduleTokenFactory.getTokenByCtor(MockService)).toBeDefined();
    });

    it('should add a provider to exports', () => {
      mockModule.addExport(mockServiceInjectionToken);

      expect(mockModule.exports.has(mockServiceInjectionToken)).toBe(true);
    });
  });

  describe('.getProviderByToken()', () => {
    const moduleFactory = initMetadataApplication(MainModule);
    const mockModule = moduleFactory.modules.get(MockModule) as ModuleConstructor;
    const mockServiceInjectionToken = moduleFactory.moduleTokenFactory.getTokenByCtor(
      MockService,
    ) as InjectionToken;

    it('should init correct suite test', () => {
      expect(mockModule).toBeDefined();
      expect(moduleFactory.moduleTokenFactory.getTokenByCtor(MockService)).toBeDefined();
    });

    it('should return the correct provider', () => {
      const provider = mockModule.getProviderByToken(
        mockServiceInjectionToken,
      ) as InstanceWrapper<unknown>;

      expect(provider).toBeDefined();
      expect(provider).toBeInstanceOf(InstanceWrapper);
      expect(provider.instance).toBeInstanceOf(MockService);
    });
  });
});
