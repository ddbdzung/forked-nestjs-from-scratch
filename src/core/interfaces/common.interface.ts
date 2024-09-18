import type { Document, HydratedDocument, ObjectId } from 'mongoose';

import { SCOPE } from '../dependencies';

/** @public */
export interface PingResponse {
  msg: string;
}

type InterfaceWithoutMongooseDocumentKey<T extends Document> = {
  _id: T['_id'];
  __v: T['__v'];
} & Omit<T, keyof Document>;

/** @public */
export type ISchemaOfDocument<T extends Document> = InterfaceWithoutMongooseDocumentKey<T>;

/** @public */
export interface ContextAPI {
  modelName: string;
}

export interface UseClassProvider {
  provide: string;
  useClass: Type;
  /**
   * Default is 'DEFAULT' (singleton)
   */
  scope?: SCOPE;
}

export type Provider = Type | UseClassProvider;

export type CustomProvider = Exclude<Provider, Type>;
