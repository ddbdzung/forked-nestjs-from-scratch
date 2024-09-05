export interface IUserModule {
  fullName: string;
  createUser(fullName: string): IUserModule;
}

export interface IDeliverModule {
  userDrivingToOffice(): void;
}

export interface IOfficeModule {
  userArrivedToOffice(): void;
}
