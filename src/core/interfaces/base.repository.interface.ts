import { UpdateWriteOpResult } from 'mongoose';

// Mongoose Base Repository Interface
export interface IBaseRepository<T> {
  create(data: T | T[]): Promise<IfHasResult<T> | IfHasNoResult<T>>;
  updateById(id: string, data: Partial<T>): Promise<T | null | UpdateWriteOpResult>;
  // updateByQuery(query: Record<string, unknown>, data: Partial<T>): Promise<T>;
  // deleteById(id: string): Promise<T>;
  // deleteByQuery(query: Record<string, unknown>): Promise<T>;
  // findById(id: string): Promise<T>;
  // findOne(query: Record<string, unknown>): Promise<T>;
  // find(query: Record<string, unknown>): Promise<T[]>;
  // findAll(): Promise<T[]>; // Find all documents, NOTE: This method should be used carefully
}
