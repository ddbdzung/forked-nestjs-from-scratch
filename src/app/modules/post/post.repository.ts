import type { Model } from 'mongoose';

import { Repository } from '@/core/decorators';
import { BaseRepository } from '@/core/repository';

import { IPost } from './interfaces/post.model.interface';
import { IPostRepository } from './interfaces/post.repository.interface';

@Repository()
export class PostRepository extends BaseRepository<IPost> implements IPostRepository {
  constructor(protected override model: Model<IPost>) {
    super(model);
  }
}
