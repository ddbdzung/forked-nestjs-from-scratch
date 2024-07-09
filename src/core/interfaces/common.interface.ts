/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONSTRAINT_ENUM, DATA_TYPE_ENUM } from '@/core/constants/model.constant';
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
  isGlobal?: boolean;
  dynamicModule?: boolean;
}

export interface IModuleOptionsV2 {
  sysModule?: ConstructorType[]; // List of system modules (only for MainModule) (ex config, logger)
  bizModule?: ConstructorType[]; // List of biz modules (only for MainModule)
  moduleName?: string; // Name of the module
  provider?: ConstructorType[]; // List of providers (config, controller, constant, service)
  repository?: ConstructorType; // Repository of the module
  model?: ConstructorType; // Model of the module
  isGlobal?: boolean; // Set global module
  dynamicModule?: boolean; // Set dynamic module
}

export interface IModelDecoratorOptions {
  plugins?: unknown[];
}

export interface IModelHandler {
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
