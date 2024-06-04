import type { Document, Model } from 'mongoose';

import { BaseRepository } from '@/core/repository/base.repository';

import { IUser } from './interfaces/user.model.interface';
import { IUserRepository } from './interfaces/user.repository.interface';

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor(protected override model: Model<IUser>) {
    super(model);
  }

  override async create(data: IUser | IUser[]) {
    return super.create(data);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email });
  }

  async findByNickName(nickName: string): Promise<IUser | null> {
    return this.model.findOne({ nickName });
  }
}
