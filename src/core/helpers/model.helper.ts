import type { Express, Router as RouterType } from 'express';
import type { CallbackError, CallbackWithoutResultAndOptionalError, Model, Schema } from 'mongoose';
import type { MongoServerError } from 'mongodb';

import mongoose from 'mongoose';
import { Router } from 'express';

import {
  IContextAPI,
  IModel,
  IModelHandler,
  ISchemaType,
  IVirtualType,
} from '@/core/interfaces/common.interface';
import {
  CONSTRAINT_DETAIL_ENUM,
  CONSTRAINT_ENUM,
  DATA_TYPE_ENUM,
  PROHIBITED_FIELD_LIST,
} from '@/core/constants/model.constant';
import { MONGO_ERROR, MONGO_ERROR_CODE } from '@/core/modules/mongoose/mongoose.constant';

import { BusinessException, ExceptionMetadataType, SystemException } from './exception.helper';
import { ControllerAPI, bindContextApi, controllerWrapper } from './controller.helper';
import { ServerFactory } from './bootstrap.helper';
import { HTTP_RESPONSE_CODE } from '../constants/http.constant';
import { AbstractConfig } from './module.helper';
import { BaseRepository } from '../repository/base.repository';

type SchemaTyping = Record<DATA_TYPE_ENUM, unknown>;
type ConstraintTyping = Record<
  DATA_TYPE_ENUM,
  { validConstraint: CONSTRAINT_ENUM[]; validConstraintDetail: CONSTRAINT_DETAIL_ENUM[] }
>;

export const schemaTypeMap: SchemaTyping = {
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
};

const validConstraintMap: ConstraintTyping = {
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
};

interface ConstraintDefinition {
  required: boolean;
  unique: boolean;
  minlength?: number;
  maxlength?: number;
  match?: RegExp;
  enum?: string[] | number[];
  min?: number;
  max?: number;
  default?: unknown;
}

export const makeConstraintDef = (
  field: string,
  fieldConfig: ISchemaType,
  metadata: { modelName?: string; moduleName?: string },
) => {
  const { constraints, type, sharp, getter, ...constraintDetail } = fieldConfig;
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
  const hasDefaultValueField = constraintDetailKeys.includes(CONSTRAINT_DETAIL_ENUM.DEFAULT_VALUE);
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
      // No constraint for default date field
      if (hasDefaultValueField) {
        constraintDefinition.default = defaultValue;
      }
      break;

    default:
      break;
  }

  return constraintDefinition;
};

export const makeSchema =
  (metadata: { modelName: string }) => (schema: Record<string, ISchemaType>) => {
    const schemaResult = new mongoose.Schema();

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

        const constraintDefinition = makeConstraintDef(field, fieldConfig, metadata);
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
          [field]: [makeSchema(metadata)(sharp)],
        } as unknown as Schema);
        continue;
      }

      // Primitive data type
      const constrainsResult = makeConstraintDef(field, fieldConfig, metadata);
      schemaResult.add({
        [field]: {
          ...constrainsResult,

          type: schemaTypeMap[type as DATA_TYPE_ENUM],
        },
      } as unknown as Schema);
    }

    return schemaResult;
  };

export const makeModelPlugin = (model: IModel, schema: Schema) => {
  // TODO: Check type of plugin to avoid any type
  model.plugins?.forEach((plugin) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema.plugin(plugin as unknown as any);
  });
};

export const makeModelMiddleware = (model: IModel, schema: Schema) => {
  schema.post(
    'save',
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

  const middlewares = model.middlewares;
  if (!middlewares) {
    return;
  }

  // TODO: Check type of middleware to avoid any type
  // TODO: Implement later
};

export const makeVirtual = (schema: Schema, virtuals?: Record<string, IVirtualType>) => {
  for (const virtualField in virtuals) {
    const { getter, setter } = virtuals[virtualField];

    if (getter) {
      schema.virtual(virtualField).get(getter);
    }

    if (setter) {
      schema.virtual(virtualField).set(setter);
    }
  }
};

export const makeModelRepository = (
  moduleName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any,
): BaseRepository | null => {
  const repositoryRegisterInstance = ServerFactory.repositoryRegistry[moduleName];
  if (!repositoryRegisterInstance) {
    return null;
  }
  const { ctr } = repositoryRegisterInstance;

  return new ctr(model);
};

export const modelHandler =
  (payload: IModelHandler) =>
  (app: Express): RouterType => {
    const { model, moduleName } = payload;
    const modelName = model.name;

    const { model: Model, repository: repositoryInstance, schema } = model.startModel();
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

    return router;
  };
