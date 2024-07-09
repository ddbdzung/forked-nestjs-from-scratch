import { Module } from '@/core/decorators/module.decorator';
import { AbstractModule } from '@/core/helpers/module.helper';
import { MongooseModule } from '@/core/modules/mongoose/mongoose.module';
import { EnvModule } from '@/core/modules/env/env.module';

import { UserModule } from '@/app/modules/user/user.module';
import { Env } from '@/app/modules/env/env.service';
import { PostModule } from '@/app/modules/post/post.module';
import { AbstractModuleV2, ModuleV2 } from '@/core/decorators/module.decorator.v2';
import { FileModule } from './modules/file/file.module';

// @Module({
//   registry: [
//     EnvModule.register(),
//     // MongooseModule.register({
//     //   isDebugMode: true,
//     //   uriBuilder: (builder) => {
//     //     const env = Env.getInstance();
//     //     const host = env.get<string>('DATABASE_HOST');
//     //     const port = env.get<number>('DATABASE_PORT');
//     //     const dbName = env.get<string>('DATABASE_NAME');

//     //     return builder
//     //       .setHost(host)
//     //       .setPort(port)
//     //       .setDatabaseName(dbName)
//     //       .withOptions({
//     //         connectTimeoutMS: 3000,
//     //         maxPoolSize: 10,
//     //       })
//     //       .build();
//     //   },
//     // }),
//     // UserModule,
//     // PostModule,
//   ],
// })
@ModuleV2({
  bizModule: [FileModule],
})
export class MainModule extends AbstractModuleV2 {}
