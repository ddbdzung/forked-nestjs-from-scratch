import { CONSTRAINT_ENUM, DATA_TYPE_ENUM } from '@/core/constants/model.constant';
import { IModel } from '@/core/interfaces/common.interface';

import { USER_MODEL } from './user.constant';

const model: IModel = {
  name: USER_MODEL,
  schema: {
    fullName: {
      type: DATA_TYPE_ENUM.STRING,
      constraints: [CONSTRAINT_ENUM.REQUIRED, CONSTRAINT_ENUM.UNIQUE],
    },
    email: {
      type: DATA_TYPE_ENUM.STRING,
      constraints: [CONSTRAINT_ENUM.REQUIRED, CONSTRAINT_ENUM.UNIQUE],
    },
    password: {
      type: DATA_TYPE_ENUM.STRING,
      constraints: [CONSTRAINT_ENUM.REQUIRED],
    },
    nickName: {
      type: DATA_TYPE_ENUM.PRIMITIVE_ARRAY,
      sharp: DATA_TYPE_ENUM.STRING, // Array of string
      constraints: [CONSTRAINT_ENUM.UNIQUE],
    },
    // Just for number type test
    age: {
      type: DATA_TYPE_ENUM.NUMBER,
      min: 0,
    },
    updatedAtLogList: {
      type: DATA_TYPE_ENUM.SUBDOCUMENT_ARRAY,
      sharp: {
        updatedAt: {
          type: DATA_TYPE_ENUM.STRING,
          constraints: [CONSTRAINT_ENUM.REQUIRED],
        },
        logList: {
          type: DATA_TYPE_ENUM.PRIMITIVE_ARRAY,
          sharp: DATA_TYPE_ENUM.STRING, // Array of string
        },
      },
    },
  },
};

export default model;
