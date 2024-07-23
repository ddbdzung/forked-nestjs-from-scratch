import { AbstractModule, EnvModule, LoggerLogstashModule, Module, MongooseModule } from '../core';

import { Env } from '@/app/modules/env';
import { PostModule } from '@/app/modules/post';
import { UserModule } from '@/app/modules/user';

@Module({
  sysModule: [
    EnvModule.register(),
    // LoggerLogstashModule.register({
    //   useLogstash: {
    //     host: 'localhost',
    //     port: 28_777,
    //     node_name: 'nodejs-app',
    //     max_connect_retries: 1,
    //     onError: () => {
    //       console.log('[DEBUG][DzungDang] haiz:');
    //       console.error('[LoggerModule]: Stop the press, logging not working');
    //     },
    //   },
    // }),
    MongooseModule.register({
      isDebugMode: true,
      uriBuilder: (builder) => {
        const env = Env.getInstance();
        const host = env.get<string>('DATABASE_HOST');
        const port = env.get<number>('DATABASE_PORT');
        const dbName = env.get<string>('DATABASE_NAME');

        return builder
          .setHost(host)
          .setPort(port)
          .setDatabaseName(dbName)
          .withOptions({
            connectTimeoutMS: 3000,
            maxPoolSize: 10,
          })
          .build();
      },
    }),
  ],
  bizModule: [UserModule, PostModule],
})
export class MainModule extends AbstractModule {}
