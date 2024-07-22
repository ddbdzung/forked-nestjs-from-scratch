/* eslint-disable @typescript-eslint/no-explicit-any */
import {} from 'winston';

import { Module } from '@/core/decorators';
import { AbstractModule } from '@/core/helpers';
import { ILogger } from './interfaces/logger.module.interface';

@Module()
export class LoggerModule extends AbstractModule implements ILogger {
  public static getInstance() {
    return new LoggerModule();
  }

  public static register() {
    return LoggerModule;
  }

  public info(msg: string, ...args: any[]) {}
  public warn(msg: string, ...args: any[]) {}
  public error(msg: string, ...args: any[]) {}
  public debug(msg: string, ...args: any[]) {}
}
