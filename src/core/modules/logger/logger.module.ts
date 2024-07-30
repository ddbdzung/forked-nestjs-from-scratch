/* eslint-disable @typescript-eslint/no-explicit-any */
import type { transport, Logger } from 'winston';

import winston from 'winston';
import LogstashTransport from 'winston-logstash/lib/winston-logstash-latest';
import debug from 'debug';

import { Module } from '@/core/decorators';
import { AbstractModule, ServerFactory } from '@/core/helpers';
import { DEBUG_CODE } from '@/core/constants/common.constant';
import { safeStringify } from '@/core/utils/object.util';

import { ILogger, ILoggerOptions } from './interfaces/logger.module.interface';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);
const sysLogError = debug(DEBUG_CODE.APP_SYSTEM_ERROR);

@Module()
export class LoggerModule extends AbstractModule implements ILogger {
  public logger: Logger | null = null;
  private static _transports: transport[] = [];
  public static onError: ((error: Error) => void) | null = null;

  constructor() {
    const instance = ServerFactory.globalModuleRegistry[LoggerModule.name];
    if (instance) {
      return instance as LoggerModule;
    }

    super();

    if (!this.logger && LoggerModule._transports.length > 0) {
      const logger = winston.createLogger({
        transports: LoggerModule._transports,
      });

      const onError = LoggerModule.onError;
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
        LoggerModule.onError = onError;
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

    LoggerModule._transports = transports;

    return LoggerModule;
  }

  public info(message: string, ...args: any[]) {
    this.logger?.info(message, ...args);
  }
  public warn(message: string, ...args: any[]) {
    this.logger?.warn(message, ...args);
  }
  public error(message: string, ...args: any[]) {
    sysLogError(message, ...args);
    this.logger?.error(
      message,
      safeStringify(
        args.map((arg) => {
          return safeStringify(arg);
        }),
      ),
    );
  }
  public debug(message: string, ...args: any[]) {
    sysLogInfo(message, ...args);
    this.logger?.debug(
      message,
      safeStringify(
        args.map((arg) => {
          return safeStringify(arg);
        }),
      ),
    );
  }
}
