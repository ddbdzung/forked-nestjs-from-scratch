/* eslint-disable @typescript-eslint/no-explicit-any */

import { Type } from '../common.interface';

export interface ModuleOptions {
  imports?: Type<any>[];
  providers?: Type<any>[];
  controllers?: Type<any>[];
  exports?: Type<any>[];
}
