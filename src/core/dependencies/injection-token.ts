import { uid } from 'uid/secure';
import { createHash } from 'crypto';

export const METADATA_TOKEN_KEY = '__METADATA_TOKEN_KEY__';

export type ForwardRefFn = () => InjectionToken;

// TODO: Save InjectionToken to central container
/**
 * @description InjectionToken related to itself class constructor
 * @implements
 */
export class InjectionToken {
  private _id: string;
  private _identifier: string | Ctr;
  private _token: string;
  private _boundTarget: Ctr;

  private _generateId(): string {
    return uid(21);
  }

  private _generateToken(id: string, name: string): string {
    return createHash('sha256').update(`${id}_${name}`).digest('hex');
  }

  constructor(identifier: string | Ctr) {
    this._id = this._generateId();

    if (typeof identifier === 'string') {
      this._token = this._generateToken(this._id, identifier);
    } else if (typeof identifier === 'function') {
      this.bindTo(identifier);
      this._token = this._generateToken(this._id, identifier.name);
    }

    return this;
  }

  public get token() {
    return this._token;
  }

  public get boundTarget() {
    return this._boundTarget;
  }

  public bindTo(target: Ctr) {
    this._boundTarget = target;
    return this;
  }
}
