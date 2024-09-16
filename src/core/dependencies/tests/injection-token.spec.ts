import 'reflect-metadata';

import {
  deliverModuleToken,
  userModuleToken,
  officeModuleToken,
  DeliverModule,
  OfficeModule,
} from './common/dependency.mocks';
import { InjectionToken } from '../injection-token';
import { uid } from 'uid/secure';

describe('InjectionToken', () => {
  test('constructor with string should generate token', () => {
    const defaultInjectionToken = new InjectionToken(uid(21), 'defaultToken');

    expect(defaultInjectionToken.token).toBeDefined();
  });

  test('constructor with class should generate token and bind token to identifier', () => {
    const defaultInjectionToken = new InjectionToken(uid(21), DeliverModule);

    expect(defaultInjectionToken.token).toBeDefined();
    expect(defaultInjectionToken.boundTarget).toBe(DeliverModule);
  });

  test('create unique token even if pass the same string', () => {
    const defaultInjectionToken = new InjectionToken(uid(21), 'defaultToken');
    const anotherInjectionToken = new InjectionToken(uid(21), 'defaultToken');

    expect(defaultInjectionToken.token).not.toBe(anotherInjectionToken.token);
  });

  test('create unique token even if pass the same class', () => {
    const defaultInjectionToken = new InjectionToken(uid(21), DeliverModule);
    const anotherInjectionToken = new InjectionToken(uid(21), DeliverModule);

    expect(defaultInjectionToken.token).not.toBe(anotherInjectionToken.token);
  });

  test('create unique token for different string', () => {
    const defaultInjectionToken = new InjectionToken(uid(21), 'defaultToken');
    const anotherInjectionToken = new InjectionToken(uid(21), 'anotherToken');

    expect(defaultInjectionToken.token).not.toBe(anotherInjectionToken.token);
  });

  test('create unique token for different class', () => {
    const defaultInjectionToken = new InjectionToken(uid(21), DeliverModule);
    const anotherInjectionToken = new InjectionToken(uid(21), OfficeModule);

    expect(defaultInjectionToken.token).not.toBe(anotherInjectionToken.token);
  });

  test('bindTo() method should return to token itself', () => {
    const defaultInjectionToken = new InjectionToken(uid(21), 'defaultToken');

    expect(defaultInjectionToken.bindTo(DeliverModule)).toBe(defaultInjectionToken);
  });

  test('bindTo() method should bind token to target class', () => {
    const defaultInjectionToken = new InjectionToken(uid(21), 'defaultToken');
    defaultInjectionToken.bindTo(DeliverModule);

    expect(defaultInjectionToken.boundTarget).toBe(DeliverModule);

    defaultInjectionToken.bindTo(OfficeModule);

    expect(defaultInjectionToken.boundTarget).toBe(OfficeModule);
  });
});
