import {
  Model,
  AbstractModel,
  ModelMiddlewareBuilder,
  ServerFactory,
  IModelTimestamp,
  CONSTRAINT_ENUM,
  DATA_TYPE_ENUM,
  MODEL_MIDDLEWARE_HOOK_ENUM,
  MODEL_MIDDLEWARE_PERIOD_ENUM,
} from '@/core/index';

import { IPost } from './interfaces/post.model.interface';
import { POST_MODEL_NAME, POST_MODULE_NAME } from './post.constant';
import { UserRepository } from '../user/user.repository';
import { USER_MODEL_NAME, USER_MODULE_NAME } from '../user/user.constant';

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

  public override middlewares?: unknown[] | undefined = [
    new ModelMiddlewareBuilder<IPost>()
      .addPeriod(MODEL_MIDDLEWARE_PERIOD_ENUM.PRE)
      .setHooks([MODEL_MIDDLEWARE_HOOK_ENUM.SAVE])
      .setHandler('document', async function (this) {
        console.log(
          '[DEBUG][DzungDang]  ServerFactory.mongooseModelRegistry:',
          ServerFactory.mongooseModelRegistry,
        );
        const userModel = ServerFactory.mongooseModelRegistry[USER_MODULE_NAME];
        console.log('[DEBUG][DzungDang] userModel:', userModel);

        const userRepository = new UserRepository(userModel);
        console.log('[DEBUG][DzungDang] userRepository:', userRepository);
      })
      .build(),
  ];
}
