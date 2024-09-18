import type { NextFunction, Request, Response } from 'express';
import type { Document } from 'mongoose';

import mongoose from 'mongoose';

import { HTTP_RESPONSE_CODE, HTTP_RESPONSE_MESSAGE } from '@/core/constants/http.constant';
import { ContextAPI, PingResponse } from '@/core/interfaces/common.interface';

import { SystemException } from './exception.helper';
import { APIResponse, APIResponseBuilder } from './api.helper';

/** @public */
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

/** @public */
export function bindContextApi(ctx: ContextAPI) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals.ctx = ctx;

    next();
  };
}

/** @public */
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

/** @public */
export class ControllerAPI {
  static instance: ControllerAPI | null = null;

  public static getInstance(): ControllerAPI {
    if (!ControllerAPI.instance) {
      ControllerAPI.instance = new ControllerAPI();
    }

    return ControllerAPI.instance;
  }

  async ping(_req: Request, _res: Response, _next: NextFunction) {
    return new APIResponseBuilder<PingResponse>(HTTP_RESPONSE_CODE.OK, HTTP_RESPONSE_MESSAGE[200], {
      msg: `pong from core service}!`,
    }).build();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const ctx = res.locals.ctx as ContextAPI | undefined;
    if (!ctx) {
      return next(new SystemException('[API_ERROR]: ContextAPI is required'));
    }

    const modelInstance = mongoose.model(ctx.modelName);

    const fakeData = [
      {
        title: 'Post 1',
        content: 'Content 1',
      },
    ];
    const dataList = await modelInstance.create(fakeData);

    return new APIResponseBuilder<Document[]>(
      HTTP_RESPONSE_CODE.CREATED,
      HTTP_RESPONSE_MESSAGE[201],
      dataList,
    ).build();
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    const ctx = res.locals.ctx as ContextAPI | undefined;
    if (!ctx) {
      return next(new SystemException('[API_ERROR]: ContextAPI is required'));
    }

    const modelInstance = mongoose.model(ctx.modelName);

    const dataList = await modelInstance.find({});

    // To test virtual field
    // const dataList = await modelInstance.find({});
    // const temp = dataList[0];
    // const fullNameAndEmail = temp?.fullNameAndEmail;
    // console.log('[DEBUG][DzungDang] fullNameAndEmail:', fullNameAndEmail);

    return new APIResponseBuilder<Document[]>(
      HTTP_RESPONSE_CODE.OK,
      HTTP_RESPONSE_MESSAGE[200],
      dataList,
    ).build();
  }
}
