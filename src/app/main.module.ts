import debug from 'debug';

import {
  AbstractModule,
  DEBUG_CODE,
  EnvModule,
  LoggerModule,
  Module,
  MongooseModule,
} from '../core';

import { Env } from '@/app/modules/env';
import { PostModule } from '@/app/modules/post';
import { UserModule } from '@/app/modules/user';

const sysLogError = debug(DEBUG_CODE.APP_SYSTEM_ERROR);

@Module({
  sysModule: [
    EnvModule.register(),
    // LoggerModule.register({
    //   useLogstash: {
    //     host: 'localhost',
    //     port: 28_777,
    //     node_name: 'nodejs-app',
    //     max_connect_retries: 5,
    //     onError: (error: Error) => {
    //       sysLogError(`[LoggerModule]: ${error.message}`);
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
  bizModule: [PostModule, UserModule],
})
export class MainModule extends AbstractModule {}
