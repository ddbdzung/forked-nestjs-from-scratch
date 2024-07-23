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

@Module({})
export class LoggerLogstashModule extends AbstractModule implements ILogger {
  public logger: Logger | null = null;
  private static _transports: transport[] = [];
  public static onError: (() => void) | null = null;

  constructor() {
    const instance = ServerFactory.globalModuleRegistry[LoggerLogstashModule.name];
    if (instance) {
      return instance as LoggerLogstashModule;
    }

    super();

    if (!this.logger) {
      // TODO: How to set event 'on' to logger (it does not work as expected)
      setTimeout(() => {
        const logger = winston.createLogger({
          transports: LoggerLogstashModule._transports,
        });

        this.logger = logger;
        const onError = LoggerLogstashModule.onError;
        if (onError) {
          logger.on('error', onError);
          console.log('[DEBUG][DzungDang] logger:', logger);
        }
      }, 0);
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

    return LoggerLogstashModule;
  }

  public info(message: string, ...args: any[]) {
    this.logger?.info(message, ...args);
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
