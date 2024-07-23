import { ILogstashTransportOptions } from 'winston-logstash/lib/winston-logstash-latest';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILogger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILoggerOptions {
  useLogstash?: ILogstashTransportOptions;
}
