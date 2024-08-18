import type { Express, Router } from 'express';

import express from 'express';
import debug from 'debug';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';

import { AbstractModule, errorHandler, ServerFactory } from '@/core/helpers';
import { SystemException, successHandler } from '@/core/helpers';
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant';
import { DECORATOR_TYPE } from '@/core/constants/decorator.constant';
import { DEBUG_CODE, VERSION_API } from '@/core/constants/common.constant';

export const webappRegister = ({
  registryMap,
  prefixBaseRoute,
}: {
  registryMap: Record<string, unknown>;
  prefixBaseRoute: string;
}) => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(
    express.json({
      limit: '10mb',
    }),
  );
  app.use(mongoSanitize());
  app.use(compression());

  // TODO: Implement general API (health check, etc.)

  for (const instance of Object.values(registryMap)) {
    const basePath = `${prefixBaseRoute}/${instance.version}/${instance.prefix}`;
    if (instance instanceof AbstractModule && instance.modelHandler) {
      app.use(basePath, instance.modelHandler(app, basePath));
    }

    if (instance instanceof AbstractModule && instance.customControllerHandler) {
      app.use(basePath, instance.customControllerHandler(app, basePath));
    }
  }

  app.use((req, res, next) => {
    const isApiNotError: boolean = res.locals.isApiNotError;
    if (!isApiNotError) {
      throw new SystemException(`Not found: ${req.originalUrl}`).withCode(
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }

    return next();
  });
  app.use(errorHandler);
  app.use(successHandler);

  return app;
};
