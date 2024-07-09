import 'source-map-support/register';
import 'module-alias/register';
import 'reflect-metadata';

import type { Server } from 'http';

import debug from 'debug';

import { DEBUG_CODE, PREFIX_API } from '@/core/constants/common.constant';
import { ServerFactory } from '@/core/helpers/bootstrap.helper';
import { systemErrorHandler } from '@/core/helpers/error.helper';

import { MainModule } from '@/app/main.module';
import { Env } from '@/app/modules/env/env.service';

let server: Server | null = null;
systemErrorHandler(server);

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

async function bootstrap() {
  ServerFactory.setPrefixBaseRoute(PREFIX_API);

  const webapp = ServerFactory.create(MainModule);
  const envInstance = Env.getInstance();
  const appPort = envInstance.get<number>('APP_PORT');

  server = webapp.listen(appPort, () => {
    sysLogInfo(`[Main]: Server started at port ${appPort}`);
    console.log('[DEBUG][DzungDang] :', ServerFactory.moduleRegistry);
  });
}

bootstrap();
