export interface ILogger {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  verbose: (...args: unknown[]) => void;
  fatal: (...args: unknown[]) => void;
}

export interface ConsoleLoggerOptions {
  timestamp?: boolean;
  logLevel?: LogLevel[];
}
