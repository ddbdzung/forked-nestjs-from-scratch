import { Module } from '@/core/decorators/module.decorator';
import { Model } from '@/core/decorators/model.decorator';
import { AbstractModule } from '@/core/helpers/module.helper';

import PostModel from './post.model';
import { PostConfig } from './post.config';

@Module({
  model: PostModel,
  provider: [PostConfig],
})
export class PostModule extends AbstractModule {
  // @Model()
  model = PostModel;
}
