/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONSTRAINT_ENUM, DATA_TYPE_ENUM } from '@/core/constants/model.constant';
import { VERSION_API } from '@/core/constants/common.constant';
import { Document, Schema } from 'mongoose';
import { AbstractModel } from '../helpers/module.helper';

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

export interface IVirtualType {
  getter?: () => unknown; // Set getter for virtual field
  setter?: (v: unknown) => void; // Set setter for virtual field
}

export interface IModel {
  /**
   * Name of the model (define in *.config.ts file)
   */
  name?: string;
  schema: Record<string, ISchemaType>;
  virtuals?: Record<string, IVirtualType>;
  middlewares?: unknown[]; // TODO: Implement later
  plugins?: unknown[];
}

export interface IModuleOptions {
  registry?: ConstructorType[];
  name?: string;
  provider?: ConstructorType[];
  repository?: ConstructorType;
  model?: ConstructorType;
}

export interface IModelDecoratorOptions {
  plugins?: unknown[];
}

export interface IModelHandler {
  model: IModel;
  moduleName: string;
}

export interface ImodelHandler {
  model: AbstractModel;
  moduleName: string;
}

export interface IContextAPI {
  modelName: string;
}

export interface ConstraintDefinition {
  required: boolean;
  unique: boolean;
  minlength?: number;
  maxlength?: number;
  match?: RegExp;
  enum?: string[] | number[];
  min?: number;
  max?: number;
  default?: unknown;
}
