import { forwardRef, InjectionToken } from '../../../src/core/dependencies';
import { DeliverModule } from '../../common/dependency.mocks';

describe('forwardRef', () => {
  let defaultInjectionToken: InjectionToken;
  beforeEach(() => {
    defaultInjectionToken = new InjectionToken('defaultToken').bindTo(DeliverModule);
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
