import { Module } from '@/core/decorators/module.decorator';
import { Model } from '@/core/decorators/model.decorator';
import { AbstractModule } from '@/core/helpers/module.helper';
import { VERSION_API } from '@/core/constants/common.constant';
import {
  MONGOOSE_LEAN_GETTERS,
  MONGOOSE_LEAN_VIRTUALS,
} from '@/core/helpers/mongoose-plugins.helper';

import UserModel from './user.model';
import { PREFIX_USER_MODULE } from './user.constant';
import { IUser } from './interfaces/user.model.interface';

@Module({
  model: UserModel,
  prefix: PREFIX_USER_MODULE,
})
export class UserModule extends AbstractModule {
  @Model({
    plugins: [MONGOOSE_LEAN_GETTERS],
  })
  model = UserModel;
}
