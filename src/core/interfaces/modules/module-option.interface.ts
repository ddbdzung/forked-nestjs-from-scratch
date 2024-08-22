/* eslint-disable @typescript-eslint/no-explicit-any */

import { Type } from '../common.interface';

export interface ModuleOptions {
  imports?: Type<any>[];
  exports?: Type<any>[];
}
