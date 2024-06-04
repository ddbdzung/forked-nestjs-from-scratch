import type { NextFunction, Request, RequestHandler, Response } from 'express';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';

import { errorHandler } from '@/core/helpers/error.helper';
import { BusinessException, SystemException } from '@/core/helpers/exception.helper';
import { controllerWrapper, successHandler } from '@/core/helpers/controller.helper';
import { APIResponseBuilder } from '@/core/helpers/api.helper';
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant';
import { AbstractModule } from '@/core/helpers/module.helper';
import { PREFIX_API } from '@/core/constants/common.constant';

export const webappRegister = (registryMap: Record<string, unknown>) => {
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

  for (const key in registryMap) {
    const instance = registryMap[key];

    if (instance instanceof AbstractModule && instance.cb && instance.model) {
      const basePath = `${PREFIX_API}/${instance.version}/${instance.prefix}`;
      app.use(basePath, instance.cb(app));
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
