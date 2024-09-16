import 'source-map-support/register';
import 'module-alias/register';
import 'reflect-metadata';

import type { Server } from 'http';

import debug from 'debug';

import { DEBUG_CODE, PREFIX_API } from '@/core/constants/common.constant';
import { ServerFactory, systemErrorHandler } from '@/core/helpers';

import { Env } from '@/app/modules/env/env.service';
import { MainModule } from '@/app/main.v2.module';
// import { MainModule } from '@/app/main.module';
import { PostRepository } from './app/modules/post/post.repository';
import { ApplicationFactory } from './core/application-factory';
import { TokenModule } from './app/modules/token/token.module';

let server: Server | null = null;
systemErrorHandler(server);

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

async function bootstrap() {
  // ServerFactory.setPrefixBaseRoute(PREFIX_API);
  // ServerFactory.useSequenceModel();

  // const webapp = ServerFactory.create(MainModule);
  // const envInstance = Env.getInstance();
  // const appPort = envInstance.get<number>('APP_PORT');

  // server = webapp.listen(appPort, async () => {
  //   sysLogInfo(`[Main]: Server started at port ${appPort}`);
  // });

  ApplicationFactory.create(MainModule);
}

bootstrap();
