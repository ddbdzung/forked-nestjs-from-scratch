import { InjectionToken, SCOPE } from './dependencies';

export class InstanceWrapper<T> {
  private _scope: SCOPE = SCOPE.DEFAULT;
  private _instance: T;
  private _token: InjectionToken;
  private _identifier: string;
  private _isResolved = false; // Is resolved by DI Container
  private _ctor: Ctr;

  private _initialize(metadata: Partial<InstanceWrapper<T>>) {
    Object.assign(this, metadata);
  }

  constructor(metadata: Partial<InstanceWrapper<T>>) {
    this._initialize(metadata);
  }

  get instance() {
    return this._instance;
  }

  set instance(value: T) {
    this._instance = value;
  }

  get scope() {
    return this._scope;
  }

  set scope(value: SCOPE) {
    this._scope = value;
  }

  get token() {
    return this._token;
  }

  set token(value: InjectionToken) {
    this._token = value;
  }

  get identifier() {
    return this._identifier;
  }

  set identifier(value: string) {
    this._identifier = value;
  }

  get isResolved() {
    return this._isResolved;
  }

  set isResolved(value: boolean) {
    this._isResolved = value;
  }

  get ctor() {
    return this._ctor;
  }

  set ctor(value: Ctr) {
    this._ctor = value;
  }
}
