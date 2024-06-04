import { Document, Error, Model, QueryOptions, UpdateWriteOpResult } from 'mongoose';

import { IBaseRepository } from '@/core/interfaces/base.repository.interface';

// Mongoose Base Repository
// All should follow this pattern [error, result] to avoid confusion when handling the result of the function call in the service layer
export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  /**
   * Create a new document or documents
   * @param data
   * @returns {Promise<IfHasResult<T> | IfHasNoResult<T>>} [error?, result?]
   */
  async create(data: T | T[]): Promise<IfHasResult<T> | IfHasNoResult<T>> {
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

  async updateById(
    id: string,
    data: Partial<T>,
    opt?: QueryOptions<T> | null,
  ): Promise<T | null | UpdateWriteOpResult> {
    return this.model.findByIdAndUpdate(id, data, { new: true, ...opt });
  }
}
