/* eslint-disable @typescript-eslint/no-empty-interface */
import { IBaseRepository } from '@/core/interfaces/base.repository.interface';

import { IPost } from './post.model.interface';

export interface IPostRepository extends IBaseRepository<IPost> {}
