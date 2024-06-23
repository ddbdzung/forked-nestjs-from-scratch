/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONSTRAINT_ENUM, DATA_TYPE_ENUM } from '@/core/constants/model.constant';
import { VERSION_API } from '@/core/constants/common.constant';

type ConstructorType = new (...args: any[]) => any;

interface IConstraintDetail {
  enums?: string[] | number[]; // Set enum for string / number field
  min?: number; // Set min value for number field
  max?: number; // Set max value for number field
  minLength?: number; // Set min length for string field
  maxLength?: number; // Set max length for string field
  pattern?: string; // Set pattern for string field
}

export interface ISchemaType extends IConstraintDetail {
  type: DATA_TYPE_ENUM;
  constraints?: CONSTRAINT_ENUM[];
  sharp?: DATA_TYPE_ENUM | Record<string, ISchemaType>; // Set sharp for array data type
  getter?: (v: unknown) => unknown; // Set getter for primitive data type
  defaultValue?: unknown; // Set default value for field
}

export interface IModel {
  name: string;
  schema: Record<string, ISchemaType>;
  middlewares?: unknown[]; // TODO: Implement later
  plugins?: unknown[];
}

export interface IModuleOptions {
  registry?: ConstructorType[];
  name?: string;
  model?: IModel;
  prefix?: string;
  version?: VERSION_API;
  provider?: ConstructorType[];
}

export interface IModelDecoratorOptions {
  plugins?: unknown[];
}

export interface IModelHandler {
  model: IModel;
}

export interface IContextAPI {
  modelName: string;
}

export interface IRepositoryDecoratorOptions {
  name: string;
}
