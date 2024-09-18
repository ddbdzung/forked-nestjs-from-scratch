import { ForwardRefFn } from '@/core/dependencies/forward-ref';
import { Provider } from '../common.interface';

export interface ModuleOptions {
  imports?: (Type | ForwardRefFn<Type>)[];
  providers?: Provider[];
  controllers?: Type[];
  exports?: Type[];
  model?: Type;
}
