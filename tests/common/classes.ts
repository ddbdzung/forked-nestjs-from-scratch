export class UserModule implements IUserModule {
  private _fullName: string;

  constructor(
    @Inject(forwardRef(() => deliverModuleToken))
    _deliverModule: IDeliverModule,
  ) {}

  get fullName(): string {
    return this._fullName;
  }

  public createUser(fullName: string) {
    this._fullName = fullName;
    return this;
  }
}
