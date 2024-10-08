import { forwardRef } from '../../forward-ref';
import { InjectionToken } from '../../injection-token';
import { Inject } from '../../inject.decorator';
import { Injectable } from '../../injectable.decorator';

import { IDeliverModule, IOfficeModule, IUserModule } from './common.interface';
import { uid } from 'uid/secure';

@Injectable()
export class OfficeModule implements IOfficeModule {
  constructor(location?: string, employeeQty?: null | undefined) {
    // eslint-disable-next-line no-console
    // console.debug('OfficeModule constructor');
  }

  public userArrivedToOffice(): void {
    // eslint-disable-next-line no-console
    console.debug('User arrived to office');
  }
}

export const officeModuleToken = new InjectionToken(uid(21), OfficeModule);

@Injectable()
export class UserModule implements IUserModule {
  private _fullName: string;

  constructor(
    @Inject(forwardRef(() => deliverModuleToken))
    _deliverModule: IDeliverModule,
  ) {
    // eslint-disable-next-line no-console
    // console.debug('UserModule constructor');
  }

  get fullName(): string {
    return this._fullName;
  }

  public createUser(fullName: string) {
    this._fullName = fullName;
    return this;
  }
}

export const userModuleToken = new InjectionToken(uid(21), UserModule);

@Injectable()
export class DeliverModule implements IDeliverModule {
  constructor(
    @Inject(forwardRef(() => userModuleToken))
    private _userModule: IUserModule,
    @Inject(officeModuleToken)
    private _officeModule: IOfficeModule,
  ) {}

  userDrivingToOffice(): void {
    // eslint-disable-next-line no-console
    console.debug('User driving to office');
    this._userModule.createUser('Dzung Dang');
    this._officeModule.userArrivedToOffice();
  }
}

export const deliverModuleToken = new InjectionToken(uid(21), DeliverModule);
