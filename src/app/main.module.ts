import { Module } from '@/core/decorators/module.decorator';

import { MongooseModule } from './mongoose.module';
import { UserModule } from './modules/user/user.module';
import { AbstractModule } from '@/core/helpers/module.helper';
import { Model } from '@/core/decorators/model.decorator';

@Module({
  registry: [UserModule],
})
export class MainModule extends AbstractModule {
  @Model()
  model = null;
}
