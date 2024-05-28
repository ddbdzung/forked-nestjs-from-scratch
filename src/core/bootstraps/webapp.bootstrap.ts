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

export const webappRegister = (registryMap) => {
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
    if (instance.cb && instance.model) {
      const route = `/api/${instance.model?.name}`;
      app.use(route, instance.cb(app));
    }
  }

  const test1 = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('ok');
  };
  const test2 = (req: Request, res: Response, next: NextFunction) => {
    throw 'haiz';
  };
  const test3 = (req: Request, res: Response, next: NextFunction) => {
    throw new SystemException('haiz1');
  };
  const test4 = (req: Request, res: Response, next: NextFunction) => {
    throw new BusinessException('haiz2');
  };
  const test5 = (req: Request, res: Response, next: NextFunction) => {
    return 'ok';
  };
  const test6 = (req: Request, res: Response, next: NextFunction) => {
    return new APIResponseBuilder().withCode(HTTP_RESPONSE_CODE.OK).build();
  };

  app.get('/1', controllerWrapper(test1));
  app.get('/2', controllerWrapper(test2));
  app.get('/3', controllerWrapper(test3));
  app.get('/4', controllerWrapper(test4));
  app.get('/5', controllerWrapper(test5));
  app.get('/6', controllerWrapper(test6));

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
