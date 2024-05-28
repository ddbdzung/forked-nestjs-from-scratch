import { Module } from '@/core/decorators/module.decorator';

import UserModel from './user.model';
import { Model } from '@/core/decorators/model.decorator';
import { AbstractModule } from '@/core/helpers/module.helper';

@Module({
  model: UserModel,
})
export class UserModule extends AbstractModule {
  @Model()
  model = UserModel;
}
