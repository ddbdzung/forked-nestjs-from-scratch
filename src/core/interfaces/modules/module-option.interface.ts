/* eslint-disable @typescript-eslint/no-explicit-any */

import { ForwardRefFn } from '@/core/dependencies/forward-ref';
import { Provider, Type } from '../common.interface';

export interface ModuleOptions {
  imports?: (Type<any> | ForwardRefFn<Type<any>>)[];
  providers?: Provider[];
  controllers?: Type<any>[];
  exports?: Type<any>[];
  model?: Type<any>;
}
