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
    onError?: (error: Error) => void;
  }
  export default class LogstashTransport extends transport {
    constructor(options: ILogstashTransportOptions);
  }
}

type EnvironmentVariable = Record<string, unknown>;

type HttpResponseCode = number;

type ObjectLiteral = Record<string, unknown>;

type ElementType<T extends Iterable<any>> = T extends Iterable<infer E> ? E : never;

type IfHasResult<T> = [null, T | T[]];

type IfHasNoResult = [Error, null];

type ConstructorType = new (...args: any[]) => any;

/**
 * @description This type is used to make all properties of an object readonly.
 * @example
 * ``` typescript
 * interface Person {
 *   name: string;
 *   age: number;
 * };
 * const person: Readonly<Person> = {
 *   name: 'John',
 *   age: 30
 * };
 * person.name = 'Doe';
 * ```
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
