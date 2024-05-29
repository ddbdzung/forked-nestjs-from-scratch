import { Module } from '@/core/decorators/module.decorator';
import { Model } from '@/core/decorators/model.decorator';
import { AbstractModule } from '@/core/helpers/module.helper';
import { VERSION_API } from '@/core/constants/common.constant';

import UserModel from './user.model';
import { PREFIX_USER_MODULE } from './user.constant';

@Module({
  model: UserModel,
  prefix: PREFIX_USER_MODULE,
})
export class UserModule extends AbstractModule {
  @Model()
  model = UserModel;
}
