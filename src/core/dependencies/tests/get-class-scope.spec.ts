import 'reflect-metadata';

import { DeliverModule } from './common/dependency.mocks';
import { InjectableOptions, SCOPE, SCOPE_METADATA_KEY } from '../injectable.decorator';

describe('get-class-scope.ts', () => {
  test('getClassScope(target) should return scope value of class which is decorated by @Injectable', () => {
    const scope = Reflect.getMetadata(SCOPE_METADATA_KEY, DeliverModule) as InjectableOptions;

    expect(scope).toBeDefined();
    expect(scope).toHaveProperty('scope');
    expect(scope.scope).toBeDefined();
    expect(scope.scope).not.toEqual('');
  });
});
