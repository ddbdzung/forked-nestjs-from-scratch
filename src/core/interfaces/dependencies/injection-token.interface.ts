import { ForwardRefFn, InjectionToken } from '@/core/dependencies/injection-token';

export interface IPayloadInjector {
  index: number;
  token: InjectionToken | ForwardRefFn;
  sourceConstructor: Ctr;
  injected: boolean;
}
