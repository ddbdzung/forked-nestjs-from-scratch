import { ForwardRefFn } from '@/core/dependencies/forward-ref';
import { InjectionToken } from '@/core/dependencies/injection-token';

export interface PayloadInjectorInterface {
  index: number;
  token: InjectionToken | ForwardRefFn<InjectionToken> | string | ForwardRefFn<string>;
  sourceConstructor: Ctr;
  injected: boolean;
}
