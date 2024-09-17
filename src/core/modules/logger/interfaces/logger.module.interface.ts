import { ILogstashTransportOptions } from 'winston-logstash/lib/winston-logstash-latest';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LoggerInterface {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoggerOptions {
  useLogstash?: ILogstashTransportOptions;
}
