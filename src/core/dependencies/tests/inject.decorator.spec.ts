import 'reflect-metadata';

import { PayloadInjectorInterface } from '@/core/interfaces/dependencies/injection-token.interface';
import { DeliverModule } from './common/dependency.mocks';
import { InjectionToken } from '../injection-token';
import { PayloadInjector } from '../inject.decorator';

describe('InjectDecorator', () => {
  test('@Inject class should have metadata in target class', () => {
    const metadataKey = PayloadInjector.getMetadataKey();
    const metadataValue = Reflect.getMetadata(
      metadataKey,
      DeliverModule,
    ) as PayloadInjectorInterface[];

    expect(metadataValue).toBeDefined();
    expect(metadataValue).toBeInstanceOf(Array);
    expect(metadataValue.length).toBe(2);

    const [officeInjectorPayload, userInjectorPayload] = metadataValue;

    expect(officeInjectorPayload.index).toBe(1);
    expect(officeInjectorPayload.token).toBeInstanceOf(InjectionToken);
    expect(officeInjectorPayload.sourceConstructor).toBe(DeliverModule);
    expect(officeInjectorPayload.injected).toBeFalsy();

    expect(userInjectorPayload.index).toBe(0);
    expect(userInjectorPayload.token).toBeInstanceOf(Function);
    expect(userInjectorPayload.sourceConstructor).toBe(DeliverModule);
    expect(userInjectorPayload.injected).toBeFalsy();

    expect(officeInjectorPayload.token).not.toBe(userInjectorPayload.token);
  });
});
