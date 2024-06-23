import type { NextFunction, Request, Response } from 'express';

import mongoose from 'mongoose';

import { HTTP_RESPONSE_CODE, HTTP_RESPONSE_MESSAGE } from '@/core/constants/http.constant';
import { IContextAPI } from '@/core/interfaces/common.interface';

import { Env } from '@/app/modules/env/env.service';
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

export function bindContextApi(ctx: IContextAPI) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals.ctx = ctx;

    next();
  };
}

export function successHandler(
  req: Request,
  res: Response & { locals: Record<string, unknown> },
  next: NextFunction,
) {
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
}

export class ControllerAPI {
  static instance: ControllerAPI | null = null;

  public static getInstance(): ControllerAPI {
    if (!ControllerAPI.instance) {
      ControllerAPI.instance = new ControllerAPI();
    }

    return ControllerAPI.instance;
  }

  async ping(req: Request, res: Response, next: NextFunction) {
    return new APIResponse(HTTP_RESPONSE_CODE.OK, HTTP_RESPONSE_MESSAGE[200], {
      msg: `pong from ${Env.getInstance().get('APP_SERVICE_NAME')}!`,
    });
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    const ctx = res.locals.ctx as IContextAPI | undefined;
    if (!ctx) {
      return next(new SystemException('[API_ERROR]: ContextAPI is required'));
    }

    const modelInstance = mongoose.model(ctx.modelName);
    const fakeData = [
      {
        fullName: 'John Doe',
        email: 'd@email.com',
        password: '123456',
        nickName: ['John', 'Doe'],
        updatedAtLogList: [
          {
            updatedAt: new Date(),
            logList: ['log1', 'log2'],
          },
        ],
      },
    ];
    const dataList = await modelInstance.create(fakeData);

    // const dataList = await modelInstance.find({});

    return new APIResponse(HTTP_RESPONSE_CODE.OK, HTTP_RESPONSE_MESSAGE[200], { data: dataList });
  }
}
