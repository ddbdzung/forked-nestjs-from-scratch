import { PayloadInjectorInterface } from '@/core/interfaces/dependencies/injection-token.interface';
import { ForwardRefFn } from './forward-ref';
import { InjectionToken } from './injection-token';

export class PayloadInjector implements PayloadInjectorInterface {
  private _index: number;
  private _token: InjectionToken | ForwardRefFn<InjectionToken> | string | ForwardRefFn<string>;
  private _sourceConstructor: Ctr;
  private _injected: boolean;

  constructor(
    index: number,
    token: InjectionToken | ForwardRefFn<InjectionToken> | string | ForwardRefFn<string>,
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

  public set token(
    value: InjectionToken | ForwardRefFn<InjectionToken> | string | ForwardRefFn<string>,
  ) {
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
export function Inject(
  token: InjectionToken | ForwardRefFn<InjectionToken> | string | ForwardRefFn<string>,
) {
  return (target: Ctr, key: string | undefined, index: number) => {
    const metadataKey = PayloadInjector.getMetadataKey();

    const metadataValue = Array.isArray(Reflect.getMetadata(metadataKey, target))
      ? (Reflect.getMetadata(metadataKey, target) as PayloadInjector[])
      : [];

    metadataValue.push(new PayloadInjector(index, token, target, false));

    Reflect.defineMetadata(metadataKey, metadataValue, target);
  };
}
