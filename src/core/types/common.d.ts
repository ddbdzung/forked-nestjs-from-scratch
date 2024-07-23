/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'winston-logstash/lib/winston-logstash-latest' {
  import type { transport } from 'winston';
  export interface ILogstashTransportOptions {
    host?: string;
    port?: number;
    node_name: string;
    max_connect_retries?: number;
    timeout_connect_retries?: number;
    rejectUnauthorized?: boolean;
    onError?: () => void;
  }
  export default class LogstashTransport extends transport {
    constructor(options: ILogstashTransportOptions) {
      super(options);
    }
  }
}

type EnvironmentVariable = Record<string, unknown>;

type HttpResponseCode = number;

type PROTOCOL = 'http' | 'ws';

type ObjectLiteral = Record<string, unknown>;

type ElementType<T extends Iterable<any>> = T extends Iterable<infer E> ? E : never;

type IfHasResult<T> = [null, T | T[]];

type IfHasNoResult = [Error, null];

type ConstructorType = new (...args: any[]) => any;
