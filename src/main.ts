import 'source-map-support/register';
import 'module-alias/register';
import 'reflect-metadata';

import type { Server } from 'http';

import debug from 'debug';

import { DEBUG_CODE, PREFIX_API } from '@/core/constants/common.constant';
import { ServerFactory, systemErrorHandler } from '@/core/helpers';

import { Env } from '@/app/modules/env/env.service';
import { MainModule } from '@/app/main.module';
import { LoggerLogstashModule } from './core';
import LogstashTransport from 'winston-logstash/lib/winston-logstash-latest';
import winston, { transport } from 'winston';

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
    const logger = winston.createLogger({
      transports: [
        new LogstashTransport({
          host: 'localhost',
          port: 28777,
          node_name: 'nodejs-app',
          max_connect_retries: 1,
        }) as transport,
      ],
    });
    logger.on('error', () => {
      console.error('[LoggerModule]: Stop the press, logging not working');
    });
    console.log('[DEBUG][DzungDang] logger:', logger);
    // const logger = new LoggerLogstashModule();
    // logger.info(`[Main]: Server started at port ${appPort}`);
  });
}

bootstrap();
