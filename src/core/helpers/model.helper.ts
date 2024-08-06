import type { Express, Router as RouterType } from 'express';
import type {
  CallbackError,
  CallbackWithoutResultAndOptionalError,
  Schema as SchemaTyping,
  Model,
  Document,
} from 'mongoose';
import type { MongoServerError } from 'mongodb';

import mongoose, { Schema, model as Modelize } from 'mongoose';
import { Router } from 'express';
import debug from 'debug';

import {
  IContextAPI,
  IModelHandler,
  ConstraintDefinition,
  IModel,
  IVirtualType,
  ISchema,
  ISchemaType,
} from '@/core/interfaces/common.interface';
import { DEBUG_CODE, VERSION_API } from '@/core/constants/common.constant';
import {
  CONSTRAINT_DETAIL_ENUM,
  CONSTRAINT_ENUM,
  DATA_TYPE_ENUM,
  MODEL_MIDDLEWARE_HOOK_ENUM,
  MODEL_MIDDLEWARE_TYPE_ENUM,
  PROHIBITED_FIELD_LIST,
} from '@/core/constants/model.constant';
import { DECORATOR_TYPE } from '@/core/constants/decorator.constant';
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant';
import { MONGO_ERROR, MONGO_ERROR_CODE } from '@/core/modules/mongoose/mongoose.constant';

import { ControllerAPI, bindContextApi, controllerWrapper } from './controller.helper';
import { BusinessException, ExceptionMetadataType, SystemException } from './exception.helper';
import { ServerFactory } from './factory.helper';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

/** @public */
export const modelHandler =
  (payload: IModelHandler) =>
  (app: Express, basePath: string): RouterType => {
    const { model, moduleName } = payload;
    const modelName = model.name;

    const { model: Model, repository: repositoryInstance, schema } = model.makeModel();
    if (repositoryInstance) {
      ServerFactory.repositoryRegistry[moduleName].instance = repositoryInstance;
    }

    ServerFactory.schemaRegistry[modelName] = schema;
    ServerFactory.modelRegistry[moduleName] = Model;

    const ctx: IContextAPI | null = modelName ? { modelName } : null;

    const router = Router();
    const controllerAPI = ControllerAPI.getInstance();

    // Ping
    router.get('/ping', controllerWrapper(controllerAPI.ping));

    if (ctx) {
      // Get list
      router.get('/', bindContextApi(ctx), controllerWrapper(controllerAPI.getList));
    }

    sysLogInfo(`[WebappBootstrap][${moduleName}]: Registering module at ${basePath}`);
    return router;
  };

type SchemaDefTyping = Record<DATA_TYPE_ENUM, unknown>;
type ConstraintTyping = Record<
  DATA_TYPE_ENUM,
  { validConstraint: CONSTRAINT_ENUM[]; validConstraintDetail: CONSTRAINT_DETAIL_ENUM[] }
>;
export const schemaTypeMap: SchemaDefTyping = {
  [DATA_TYPE_ENUM.STRING]: String,
  [DATA_TYPE_ENUM.NUMBER]: Number,
  [DATA_TYPE_ENUM.BOOLEAN]: Boolean,

  [DATA_TYPE_ENUM.OBJECT_ID]: mongoose.Schema.Types.ObjectId,

  [DATA_TYPE_ENUM.DATE]: Date,

  [DATA_TYPE_ENUM.BUFFER]: Buffer,

  [DATA_TYPE_ENUM.PRIMITIVE_ARRAY]: DATA_TYPE_ENUM.PRIMITIVE_ARRAY,

  [DATA_TYPE_ENUM.SUBDOCUMENT_ARRAY]: DATA_TYPE_ENUM.SUBDOCUMENT_ARRAY,

  [DATA_TYPE_ENUM.MAP]: Map,

  [DATA_TYPE_ENUM.BIG_INT]: BigInt,

  [DATA_TYPE_ENUM.CODE]: String,
};

export const validConstraintMap: ConstraintTyping = {
  [DATA_TYPE_ENUM.STRING]: {
    validConstraint: [CONSTRAINT_ENUM.REQUIRED, CONSTRAINT_ENUM.UNIQUE],
    validConstraintDetail: [
      CONSTRAINT_DETAIL_ENUM.MAX_LENGTH,
      CONSTRAINT_DETAIL_ENUM.MIN_LENGTH,
      CONSTRAINT_DETAIL_ENUM.PATTERN,
      CONSTRAINT_DETAIL_ENUM.ENUMS,
      CONSTRAINT_DETAIL_ENUM.DEFAULT_VALUE,
    ],
  },
  [DATA_TYPE_ENUM.NUMBER]: {
    validConstraint: [CONSTRAINT_ENUM.REQUIRED, CONSTRAINT_ENUM.UNIQUE],
    validConstraintDetail: [
      CONSTRAINT_DETAIL_ENUM.MAX,
      CONSTRAINT_DETAIL_ENUM.MIN,
      CONSTRAINT_DETAIL_ENUM.ENUMS,
      CONSTRAINT_DETAIL_ENUM.DEFAULT_VALUE,
    ],
  },
  [DATA_TYPE_ENUM.BOOLEAN]: {
    validConstraint: [CONSTRAINT_ENUM.REQUIRED],
    validConstraintDetail: [CONSTRAINT_DETAIL_ENUM.DEFAULT_VALUE],
  },
  [DATA_TYPE_ENUM.OBJECT_ID]: {
    validConstraint: [CONSTRAINT_ENUM.REQUIRED],
    validConstraintDetail: [],
  },
  [DATA_TYPE_ENUM.DATE]: {
    validConstraint: [CONSTRAINT_ENUM.REQUIRED],
    validConstraintDetail: [CONSTRAINT_DETAIL_ENUM.DEFAULT_VALUE],
  },
  [DATA_TYPE_ENUM.BUFFER]: {
    validConstraint: [CONSTRAINT_ENUM.REQUIRED],
    validConstraintDetail: [],
  },
  [DATA_TYPE_ENUM.PRIMITIVE_ARRAY]: {
    validConstraint: [CONSTRAINT_ENUM.UNIQUE],
    validConstraintDetail: [],
  },
  [DATA_TYPE_ENUM.SUBDOCUMENT_ARRAY]: {
    validConstraint: [],
    validConstraintDetail: [],
  },
  [DATA_TYPE_ENUM.MAP]: {
    validConstraint: [],
    validConstraintDetail: [],
  },
  [DATA_TYPE_ENUM.BIG_INT]: {
    validConstraint: [CONSTRAINT_ENUM.REQUIRED],
    validConstraintDetail: [],
  },
  [DATA_TYPE_ENUM.CODE]: {
    validConstraint: [CONSTRAINT_ENUM.UNIQUE],
    validConstraintDetail: [],
  },
};

// export const modelMiddlewareTypeMap: IModelMiddlewareTypeMap = {
//   queryMiddleware: {
//     [MODEL_MIDDLEWARE_HOOK_ENUM.DISTINCT]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.DISTINCT,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.VALIDATE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.VALIDATE,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.COUNT_DOCUMENTS]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.COUNT_DOCUMENTS,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.ESTIMATED_DOCUMENT_COUNT]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.ESTIMATED_DOCUMENT_COUNT,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.FIND]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.FIND,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.FIND_ONE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.FIND_ONE,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.FIND_ONE_AND_DELETE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.FIND_ONE_AND_DELETE,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.FIND_ONE_AND_REPLACE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.FIND_ONE_AND_REPLACE,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.FIND_ONE_AND_UPDATE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.FIND_ONE_AND_UPDATE,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.REPLACE_ONE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.REPLACE_ONE,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.DELETE_ONE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.DELETE_ONE,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.DELETE_MANY]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.DELETE_MANY,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.UPDATE_ONE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.UPDATE_ONE,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.UPDATE_MANY]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.UPDATE_MANY,
//     },
//   },
//   documentMiddleware: {
//     [MODEL_MIDDLEWARE_HOOK_ENUM.VALIDATE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.VALIDATE,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.SAVE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.SAVE,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.UPDATE_ONE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.UPDATE_ONE,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.DELETE_ONE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.DELETE_ONE,
//     },
//   },
//   aggregateMiddleware: {
//     [MODEL_MIDDLEWARE_HOOK_ENUM.AGGREGATE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.AGGREGATE,
//     },
//   },
//   modelMiddleware: {
//     [MODEL_MIDDLEWARE_HOOK_ENUM.BULK_WRITE]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.BULK_WRITE,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.INSERT_MANY]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.INSERT_MANY,
//     },
//     [MODEL_MIDDLEWARE_HOOK_ENUM.CREATE_COLLECTION]: {
//       type: [MODEL_MIDDLEWARE_TYPE_ENUM.PRE, MODEL_MIDDLEWARE_TYPE_ENUM.POST],
//       hook: MODEL_MIDDLEWARE_HOOK_ENUM.CREATE_COLLECTION,
//     },
//   },
// };

/** @public */
export abstract class AbstractModel<T extends Document = Document> implements IModel {
  protected _schema: SchemaTyping | null = null;
  protected _model: Model<T> | null = null;
  protected _moduleName: string;

  public abstract schema: ISchema;
  public abstract name: string;

  public readonly decoratorType = DECORATOR_TYPE.MODEL;

  public virtuals?: Record<string, IVirtualType>;
  public plugins?: unknown[];
  public middlewares?: unknown[];

  constructor(moduleName: string) {
    this._moduleName = moduleName;
  }

  set moduleName(moduleName: string) {
    if (ServerFactory.moduleRegistry[moduleName]) {
      throw new SystemException(`Module name '${moduleName}' is already registered`);
    }

    this._moduleName = moduleName;
  }

  private _makeSchema(schema: Record<string, ISchemaType>) {
    const schemaResult = new Schema();

    for (const field in schema) {
      if (PROHIBITED_FIELD_LIST.includes(field)) {
        throw new SystemException(`Field name '${field}' is prohibited`);
      }

      const fieldConfig = schema[field];
      const { type, sharp } = fieldConfig;

      if (type === DATA_TYPE_ENUM.PRIMITIVE_ARRAY) {
        if (!sharp) {
          throw new SystemException('Array data type must have sharp');
        }

        const validSharp = [
          DATA_TYPE_ENUM.STRING,
          DATA_TYPE_ENUM.NUMBER,
          DATA_TYPE_ENUM.BOOLEAN,
        ].includes(typeof sharp as DATA_TYPE_ENUM);

        if (!validSharp) {
          throw new SystemException('Array data type sharp must be a string');
        }

        const constraintDefinition = this._makeConstraintDef(field, fieldConfig, {
          modelName: this.name,
          moduleName: this._moduleName,
        });
        schemaResult.add({
          [field]: {
            ...constraintDefinition,

            type: [schemaTypeMap[sharp as DATA_TYPE_ENUM]],
          },
        } as unknown as Schema);

        continue;
      }

      // Subdocument array
      if (type === DATA_TYPE_ENUM.SUBDOCUMENT_ARRAY) {
        if (!sharp) {
          throw new SystemException('Array data type must have sharp');
        }

        if (typeof sharp !== 'object') {
          throw new SystemException('Array data type sharp must be an object');
        }

        schemaResult.add({
          [field]: [this._makeSchema(sharp)],
        } as unknown as SchemaTyping);

        continue;
      }

      // Primitive data type
      const constrainsResult = this._makeConstraintDef(field, fieldConfig, {
        modelName: this.name,
        moduleName: this._moduleName,
      });
      schemaResult.add({
        [field]: {
          ...constrainsResult,

          type: schemaTypeMap[type as DATA_TYPE_ENUM],
        },
      } as unknown as SchemaTyping);
    }

    return schemaResult;
  }

  private _makeVirtuals() {
    if (!this.virtuals || !this._schema) {
      return;
    }

    for (const virtualField in this.virtuals) {
      const { getter, setter } = this.virtuals[virtualField];

      if (getter) {
        this._schema.virtual(virtualField).get(getter);
      }

      if (setter) {
        this._schema.virtual(virtualField).set(setter);
      }
    }
  }

  private _makeMiddleware() {
    if (!this._schema) {
      return;
    }

    this._schema.post(
      MODEL_MIDDLEWARE_HOOK_ENUM.SAVE,
      function (
        error: Error,
        doc: Record<string, unknown>,
        next: CallbackWithoutResultAndOptionalError,
      ) {
        if (error.name === MONGO_ERROR) {
          const mongoServerError = error as MongoServerError;

          if (mongoServerError.code === MONGO_ERROR_CODE.DUPLICATE_KEY) {
            const keyValue = mongoServerError.errorResponse?.keyValue || {};
            const field = Object.keys(keyValue)?.at(0) || '';

            return next(
              new BusinessException('validate.common.duplicateKey')
                .withCode(HTTP_RESPONSE_CODE.BAD_REQUEST)
                .withMetadata([
                  {
                    type: ExceptionMetadataType.TRANSLATE,
                    fieldName: field,
                    fieldValue: keyValue[field] || null,
                  },
                ]),
            );
          }
        }

        next(error as CallbackError);
      },
    );

    if (!this.middlewares) {
      return;
    }

    // TODO: Check type of middleware to avoid any type, Implement later
  }

  private _makePlugins() {
    if (!this.plugins) {
      return;
    }

    if (this._schema) {
      const schema = this._schema;
      this.plugins.forEach((plugin) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schema.plugin(plugin as any);
      });
    }
  }

  private _makeModel() {
    if (!this._model && this._schema) {
      this._model = Modelize<T>(this.name, this._schema);
    }
  }

  private _makeRepository() {
    if (!this._model) {
      throw new SystemException(`Model ${this.name} have not been initialized yet`);
    }

    const moduleName = this._moduleName;

    if (!moduleName) {
      throw new SystemException('Module name is required');
    }

    const repositoryRegist = ServerFactory.repositoryRegistry[moduleName];
    if (!repositoryRegist) {
      throw new SystemException(`Repository of ${moduleName} not found`);
    }

    const { ctr: ctor } = repositoryRegist;

    if (!ctor) {
      throw new SystemException(`Repository of ${moduleName} not found`);
    }

    if (!this._model) {
      throw new SystemException(`Model ${moduleName} have not been initialized yet`);
    }

    return new ctor(this._model);
  }

  private _makeConstraintDef(
    field: string,
    fieldConfig: ISchemaType,
    metadata: { modelName?: string; moduleName?: string },
  ) {
    const { constraints, type, sharp: _sharp, getter: _getter, ...constraintDetail } = fieldConfig;
    const { defaultValue, enums, max, maxLength, min, minLength, pattern } = constraintDetail;
    const validConstraints = validConstraintMap[type as DATA_TYPE_ENUM];
    const { validConstraint, validConstraintDetail } = validConstraints;
    const originConstraints = constraints || [];

    const isConstraintsValid = originConstraints.every((item) => validConstraint.includes(item));
    if (!isConstraintsValid) {
      throw new SystemException(
        `Invalid constraints for field '${field}' of model '${metadata.modelName}'. Expect '${validConstraint.join(
          ', ',
        )}' but got '${originConstraints.join(', ')}'`,
      );
    }

    const isConstraintDetailValid = Object.keys(constraintDetail).every((item) =>
      validConstraintDetail.includes(item as CONSTRAINT_DETAIL_ENUM),
    );

    if (!isConstraintDetailValid) {
      throw new SystemException(
        `Invalid constraint detail for field '${field}' of model '${metadata.modelName}'. Expect '${validConstraintDetail.join(
          ', ',
        )}' but got '${Object.keys(constraintDetail).join(', ')}'`,
      );
    }

    const constraintDefinition: ConstraintDefinition = {
      required: originConstraints.includes(CONSTRAINT_ENUM.REQUIRED),
      unique: originConstraints.includes(CONSTRAINT_ENUM.UNIQUE),
    };

    const constraintDetailKeys = Object.keys(constraintDetail);
    const hasDefaultValueField = constraintDetailKeys.includes(
      CONSTRAINT_DETAIL_ENUM.DEFAULT_VALUE,
    );
    const hasEnumsField = constraintDetailKeys.includes(CONSTRAINT_DETAIL_ENUM.ENUMS);
    const hasMinField = constraintDetailKeys.includes(CONSTRAINT_DETAIL_ENUM.MIN);
    const hasMaxField = constraintDetailKeys.includes(CONSTRAINT_DETAIL_ENUM.MAX);
    const hasMinLengthField = constraintDetailKeys.includes(CONSTRAINT_DETAIL_ENUM.MIN_LENGTH);
    const hasMaxLengthField = constraintDetailKeys.includes(CONSTRAINT_DETAIL_ENUM.MAX_LENGTH);
    const hasPatternField = constraintDetailKeys.includes(CONSTRAINT_DETAIL_ENUM.PATTERN);

    switch (type) {
      case DATA_TYPE_ENUM.STRING:
        if (hasMinLengthField) {
          if (typeof minLength !== 'number' || isNaN(minLength)) {
            throw new SystemException(
              `Invalid min length for field '${field}' of model '${metadata.modelName}'. Expect number but got '${minLength}'`,
            );
          }

          constraintDefinition.minlength = minLength;
        }

        if (hasMaxLengthField) {
          if (typeof maxLength !== 'number' || isNaN(maxLength)) {
            throw new SystemException(
              `Invalid max length for field '${field}' of model '${metadata.modelName}'. Expect number but got '${maxLength}'`,
            );
          }

          constraintDefinition.maxlength = maxLength;
        }

        if (hasPatternField && pattern) {
          constraintDefinition.match = new RegExp(pattern);
        }

        if (hasEnumsField) {
          if (!Array.isArray(enums)) {
            throw new SystemException(
              `Invalid enum for field '${field}' of model '${metadata.modelName}'. Expect array but got '${enums}'`,
            );
          }

          if (enums.some((item) => typeof item !== 'string')) {
            throw new SystemException(
              `Invalid enum for field '${field}' of model '${metadata.modelName}'. Expect array of string but got '${enums}'`,
            );
          }

          constraintDefinition.enum = enums;
        }

        if (hasDefaultValueField) {
          if (typeof defaultValue !== 'string') {
            throw new SystemException(
              `Invalid default value for field '${field}' of model '${metadata.modelName}'. Expect string but got '${defaultValue}'`,
            );
          }

          constraintDefinition.default = defaultValue;
        }
        break;

      case DATA_TYPE_ENUM.NUMBER:
        if (hasMinField) {
          if (typeof min !== 'number' || isNaN(min)) {
            throw new SystemException(
              `Invalid min value for field '${field}' of model '${metadata.modelName}'. Expect number but got '${min}'`,
            );
          }

          constraintDefinition.min = min;
        }

        if (hasMaxField) {
          if (typeof max !== 'number' || isNaN(max)) {
            throw new SystemException(
              `Invalid max value for field '${field}' of model '${metadata.modelName}'. Expect number but got '${max}'`,
            );
          }

          constraintDefinition.max = max;
        }

        if (hasEnumsField) {
          if (!Array.isArray(enums)) {
            throw new SystemException(
              `Invalid enum for field '${field}' of model '${metadata.modelName}'. Expect array but got '${enums}'`,
            );
          }

          if (enums.some((item) => typeof item !== 'number')) {
            throw new SystemException(
              `Invalid enum for field '${field}' of model '${metadata.modelName}'. Expect array of number but got '${enums}'`,
            );
          }

          constraintDefinition.enum = enums;
        }

        if (hasDefaultValueField) {
          if (typeof defaultValue !== 'number') {
            throw new SystemException(
              `Invalid default value for field '${field}' of model '${metadata.modelName}'. Expect number but got '${defaultValue}'`,
            );
          }

          constraintDefinition.default = defaultValue;
        }
        break;

      case DATA_TYPE_ENUM.BOOLEAN:
        if (hasDefaultValueField) {
          if (!['boolean', 'number', 'string'].includes(typeof defaultValue)) {
            throw new SystemException(
              `Invalid default value for field '${field}' of model '${metadata.modelName}'. Expect logical value but got '${defaultValue}'`,
            );
          }

          const validDefaultValue = [true, false, 'true', 'false', 1, 0, '1', '0'];

          if (!validDefaultValue.includes(defaultValue as boolean | number | string)) {
            throw new SystemException(
              `Invalid default value for field '${field}' of model '${metadata.modelName}'. Expect logical value but got '${defaultValue}'`,
            );
          }

          constraintDefinition.default = defaultValue;
        }
        break;

      case DATA_TYPE_ENUM.DATE:
        if (hasDefaultValueField) {
          constraintDefinition.default = defaultValue;
        }
        break;

      case DATA_TYPE_ENUM.CODE:
        if (hasDefaultValueField) {
          constraintDefinition.default = defaultValue;
        }
        break;

      default:
        break;
    }

    return constraintDefinition;
  }

  public makeModel() {
    this._schema = this._makeSchema(this.schema);
    this._makeVirtuals();
    this._makeMiddleware();
    this._makePlugins();
    this._makeModel();

    return {
      model: this._model,
      schema: this._schema,
      repository: this._makeRepository(),
    };
  }
}
