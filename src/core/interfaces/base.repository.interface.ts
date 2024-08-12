/* eslint-disable @typescript-eslint/ban-types */
import type { UpdateOptions, DeleteResult } from 'mongodb';
import type {
  Document,
  IfAny,
  MongooseUpdateQueryOptions,
  Require_id,
  UpdateWriteOpResult,
  QueryOptions,
  FilterQuery,
} from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IfUpdateHasResult<T> = [null, IfAny<T, any, Document<unknown, {}, T> & Require_id<T>>];

/** @public */
// Mongoose Base Repository Interface
export interface IBaseRepository<T> {
  create(data: T | T[]): Promise<IfHasResult<T> | IfHasNoResult>;
  findById(
    id: string,
    projection?: Record<string, unknown>,
    opt?: QueryOptions<T> | null,
  ): Promise<IfHasResult<T> | IfHasNoResult>;
  findOne(query: FilterQuery<T>): Promise<IfHasResult<T> | IfHasNoResult>;
  find(
    query: FilterQuery<T>,
    projection?: Record<string, unknown>,
    opt?: QueryOptions<T> | null,
  ): Promise<IfHasResult<T> | IfHasNoResult>;
  findAll(
    projection?: Record<string, unknown>,
    opt?: QueryOptions<T> | null,
  ): Promise<IfHasResult<T> | IfHasNoResult>;
  updateById(id: string, data: Partial<T>): Promise<IfUpdateHasResult<T> | IfHasNoResult>;
  updateManyByQuery(
    filter: Record<string, unknown>,
    update: Partial<T>,
    opt?: (UpdateOptions & MongooseUpdateQueryOptions<T>) | null,
  ): Promise<[null, UpdateWriteOpResult] | [Error, null]>;
  deleteById(id: string): Promise<IfHasResult<T> | IfHasNoResult>;
  deleteManyByQuery(query: Record<string, unknown>): Promise<[null, DeleteResult] | [Error, null]>;
}

/** @public */
export interface ISysSequenceRepository {
  getNextSequenceValue(sequenceName: string): Promise<string>;
}
