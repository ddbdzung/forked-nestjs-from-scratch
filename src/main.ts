import 'source-map-support/register';
import 'module-alias/register';
import 'reflect-metadata';

import debug from 'debug';
import { Server } from 'http';

import { DEBUG_CODE } from '@/core/constants/common.constant';
import { ServerFactory } from '@/core/helpers/bootstrap.helper';
import { systemErrorHandler } from '@/core/helpers/error.helper';
import { webappRegister } from '@/core/bootstraps/webapp.bootstrap';

import { MainModule } from '@/app/main.module';
import { Env } from '@/app/modules/env/env.module';
import './app/modules/test';

let server: Server | null = null;
systemErrorHandler(server);

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

async function bootstrap() {
  const webapp = ServerFactory.create(MainModule);

  const envInstance = Env.getInstance();
  const appPort = envInstance.get<number>('APP_PORT');

  server = webapp.listen(appPort, () => {
    sysLogInfo(`[Main]: Server started at port ${appPort}`);
  });
}

bootstrap();
