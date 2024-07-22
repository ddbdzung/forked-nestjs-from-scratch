import { Module } from '@/core/decorators';
import { AbstractModule } from '@/core/helpers';

import { PostModel } from './post.model';
import { PostConfig } from './post.config';
import { PostRepository } from './post.repository';

@Module({
  provider: [PostConfig],
  model: PostModel,
  repository: PostRepository,
})
export class PostModule extends AbstractModule {}
