import debug from 'debug';
import { Server } from 'http';
import { ErrorRequestHandler } from 'express';

import { DEBUG_CODE } from '@/core/constants/common.constant';
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant';

import { BusinessException, SystemException } from './exception.helper';

const sysLogError = debug(DEBUG_CODE.APP_SYSTEM_ERROR);

/** @public */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const isApiNotError: boolean = res.locals.isApiNotError;
  if (isApiNotError) {
    return next(err);
  }

  const unknownError = new SystemException('Unknown error');
  try {
    if (!err) {
      return next();
    }

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (err instanceof SystemException || err instanceof BusinessException) {
      const error = err.toObject();

      return res.status(error.statusCode).json(error);
    }

    if (err instanceof Error) {
      sysLogError('[errorHandler]: Unexpected System Error:', err);
      const error = new SystemException(err.message, err).toObject();

      return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json(error);
    }

    sysLogError('[errorHandler]: Unknown error:', `'${err?.toString()}'`);

    return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json(unknownError.toObject());
  } catch (error) {
    sysLogError('[errorHandler]: Error when handling error:', error);

    return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json(unknownError.toObject());
  }
};

/** @public */
export const systemErrorHandler = (server: Server | null) => {
  const unexpectedErrorHandler = (error: Error) => {
    sysLogError(error);
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

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  process.on('SIGTERM', () => {
    sysLogError('SIGTERM received');
    if (server && server instanceof Server) {
      server.close();
      process.exit(0);
    }
  });
};
