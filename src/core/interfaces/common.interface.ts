/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document, HydratedDocument, ObjectId } from 'mongoose';

import {
  CONSTRAINT_ENUM,
  DATA_TYPE_ENUM,
  MODEL_MIDDLEWARE_HOOK_ENUM,
  MODEL_MIDDLEWARE_PERIOD_ENUM,
} from '@/core/constants/model.constant';
import { AbstractModel } from '@/core/helpers/model.helper';

type ConstructorType = new (...args: any[]) => any;

/** @public */
interface IConstraintDetail {
  enums?: string[] | number[]; // Set enum for string / number field
  min?: number; // Set min value for number field
  max?: number; // Set max value for number field
  minLength?: number; // Set min length for string field
  maxLength?: number; // Set max length for string field
  pattern?: string; // Set pattern for string field
}

/** @public */
export interface IPingResponse {
  msg: string;
}

/** @public */
export interface ISchemaType extends IConstraintDetail {
  alternateName?: string; // Set alternate name for field
  type: DATA_TYPE_ENUM;
  constraints?: CONSTRAINT_ENUM[];
  sharp?: DATA_TYPE_ENUM | Record<string, ISchemaType>; // Set sharp for array data type
  getter?: (v: unknown) => unknown; // Set getter for primitive data type
  defaultValue?: unknown; // Set default value for field
}

/** @public */
export type ISchema = Record<string, ISchemaType>;

type InterfaceWithoutMongooseDocumentKey<T extends Document> = {
  _id: T['_id'];
  __v: T['__v'];
} & Omit<T, keyof Document>;

/** @public */
export type ISchemaOfDocument<T extends Document> = InterfaceWithoutMongooseDocumentKey<T>;

/** @public */
export interface IVirtualType {
  getter?: () => unknown; // Set getter for virtual field
  setter?: (v: unknown) => void; // Set setter for virtual field
}

/** @public */
export interface IModel {
  name?: string;
  schema: Record<string, ISchemaType>;
  virtuals?: Record<string, IVirtualType>;
  middlewares?: unknown[]; // TODO: Implement later
  plugins?: unknown[];
}

/** @public */
export interface IModuleOptions {
  sysModule?: ConstructorType[]; // List of system modules (only for MainModule) (ex config, logger)
  bizModule?: ConstructorType[]; // List of biz modules (only for MainModule)
  moduleName?: string; // Name of the module
  provider?: ConstructorType[]; // List of providers (config, controller, constant, service)
  repository?: ConstructorType; // Repository of the module
  model?: ConstructorType; // Model of the module
  isGlobal?: boolean; // Set global module
  controller?: ConstructorType; // Controller of the module
}

/** @public */
export interface IModelDecoratorOptions {
  plugins?: unknown[];
}

/** @public */
export interface IModelHandler {
  model: AbstractModel;
  moduleName: string;
}

/** @public */
export interface IContextAPI {
  modelName: string;
}

/** @public */
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

/** @public */
export interface IModelMiddleware {
  periods: MODEL_MIDDLEWARE_PERIOD_ENUM[];
  hooks: MODEL_MIDDLEWARE_HOOK_ENUM[];
  handler: () => Promise<void>;
}

interface ISchemaTimestampType {
  isUsed: boolean; // Set to true to use timestamp field
  alternateName?: string; // Set alternate name for timestamp field in Mongoose schema
}

/** @public */
export interface IModelTimestamp {
  createdAt?: ISchemaTimestampType;
  updatedAt?: ISchemaTimestampType;
}
