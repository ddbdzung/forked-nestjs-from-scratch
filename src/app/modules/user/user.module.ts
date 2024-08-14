import { AbstractModule } from '@/core/helpers';
import { Module } from '@/core/decorators';

import { UserModel } from './user.model';
import { UserRepository } from './user.repository';
import { UserConfig } from './user.config';
import { USER_MODULE_NAME } from './user.constant';
import { UserController } from './user.controller';

@Module({
  moduleName: USER_MODULE_NAME,
  provider: [UserConfig],
  model: UserModel,
  repository: UserRepository,
  controller: UserController,
})
export class UserModule extends AbstractModule {}
