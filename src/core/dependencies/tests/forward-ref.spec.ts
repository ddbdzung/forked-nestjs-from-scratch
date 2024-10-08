import 'reflect-metadata';

import { forwardRef } from '../forward-ref';
import { InjectionToken } from '../injection-token';
import { DeliverModule } from './common/dependency.mocks';
import { uid } from 'uid/secure';

describe('forwardRef', () => {
  let defaultInjectionToken: InjectionToken;
  beforeEach(() => {
    defaultInjectionToken = new InjectionToken(uid(21), 'defaultToken').bindTo(DeliverModule);
  });

  it('should return a Function', () => {
    const fn = forwardRef(() => defaultInjectionToken);
    expect(fn).toBeInstanceOf(Function);
  });

  it('should return InjectionToken from called forwardRef', () => {
    const cb = () => defaultInjectionToken;
    const fn = forwardRef(cb);
    expect(fn()).toBe(defaultInjectionToken);
  });
});
