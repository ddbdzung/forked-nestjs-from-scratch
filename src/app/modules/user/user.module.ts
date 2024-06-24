import { Module } from '@/core/decorators/module.decorator';
import { Model } from '@/core/decorators/model.decorator';
import { AbstractModule } from '@/core/helpers/module.helper';
import { VERSION_API } from '@/core/constants/common.constant';
import { MONGOOSE_LEAN_GETTERS } from '@/core/helpers/mongoose-plugins.helper';

import UserModel from './user.model';
import { IUser } from './interfaces/user.model.interface';
import { UserRepository } from './user.repository';
import { UserConfig } from './user.config';

@Module({
  provider: [UserConfig],
  model: UserModel,
  repository: UserRepository,
})
export class UserModule extends AbstractModule {
  // @Model({
  //   plugins: [MONGOOSE_LEAN_GETTERS],
  // })
  model = UserModel;
}
