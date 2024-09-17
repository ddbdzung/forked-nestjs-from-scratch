import { uid } from 'uid/secure';
import { createHash } from 'crypto';
import { UncaughtDependencyException } from './exception';
import { isFunction, isString } from '../utils/validator.util';

/**
 * @description InjectionToken related to itself class constructor
 * @public
 */
export class InjectionToken {
  private _id: string;
  private _identifier: string | Ctr;
  private _token: string;
  private _boundTarget: Ctr;

  private _generateToken(id: string, name: string): string {
    return createHash('sha256').update(`${id}_${name}`).digest('hex');
  }

  constructor(id: string, identifier: string | Ctr) {
    this._id = id;

    if (isString(identifier)) {
      this._identifier = identifier;
      this._token = this._generateToken(id, identifier);
    } else if (isFunction(identifier)) {
      this._identifier = identifier.name;
      this._token = this._generateToken(id, identifier.name);

      this.bindTo(identifier);
    }

    return this;
  }

  public get token() {
    return this._token;
  }

  public get identifier() {
    return this._identifier;
  }

  public get id() {
    return this._id;
  }

  public get boundTarget() {
    return this._boundTarget;
  }

  public bindTo(target: Ctr) {
    this._boundTarget = target;
    return this;
  }
}
