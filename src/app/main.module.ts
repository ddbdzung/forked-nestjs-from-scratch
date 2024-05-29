import { Module } from '@/core/decorators/module.decorator';
import { AbstractModule } from '@/core/helpers/module.helper';
import { Model } from '@/core/decorators/model.decorator';
import { MongooseModule } from '@/core/modules/mongoose/mongoose.module';
import { EnvModule } from '@/core/modules/env/env.module';

import { UserModule } from '@/app/modules/user/user.module';
import { Env } from '@/app/modules/env/env.service';

@Module({
  registry: [
    EnvModule.register(),
    MongooseModule.register({
      uriBuilder: (builder) => {
        const env = Env.getInstance();
        const host = env.get<string>('DATABASE_HOST');
        const port = env.get<number>('DATABASE_PORT');
        const dbName = env.get<string>('DATABASE_NAME');

        return builder.setHost(host).setPort(port).setDatabaseName(dbName).build();
      },
    }),
    UserModule,
  ],
})
export class MainModule extends AbstractModule {
  @Model()
  model = null;
}
