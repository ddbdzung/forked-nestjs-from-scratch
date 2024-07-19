import type { Express, Router } from 'express';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';

import { errorHandler } from '@/core/helpers';
import { SystemException } from '@/core/helpers';
import { successHandler } from '@/core/helpers/controller.helper';
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant';
import { DECORATOR_TYPE } from '../constants/decorator.constant';
import { VERSION_API } from '../constants/common.constant';

abstract class AbstractModule {
  public readonly decoratorType = DECORATOR_TYPE.MODULE;

  public modelHandler?: (app: Express) => Router;
  public modelName?: string;

  public moduleName?: string;
  public version?: VERSION_API; // Version of module route
  public prefix?: string; // Prefix for module route

  public registry?: ConstructorType[];
  public isGlobal = false;
}

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

  for (const key in registryMap) {
    const instance = registryMap[key];

    if (instance instanceof AbstractModule && instance.modelHandler) {
      const basePath = `${prefixBaseRoute}/${instance.version}/${instance.prefix}`;
      app.use(basePath, instance.modelHandler(app));
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
