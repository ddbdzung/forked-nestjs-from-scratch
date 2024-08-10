import {
  CONSTRAINT_ENUM,
  DATA_TYPE_ENUM,
  MODEL_MIDDLEWARE_HOOK_ENUM,
  MODEL_MIDDLEWARE_PERIOD_ENUM,
} from '@/core/constants/model.constant';
import { Model } from '@/core/decorators';
import { AbstractModel, ModelMiddlewareBuilder, ServerFactory } from '@/core/helpers';
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
        const currentNumber = 3;

        // How to dynamically identify code field in schema and set value for it
        // Solution:
        const schema = ServerFactory.schemaRegistry[POST_MODULE_NAME];
        const codeField = Object.keys(schema).find(
          (key) => schema[key].type === DATA_TYPE_ENUM.CODE,
        );

        if (codeField && codeField in this) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this as any)[codeField] = `P${currentNumber.toString().padStart(3, '0')}`;
        }
      })
      .build(),
    // new ModelMiddlewareBuilder()
    //   .addPeriod(MODEL_MIDDLEWARE_PERIOD_ENUM.PRE)
    //   .setHooks([
    //     MODEL_MIDDLEWARE_HOOK_ENUM.FIND,
    //     MODEL_MIDDLEWARE_HOOK_ENUM.FIND_ONE,
    //     MODEL_MIDDLEWARE_HOOK_ENUM.FIND_ONE_AND_UPDATE,
    //     MODEL_MIDDLEWARE_HOOK_ENUM.FIND_ONE_AND_DELETE,
    //     MODEL_MIDDLEWARE_HOOK_ENUM.FIND_ONE_AND_REPLACE,
    //   ])
    //   .setHandler(async function () {
    // this.where('active').equals(true).where('deleted').ne(true);
    //   })
    //   .build(),
  ];
}
