import type { Express, Router } from 'express';

import express from 'express';
import debug from 'debug';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';

import { errorHandler } from '@/core/helpers';
import { SystemException, successHandler } from '@/core/helpers';
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant';

export function createApp() {
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
}
