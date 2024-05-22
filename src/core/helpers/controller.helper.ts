import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { HTTP_RESPONSE_CODE, HTTP_RESPONSE_MESSAGE } from '@/core/constants/http.constant';
import { SystemException } from './exception.helper';
import { APIResponse } from './api.helper';

export const controllerWrapper = (
  controller: (req: Request, res: Response, next: NextFunction) => unknown,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await controller(req, res, next);

      if (!(response instanceof APIResponse)) {
        throw new SystemException(
          "Controller must return an instance of 'APIResponse'. Maybe you forgot to use 'new APIResponseBuilder().build()'?",
        );
      }

      if (res.locals.controllerResult !== undefined) {
        throw new SystemException(
          'Controller must return only one response. Maybe you forgot to use `return` keyword?',
        );
      }

      res.locals.controllerResult = response;
      res.locals.isApiNotError = true;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const successHandler = (req: Request, res: Response, next: NextFunction) => {
  const isApiNotError: boolean = res.locals.isApiNotError;
  const response: unknown = res.locals.controllerResult;
  if (!response || !isApiNotError) {
    return next();
  }

  if (!(response instanceof APIResponse)) {
    return next(new SystemException('Response must be an instance of APIResponse'));
  }

  const responseObj = response.toObject();
  const { statusCode, message } = responseObj;
  if (!statusCode) {
    return next(new SystemException('Status code is required'));
  }

  if (!message) {
    return next(new SystemException('Message is required'));
  }

  return res.status(statusCode).json(responseObj);
};
