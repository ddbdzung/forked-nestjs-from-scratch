import 'source-map-support/register';
import 'module-alias/register';
import 'reflect-metadata';

import debug from 'debug';
import { Server } from 'http';

import { bootstrapBaseEnv, bootstrapExtendedEnv } from '@/core/helpers/bootstrap.helper';
import { webappRegister } from '@/core/bootstraps/webapp.bootstrap';
import { DEBUG_CODE } from '@/core/constants/common.constant';

import { Env } from '@/app/modules/env/env.module';

let server: unknown = null;
const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);
const sysLogError = debug(DEBUG_CODE.APP_SYSTEM_ERROR);

const unexpectedErrorHandler = (error: Error) => {
  sysLogError(error);
  exitHandler();
};
const exitHandler = () => {
  if (!server) {
    sysLogError('Server closed');
    process.exit(1);
  }

  if (server instanceof Server) {
    server.close(() => {
      sysLogError('Server closed');
      process.exit(1);
    });
  }
};

bootstrapBaseEnv();
bootstrapExtendedEnv();
const envInstance = Env.getInstance();
const appPort = envInstance.get<number>('APP_PORT');
const webapp = webappRegister();
server = webapp.listen(appPort, () => {
  sysLogInfo(`Server started at port ${appPort}`);
});
import { MainModule } from '@/app/main.module';
import { AppModule } from '@/app/app.module';
import { _isMainModuleCreated, moduleRegistry } from './core/decorators/module.decorator';

const x = new MainModule();
sysLogInfo('[DEBUG][DzungDang] moduleRegistry:', moduleRegistry, _isMainModuleCreated);

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
  sysLogError('SIGTERM received');
  if (server && server instanceof Server) {
    server.close();
  }
});
