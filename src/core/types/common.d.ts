/* eslint-disable @typescript-eslint/no-explicit-any */
type EnvironmentVariable = Record<string, unknown>;

type HttpResponseCode = number;

type PROTOCOL = 'http' | 'ws';

type ObjectLiteral = Record<string, unknown>;

type ElementType<T extends Iterable<any>> = T extends Iterable<infer E> ? E : never;

type IfHasResult<T> = [null, T | T[]];

type IfHasNoResult<T> = [Error?, null];
