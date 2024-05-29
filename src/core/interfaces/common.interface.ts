import { VERSION_API } from '@/core/constants/common.constant';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConstructorType = new (...args: any[]) => any;

export interface IModel {
  name: string;
  schema: Record<string, unknown>;
}

export interface IModuleOptions {
  registry?: ConstructorType[];
  name?: string;
  model?: IModel;
  prefix?: string;
  version?: VERSION_API;
}

export interface IModelDecoratorOptions {
  plugins?: unknown[];
}

export interface IModelHandler {
  model: IModel;
}
