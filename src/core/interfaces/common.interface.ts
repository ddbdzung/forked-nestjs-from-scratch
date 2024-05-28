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
}

export interface IModelDecoratorOptions {
  plugins?: unknown[];
}
