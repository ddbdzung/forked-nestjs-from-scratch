/* eslint-disable @typescript-eslint/no-explicit-any */
import type { transport, Logger } from 'winston';

import winston from 'winston';
import LogstashTransport from 'winston-logstash/lib/winston-logstash-latest';
import debug from 'debug';

import { Module } from '@/core/decorators';
import { AbstractModule, ServerFactory } from '@/core/helpers';
import { ILogger, ILoggerOptions } from './interfaces/logger.module.interface';
import { DEBUG_CODE } from '@/core/constants/common.constant';

const sysLogError = debug(DEBUG_CODE.APP_SYSTEM_ERROR);

function censor(censor) {
  let i = 0;

  return function (key, value) {
    if (
      i !== 0 &&
      typeof censor === 'object' &&
      typeof value == 'object' &&
      censor == value
    )
      return '[Circular]';

    if (i >= 29)
      // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;
  };
}

function safeStringify(val: any) {
  try {
    return JSON.stringify(val, censor(val));
  } catch (error) {
    return '[Circular]';
  }
}
import fs from 'fs';
@Module()
export class LoggerLogstashModule extends AbstractModule implements ILogger {
  public logger: Logger | null = null;
  private static _transports: transport[] = [];
  public static onError: ((error: Error) => void) | null = null;

  constructor() {
    const instance = ServerFactory.globalModuleRegistry[LoggerLogstashModule.name];
    if (instance) {
      return instance as LoggerLogstashModule;
    }

    super();

    if (!this.logger) {
      const logger = winston.createLogger({
        transports: LoggerLogstashModule._transports,
      });

      const onError = LoggerLogstashModule.onError;
      if (onError) {
        logger.on('error', onError);
      }

      this.logger = logger;
    }
  }

  public static register(options: ILoggerOptions) {
    const transports: transport[] = [];
    const { useLogstash } = options;

    if (useLogstash) {
      const {
        onError,
        node_name,
        host = '127.0.0.1',
        port = 28_777,
        max_connect_retries = 4,
        timeout_connect_retries = 100,
        rejectUnauthorized = true,
      } = useLogstash;

      if (onError) {
        LoggerLogstashModule.onError = onError;
      }

      transports.push(
        new LogstashTransport({
          host,
          port,
          node_name,
          max_connect_retries,
          timeout_connect_retries,
          rejectUnauthorized,
        }) as transport,
      );
    }

    LoggerLogstashModule._transports = transports;

    return LoggerLogstashModule;
  }

  public info(message: string, ...args: any[]) {
    const stringifyArgs = safeStringify(args.map(arg => {
      return safeStringify(arg);
    }))
    this.logger?.info(stringifyArgs);
  }
  public warn(message: string, ...args: any[]) {
    this.logger?.warn(message, ...args);
  }
  public error(message: string, ...args: any[]) {
    this.logger?.error(message, ...args);
  }
  public debug(message: string, ...args: any[]) {
    this.logger?.debug(message, ...args);
  }
}
