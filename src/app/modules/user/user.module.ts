import { Module } from '@/core/decorators/module.decorator';
import { AbstractModule } from '@/core/helpers/module.helper';

import { UserModel } from './user.model';
import { UserRepository } from './user.repository';
import { UserConfig } from './user.config';

@Module({
  provider: [UserConfig],
  model: UserModel,
  repository: UserRepository,
})
export class UserModule extends AbstractModule {}
