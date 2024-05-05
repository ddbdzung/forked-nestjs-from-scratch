type EnvironmentVariable = Record<string, unknown>;

type HttpResponseCode = number;

type PROTOCOL = 'http' | 'ws';

type ObjectLiteral = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConstructorType = new (...args: any[]) => any;

interface ModuleOptions {
  registry?: ConstructorType[];
  name?: string;
}
