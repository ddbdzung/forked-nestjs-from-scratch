import { IModel } from '@/core/interfaces/common.interface';

import { USER_MODEL } from './user.constant';

// TODO: use ModelBuilder to build model
const model: IModel = {
  name: USER_MODEL,
  schema: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
};

export default model;
