import type {
  Document,
  FilterQuery,
  IfAny,
  Model,
  MongooseUpdateQueryOptions,
  QueryOptions,
  Require_id,
  UpdateWriteOpResult,
} from 'mongoose';
import type { UpdateOptions, DeleteResult } from 'mongodb';

import { IBaseRepository } from '@/core/interfaces/base.repository.interface';
import { DECORATOR_TYPE } from '../constants/decorator.constant';
import { injectable } from 'inversify';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
type IfUpdateHasResult<T> = [null, IfAny<T, any, Document<unknown, {}, T> & Require_id<T>>];

// Mongoose Base Repository
// All should follow this pattern [error, result] to avoid confusion when handling the result of the function call in the service layer
@injectable()
export abstract class BaseRepository<T extends Document = Document> implements IBaseRepository<T> {
  public readonly decoratorType = DECORATOR_TYPE.REPOSITORY;

  constructor(protected model: Model<T>) {}

  /**
   * Create a new document or documents
   * @returns {Promise<IfHasResult<T> | IfHasNoResult>} [error?, result?]
   */
  async create(data: T | T[]): Promise<IfHasResult<T> | IfHasNoResult> {
    try {
      const result = await this.model.create(data);

      return [null, result];
    } catch (error) {
      if (error instanceof Error) {
        return [error, null];
      }

      return [new Error(error?.toString() ?? 'An error has occured when creating document'), null];
    }
  }

  /**
   * Find a document by id
   * @returns {Promise<IfHasResult<T> | IfHasNoResult>} [error?, result?]
   */
  async findById(
    id: string,
    projection: Record<string, unknown> = {},
    opt: QueryOptions<T> | null = null,
  ): Promise<IfHasResult<T> | IfHasNoResult> {
    try {
      const result = await this.model.findById(id, projection, opt);

      return [null, result] as IfHasResult<T>;
    } catch (error) {
      if (error instanceof Error) {
        return [error, null];
      }

      return [new Error(error?.toString() ?? 'An error has occured when finding document'), null];
    }
  }

  /**
   * Find a document by query
   * @returns {Promise<IfHasResult<T> | IfHasNoResult>} [error?, result?]
   */
  async findOne(query: FilterQuery<T>): Promise<IfHasResult<T> | IfHasNoResult> {
    try {
      const result = await this.model.findOne(query);

      return [null, result] as IfHasResult<T>;
    } catch (error) {
      if (error instanceof Error) {
        return [error, null];
      }

      return [new Error(error?.toString() ?? 'An error has occured when finding document'), null];
    }
  }

  /**
   * Find documents by query
   * @returns {Promise<IfHasResult<T> | IfHasNoResult>} [error?, result?]
   */
  async find(
    query: FilterQuery<T>,
    projection?: Record<string, unknown>,
    opt: QueryOptions<T> | null = null,
  ): Promise<IfHasResult<T> | IfHasNoResult> {
    try {
      const result = await this.model.find(query);

      return [null, result] as IfHasResult<T>;
    } catch (error) {
      if (error instanceof Error) {
        return [error, null];
      }

      return [new Error(error?.toString() ?? 'An error has occured when finding documents'), null];
    }
  }

  /**
   * Find all documents (NOTE: This method is not recommended for large datasets)
   * @returns {Promise<IfHasResult<T> | IfHasNoResult>} [error?, result?]
   */
  async findAll(
    projection?: Record<string, unknown>,
    opt: QueryOptions<T> | null = null,
  ): Promise<IfHasResult<T> | IfHasNoResult> {
    try {
      const result = await this.model.find();

      return [null, result] as IfHasResult<T>;
    } catch (error) {
      if (error instanceof Error) {
        return [error, null];
      }

      return [new Error(error?.toString() ?? 'An error has occured when finding documents'), null];
    }
  }

  /**
   * Update a document by id
   * @returns {Promise<IfUpdateHasResult<T> | IfHasNoResult>} [error?, result?]
   */
  async updateById(
    id: string,
    data: Partial<T>,
    opt?: QueryOptions<T> | null,
  ): Promise<IfUpdateHasResult<T> | IfHasNoResult> {
    try {
      const result = await this.model.findByIdAndUpdate(id, data, { new: true, ...opt });

      return [null, result] as IfUpdateHasResult<T>;
    } catch (error) {
      if (error instanceof Error) {
        return [error, null];
      }

      return [new Error(error?.toString() ?? 'An error has occured when updating document'), null];
    }
  }

  /**
   * Update many documents by query
   * @returns {Promise<[null, UpdateWriteOpResult] | [Error, null]>} [error?, result?]
   */
  async updateManyByQuery(
    filter: Record<string, unknown>,
    update: Partial<T>,
    opt: (UpdateOptions & MongooseUpdateQueryOptions<T>) | null = null,
  ): Promise<[null, UpdateWriteOpResult] | [Error, null]> {
    try {
      const result = await this.model.updateMany(filter, update, opt);

      return [null, result];
    } catch (error) {
      if (error instanceof Error) {
        return [error, null];
      }

      return [new Error(error?.toString() ?? 'An error has occured when updating documents'), null];
    }
  }

  /**
   * Delete a document by id
   * @returns {Promise<IfHasResult<T> | IfHasNoResult>} [error?, result?]
   */
  async deleteById(id: string): Promise<IfHasResult<T> | IfHasNoResult> {
    try {
      const result = await this.model.findByIdAndDelete(id);

      return [null, result] as IfHasResult<T>;
    } catch (error) {
      if (error instanceof Error) {
        return [error, null];
      }

      return [new Error(error?.toString() ?? 'An error has occured when deleting document'), null];
    }
  }

  /**
   * Delete many documents by query
   * @returns {Promise<[null, DeleteResult] | [Error, null]>} [error?, result?]
   */
  async deleteManyByQuery(query: FilterQuery<T>): Promise<[null, DeleteResult] | [Error, null]> {
    try {
      const result = await this.model.deleteMany(query);

      return [null, result];
    } catch (error) {
      if (error instanceof Error) {
        return [error, null];
      }

      return [new Error(error?.toString() ?? 'An error has occured when deleting documents'), null];
    }
  }
}
