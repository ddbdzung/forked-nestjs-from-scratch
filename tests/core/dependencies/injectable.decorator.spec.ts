import 'reflect-metadata';

import { DeliverModule, OfficeModule, UserModule } from '../../common/dependency.mocks';
import { IPayloadInjector } from '../../../src/core/interfaces/dependencies/injection-token.interface';
import { InjectionToken } from '../../../src/core/dependencies';

describe('InjectableDecorator', () => {
  test('@Injectable class should have metadata in target class', () => {
    const metadataKey = 'design:paramtypes';
    const metadataDeliverModule = Reflect.getMetadata(metadataKey, DeliverModule) as unknown[];

    expect(metadataDeliverModule).toBeDefined();
    expect(metadataDeliverModule).toBeInstanceOf(Array);
    expect(metadataDeliverModule.length).toBe(2);

    const metadataUserModule = Reflect.getMetadata(metadataKey, UserModule) as unknown[];
    expect(metadataUserModule).toBeDefined();
    expect(metadataUserModule).toBeInstanceOf(Array);
    expect(metadataUserModule.length).toBe(1);

    const metadataOfficeModule = Reflect.getMetadata(metadataKey, OfficeModule) as unknown[];
    expect(metadataOfficeModule).toBeDefined();
    expect(metadataOfficeModule).toBeInstanceOf(Array);
    expect(metadataOfficeModule.length).toBe(2);
  });
});
