import { CONSTRAINT_ENUM, DATA_TYPE_ENUM } from '@/core/constants/model.constant';
import { Model } from '@/core/decorators';
import { AbstractModel } from '@/core/helpers';

@Model()
export class PostModel extends AbstractModel {
  public override name = 'Post';
  public override schema = {
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
}
