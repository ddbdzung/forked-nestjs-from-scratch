import 'reflect-metadata';

import { DIContainer } from '../dependency-container';
import { InjectionToken } from '../injection-token';
import {
  DeliverModule,
  deliverModuleToken,
  OfficeModule,
  officeModuleToken,
  UserModule,
  userModuleToken,
} from './common/dependency.mocks';
import { IDeliverModule, IOfficeModule, IUserModule } from './common/common.interface';
import { uid } from 'uid/secure';

class MockDependency {}

describe('DIContainer', () => {
  let container: DIContainer;

  beforeEach(() => {
    container = DIContainer.getInstance();
  });

  afterEach(() => {
    container.instanceDict.clear();
  });

  test('should be a singleton', () => {
    const instance1 = DIContainer.getInstance();
    const instance2 = DIContainer.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('should store and retrieve instances by token', () => {
    const mockInstance = new MockDependency();
    const token = new InjectionToken(uid(21), 'MockDependency');
    container.instanceDict.set(token.token, mockInstance);

    const retrievedInstance = container.getDependencyByToken<MockDependency>(token);
    expect(retrievedInstance).toBe(mockInstance);
  });

  test('should construct and store new instance', () => {
    const officeModule = container.construct<IOfficeModule>(OfficeModule, officeModuleToken);
    const userModule = container.construct<IUserModule>(UserModule, userModuleToken);
    const deliverModule = container.construct<IDeliverModule>(DeliverModule, deliverModuleToken);

    expect(officeModule).toBeDefined();
    expect(userModule).toBeDefined();
    expect(deliverModule).toBeDefined();

    expect(container.instanceDict.size).toBe(3);
    expect(container.instanceDict.get(officeModuleToken.token)).toBe(officeModule);
    expect(container.instanceDict.get(userModuleToken.token)).toBe(userModule);
    expect(container.instanceDict.get(deliverModuleToken.token)).toBe(deliverModule);

    // Check if dependencies are injected correctly
    expect(deliverModule).toBeInstanceOf(DeliverModule);
    expect(deliverModule).toHaveProperty('_userModule', userModule);
    expect(deliverModule).toHaveProperty('_officeModule', officeModule);
  });
});
