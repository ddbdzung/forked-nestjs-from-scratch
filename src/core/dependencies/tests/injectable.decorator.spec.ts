import 'reflect-metadata';

import { PayloadInjectorInterface } from '@/core/interfaces/dependencies/injection-token.interface';
import { DeliverModule, OfficeModule, UserModule } from './common/dependency.mocks';
import { InjectionToken } from '../injection-token';
import { InjectableOptions, SCOPE, SCOPE_METADATA_KEY } from '../injectable.decorator';

describe('InjectableDecorator', () => {
  test('@Injectable class should have design:paramtypes metadata key', () => {
    const metadataKey = 'design:paramtypes';
    const metadataDeliverModule = Reflect.getMetadataKeys(DeliverModule);
    const metadataOfficeModule = Reflect.getMetadataKeys(OfficeModule);
    const metadataUserModule = Reflect.getMetadataKeys(UserModule);

    expect(metadataDeliverModule).toContain(metadataKey);
    expect(metadataOfficeModule).toContain(metadataKey);
    expect(metadataUserModule).toContain(metadataKey);
  });

  test('@Injectable should define Scope metadata in target class', () => {
    const options = Reflect.getMetadata(SCOPE_METADATA_KEY, DeliverModule);

    expect(options).toBeDefined();
    expect(options).toHaveProperty('scope');

    // Default scope is singleton
    const optionalOption = Reflect.getMetadata(SCOPE_METADATA_KEY, UserModule) as InjectableOptions;
    expect(optionalOption).toBeDefined();
    expect(optionalOption).toHaveProperty('scope');
    expect(optionalOption.scope).toBe(SCOPE.DEFAULT);
  });
});
