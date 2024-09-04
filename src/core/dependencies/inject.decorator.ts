import { IPayloadInjector } from '@/core/interfaces/dependencies/injection-token.interface';
import { ForwardRefFn, InjectionToken } from './injection-token';

/**
 * @description Inject decorator to module to class constructor
 * @implements
 */
export function Inject(token: InjectionToken | ForwardRefFn) {
  return (target: Ctr, key: string | undefined, index: number) => {
    const metadataKey = '__INJECT_CLASS_METADATA_KEY__';

    // Define metadata to mark the injected constructor parameter
    const payload: IPayloadInjector = {
      index,
      token,
      sourceConstructor: target,
      injected: false,
    };

    const metadataValue = Reflect.getMetadata(metadataKey, target) || [];
    metadataValue.push(payload);

    Reflect.defineMetadata(metadataKey, metadataValue, target);
  };
}
