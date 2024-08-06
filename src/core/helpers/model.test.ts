export enum MODEL_MIDDLEWARE_PERIOD_ENUM {
  PRE = 'pre',
  POST = 'post',
}

export enum MODEL_MIDDLEWARE_HOOK_ENUM {
  DISTINCT = 'distinct',
  VALIDATE = 'validate',
  AGGREGATE = 'aggregate',
  BULK_WRITE = 'bulkWrite',
  CREATE_COLLECTION = 'createCollection',

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

interface IModelMiddleware {
  period: MODEL_MIDDLEWARE_PERIOD_ENUM[];
  hook: MODEL_MIDDLEWARE_HOOK_ENUM[];
  handler: () => Promise<void>;
}

class ModelMiddlewareBuilder {
  middlewares: IModelMiddleware[] = [
    {
      period: [],
      hook: [MODEL_MIDDLEWARE_HOOK_ENUM.VALIDATE],
      handler: async () => {
        console.log('ModelMiddlewareBuilder');
      },
    },
  ];
}
