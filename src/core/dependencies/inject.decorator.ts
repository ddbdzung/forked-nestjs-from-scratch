import { IPayloadInjector } from '@/core/interfaces/dependencies/injection-token.interface';
import { ForwardRefFn, InjectionToken } from './injection-token';

export class PayloadInjector implements IPayloadInjector {
  private _index: number;
  private _token: InjectionToken | ForwardRefFn;
  private _sourceConstructor: Ctr;
  private _injected: boolean;

  constructor(
    index: number,
    token: InjectionToken | ForwardRefFn,
    sourceConstructor: Ctr,
    injected: boolean,
  ) {
    this._index = index;
    this._token = token;
    this._sourceConstructor = sourceConstructor;
    this._injected = injected;

    return this;
  }

  public static getMetadataKey() {
    return '__INJECT_CLASS_METADATA_KEY__';
  }

  public get index() {
    return this._index;
  }

  public get token() {
    return this._token;
  }

  public set token(value: InjectionToken | ForwardRefFn) {
    this._token = value;
  }

  public get sourceConstructor() {
    return this._sourceConstructor;
  }

  public get injected() {
    return this._injected;
  }

  public set injected(value: boolean) {
    this._injected = value;
  }
}

/**
 * @description Inject decorator to module to class constructor
 * @implements
 */
export function Inject(token: InjectionToken | ForwardRefFn) {
  return (target: Ctr, key: string | undefined, index: number) => {
    const metadataKey = PayloadInjector.getMetadataKey();
    const metadataValue = Reflect.getMetadata(metadataKey, target) || [];
    metadataValue.push(new PayloadInjector(index, token, target, false));

    Reflect.defineMetadata(metadataKey, metadataValue, target);
  };
}
