export const MONGO_ERROR = 'MongoServerError';

export enum MONGO_ERROR_CODE {
  DUPLICATE_KEY = 11_000, // Duplicate key error code
  WRITE_CONFLICT = 112, // WriteConflict error code (when a transaction is failed)
}
