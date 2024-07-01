import { Module } from '@/core/decorators/module.decorator';
import { Model } from '@/core/decorators/model.decorator';
import { AbstractModule } from '@/core/helpers/module.helper';

import { PostModel } from './post.model';
import { PostConfig } from './post.config';
import { PostRepository } from './post.repository';

@Module({
  provider: [PostConfig],
  model: PostModel,
  repository: PostRepository,
})
export class PostModule extends AbstractModule {}
