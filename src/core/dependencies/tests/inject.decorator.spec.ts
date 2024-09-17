import 'reflect-metadata';

import { DeliverModule } from './common/dependency.mocks';
import { InjectionToken } from '../injection-token';
import { PayloadInjectorInterface } from '@/core/interfaces/dependencies/injection-token.interface';

describe('InjectDecorator', () => {
  test('@Inject class should have metadata in target class', () => {
    const metadataKey = '__INJECT_CLASS_METADATA_KEY__';
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
