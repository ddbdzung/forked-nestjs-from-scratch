import { IModel } from '../interfaces/common.interface';

export abstract class AbstractModule {
  public abstract model: IModel | null;
  public name?: string;
}
