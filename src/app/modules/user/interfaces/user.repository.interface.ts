import { IBaseRepository } from '@/core/interfaces/base.repository.interface';

import { IUser } from './user.model.interface';

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByNickName(nickName: string): Promise<IUser | null>;
}
