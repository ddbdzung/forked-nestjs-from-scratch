import { Module } from '@/core/decorators/module.decorator';
import { AbstractModule } from '@/core/helpers/module.helper';

import { PostModel } from './post.model';
import { PostConfig } from './post.config';
import { PostRepository } from './post.repository';
import { UserModule } from '../user/user.module';

@Module({
  provider: [PostConfig],
  model: PostModel,
  repository: PostRepository,
})
export class PostModule extends AbstractModule {}
