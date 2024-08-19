import type { Model } from 'mongoose';

import { BaseRepository } from '@/core/repository';
import { Repository } from '@/core/decorators';

import { IUser } from './interfaces/user.model.interface';
import { IUserRepository } from './interfaces/user.repository.interface';
import { inject, injectable } from 'inversify';

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor(@inject(Symbol.for('SysUser')) protected override model: Model<IUser>) {
    super(model);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email });
  }

  async findByNickName(nickName: string): Promise<IUser | null> {
    return this.model.findOne({ nickName });
  }
}
