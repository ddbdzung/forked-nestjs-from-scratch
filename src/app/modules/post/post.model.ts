import {
  Model,
  AbstractModel,
  IModelTimestamp,
  CONSTRAINT_ENUM,
  DATA_TYPE_ENUM,
} from '@/core/index';

import { POST_MODEL_NAME } from './post.constant';

@Model()
export class PostModel extends AbstractModel {
  public override name = POST_MODEL_NAME;
  public override schema = {
    postNumber: {
      type: DATA_TYPE_ENUM.CODE,
      constraints: [CONSTRAINT_ENUM.UNIQUE],
    },
    title: {
      type: DATA_TYPE_ENUM.STRING,
      constraints: [CONSTRAINT_ENUM.REQUIRED, CONSTRAINT_ENUM.UNIQUE],
    },
    content: {
      type: DATA_TYPE_ENUM.STRING,
      constraints: [CONSTRAINT_ENUM.REQUIRED],
    },
    author: {
      type: DATA_TYPE_ENUM.OBJECT_ID,
    },
  };
  public override timestamp: boolean | IModelTimestamp = {
    createdAt: {
      isUsed: true,
    },
    updatedAt: {
      isUsed: true,
    },
  };
}
