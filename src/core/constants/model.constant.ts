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
}

export const DATA_TYPE_ENUM_LIST = Object.values(DATA_TYPE_ENUM);
