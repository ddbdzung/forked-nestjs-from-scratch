import 'reflect-metadata';

import {
  deliverModuleToken,
  userModuleToken,
  officeModuleToken,
  DeliverModule,
  OfficeModule,
} from '../../common/dependency.mocks';
import { InjectionToken } from '../../../src/core/dependencies';

describe('InjectionToken', () => {
  test('constructor with string should generate token', () => {
    const defaultInjectionToken = new InjectionToken('defaultToken');

    expect(defaultInjectionToken.token).toBeDefined();
  });

  test('constructor with class should generate token and bind token to identifier', () => {
    const defaultInjectionToken = new InjectionToken(DeliverModule);

    expect(defaultInjectionToken.token).toBeDefined();
    expect(defaultInjectionToken.boundTarget).toBe(DeliverModule);
  });

  test('create unique token even if pass the same string', () => {
    const defaultInjectionToken = new InjectionToken('defaultToken');
    const anotherInjectionToken = new InjectionToken('defaultToken');

    expect(defaultInjectionToken.token).not.toBe(anotherInjectionToken.token);
  });

  test('create unique token even if pass the same class', () => {
    const defaultInjectionToken = new InjectionToken(DeliverModule);
    const anotherInjectionToken = new InjectionToken(DeliverModule);

    expect(defaultInjectionToken.token).not.toBe(anotherInjectionToken.token);
  });

  test('create unique token for different string', () => {
    const defaultInjectionToken = new InjectionToken('defaultToken');
    const anotherInjectionToken = new InjectionToken('anotherToken');

    expect(defaultInjectionToken.token).not.toBe(anotherInjectionToken.token);
  });

  test('create unique token for different class', () => {
    const defaultInjectionToken = new InjectionToken(DeliverModule);
    const anotherInjectionToken = new InjectionToken(OfficeModule);

    expect(defaultInjectionToken.token).not.toBe(anotherInjectionToken.token);
  });

  test('bindTo() method should return to token itself', () => {
    const defaultInjectionToken = new InjectionToken('defaultToken');

    expect(defaultInjectionToken.bindTo(DeliverModule)).toBe(defaultInjectionToken);
  });

  test('bindTo() method should bind token to target class', () => {
    const defaultInjectionToken = new InjectionToken('defaultToken');
    defaultInjectionToken.bindTo(DeliverModule);

    expect(defaultInjectionToken.boundTarget).toBe(DeliverModule);

    defaultInjectionToken.bindTo(OfficeModule);

    expect(defaultInjectionToken.boundTarget).toBe(OfficeModule);
  });
});
