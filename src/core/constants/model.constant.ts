import { omit } from 'lodash';

export const PROHIBITED_FIELD_LIST = ['_id', '__v', 'id'];

export enum CONSTRAINT_ENUM {
  REQUIRED = 'required',
  UNIQUE = 'unique',
}

export const CONSTRAINT_ENUM_LIST = Object.values(CONSTRAINT_ENUM);

export enum CONSTRAINT_DETAIL_ENUM {
  MIN = 'min',
  MAX = 'max',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  PATTERN = 'pattern',
  ENUMS = 'enums',
  DEFAULT_VALUE = 'defaultValue',
}

export const CONSTRAINT_DETAIL_ENUM_LIST = Object.values(CONSTRAINT_DETAIL_ENUM);

export enum DATA_TYPE_ENUM {
  // Common data types
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',

  // ID data types
  OBJECT_ID = 'objectId', // ID data type for primary key

  // Date data types
  DATE = 'date', // Date ex 2021-01-01T00:00:00.000Z

  // Buffer data types
  BUFFER = 'buffer', // Buffer ex <Buffer 00 00 00 00>

  // Array data types
  PRIMITIVE_ARRAY = 'primitiveArray', // Array of primitive data types ex ['string', 'number', 'boolean']
  SUBDOCUMENT_ARRAY = 'subDocumentArray', // Array of objects ex [{name: 'string', age: 'number', _id: 'objectId'}]

  // Map data types
  MAP = 'map', // Map ex {key: 'value'}

  // BigInt data types
  BIG_INT = 'bigInt', // BigInt ex 9007199254740991n

  // Master data types
  CODE = 'code', // Code data type for code field (EMP1, EMP2, ...)
}

export enum MODEL_MIDDLEWARE_PERIOD_ENUM {
  PRE = 'pre',
  POST = 'post',
}

export enum MODEL_MIDDLEWARE_HOOK_ENUM {
  VALIDATE = 'validate',
  AGGREGATE = 'aggregate',
  BULK_WRITE = 'bulkWrite',

  SAVE = 'save',
  INSERT_MANY = 'insertMany',

  FIND = 'find',
  FIND_ONE = 'findOne',

  COUNT_DOCUMENTS = 'countDocuments',
  ESTIMATED_DOCUMENT_COUNT = 'estimatedDocumentCount',
  REPLACE_ONE = 'replaceOne',
  FIND_ONE_AND_REPLACE = 'findOneAndReplace',

  UPDATE_ONE = 'updateOne',
  UPDATE_MANY = 'updateMany',
  FIND_ONE_AND_UPDATE = 'findOneAndUpdate',

  DELETE_ONE = 'deleteOne',
  DELETE_MANY = 'deleteMany',
  FIND_ONE_AND_DELETE = 'findOneAndDelete',
}

export const MODEL_MIDDLEWARE_QUERY_HOOK_ENUM = omit(MODEL_MIDDLEWARE_HOOK_ENUM, ['SAVE']);

export const MODEL_MIDDLEWARE_QUERY_HOOK_ENUM_LIST = Object.values(
  MODEL_MIDDLEWARE_QUERY_HOOK_ENUM,
);
