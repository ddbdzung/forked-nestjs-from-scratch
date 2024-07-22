import { AbstractModule } from '@/core/helpers';
import { Module } from '@/core/decorators';

import { UserModel } from './user.model';
import { UserRepository } from './user.repository';
import { UserConfig } from './user.config';

@Module({
  moduleName: 'SysUserModule',
  provider: [UserConfig],
  model: UserModel,
  repository: UserRepository,
})
export class UserModule extends AbstractModule {}
