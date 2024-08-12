import {
  CONSTRAINT_ENUM,
  DATA_TYPE_ENUM,
  MODEL_MIDDLEWARE_HOOK_ENUM,
  MODEL_MIDDLEWARE_PERIOD_ENUM,
} from '@/core/constants/model.constant';
import { Model } from '@/core/decorators';
import { AbstractModel, ModelHelper, ModelMiddlewareBuilder, ServerFactory } from '@/core/helpers';
import { IPost } from './interfaces/post.model.interface';
import { POST_MODEL_NAME, POST_MODULE_NAME } from './post.constant';

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

  public override middlewares?: unknown[] | undefined = [
    new ModelMiddlewareBuilder<IPost>()
      .addPeriod(MODEL_MIDDLEWARE_PERIOD_ENUM.PRE)
      .setHooks([MODEL_MIDDLEWARE_HOOK_ENUM.SAVE])
      .setHandler('document', async function (this) {
        const postNumber = await ModelHelper.generateSequenceCode(POST_MODULE_NAME);
        console.log('[DEBUG][DzungDang] postNumber:', postNumber);
      })
      .build(),
  ];
}
