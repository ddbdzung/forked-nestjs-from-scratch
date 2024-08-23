import { uid } from 'uid/secure';
import { Type } from '@/core/interfaces/common.interface';
import type { InjectionToken } from '../dependency-injection.type';

import { DependencyContainer } from '../container';

export class Module {
  // module token = hash(${moduleId}_${moduleName}) => to avoid conflicts with the same module name in different modules
  private _token: string;
  private readonly _id: string;
  private readonly _imports = new Set<Module>();
  private readonly _providers = new Map<InjectionToken, unknown>();
  private readonly _controllers = new Map<InjectionToken, Controller>();
  private readonly _exports = new Set<InjectionToken>();
  private _isGlobal = false;

  private _generateUid() {
    return uid(21);
  }

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly _metatype: Type<any>,
    private readonly container: DependencyContainer,
  ) {
    this._id = this._generateUid();
  }

  get id(): string {
    return this._id;
  }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }
}
