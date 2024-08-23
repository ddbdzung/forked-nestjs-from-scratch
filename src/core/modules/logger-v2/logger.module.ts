/* eslint-disable no-console */
import { DEFAULT_LOG_LEVEL } from './logger.constant';
import { ConsoleLoggerOptions, ILogger } from './logger.interface';

export class ConsoleLogger implements ILogger {
  private _originalContext: string;

  constructor(context: string);
  constructor(context: string, options: ConsoleLoggerOptions);
  constructor(
    protected context: string,
    protected options: ConsoleLoggerOptions = {},
  ) {
    if (context) {
      this._originalContext = context;
    }
    if (!options.logLevel) {
      options.logLevel = DEFAULT_LOG_LEVEL;
    }
  }

  private _formatMessage(level: string, ...args: unknown[]): string {
    const timestamp = this.options.timestamp ? new Date().toISOString() : '';

    return `[${timestamp}] [${level.toUpperCase()}] [${this._originalContext}] ${args.join(' ')}`;
  }

  error(...args: unknown[]): void {
    if (this.options.logLevel?.includes('error')) {
      console.error(this._formatMessage('error', ...args));
    }
  }

  info(...args: unknown[]): void {
    if (this.options.logLevel?.includes('info')) {
      console.info(this._formatMessage('info', ...args));
    }
  }

  log(...args: unknown[]): void {
    if (this.options.logLevel?.includes('log')) {
      console.log(this._formatMessage('log', ...args));
    }
  }

  verbose(...args: unknown[]): void {
    if (this.options.logLevel?.includes('verbose')) {
      console.debug(this._formatMessage('verbose', ...args));
    }
  }

  warn(...args: unknown[]): void {
    if (this.options.logLevel?.includes('warn')) {
      console.warn(this._formatMessage('warn', ...args));
    }
  }

  fatal(...args: unknown[]): void {
    if (!this.options.logLevel?.includes('fatal')) {
      return;
    }

    console.error(this._formatMessage('fatal', ...args));

    try {
      // Attempt to gracefully shut down the process
      process.kill(process.pid, 'SIGTERM');
    } catch (error) {
      console.error('Failed to terminate process gracefully:', error);
    } finally {
      // Forcefully terminate if SIGTERM is not sufficient
      process.exit(1);
    }
  }
}

export class Logger implements ILogger {
  protected _localInstance: ILogger;

  constructor(context: string);
  constructor(context: string, _options?: { timestamp?: boolean; logLevel?: LogLevel[] });
  constructor(
    protected _context: string,
    protected _options: { timestamp?: boolean; logLevel?: LogLevel[] } = {},
  ) {}

  get localInstance(): ILogger {
    return this._registerLocalInstance();
  }

  error(...args: unknown[]): void {
    return this.localInstance.error(...args);
  }

  info(...args: unknown[]): void {
    return this.localInstance.info(...args);
  }

  log(...args: unknown[]): void {
    return this.localInstance.log(...args);
  }

  verbose(...args: unknown[]): void {
    return this.localInstance.verbose(...args);
  }

  warn(...args: unknown[]): void {
    return this.localInstance.warn(...args);
  }

  fatal(...args: unknown[]): void {
    return this.localInstance.fatal(...args);
  }

  private _registerLocalInstance() {
    if (this._localInstance) {
      return this._localInstance;
    }

    this._localInstance = new ConsoleLogger(this._context, {
      logLevel: this._options.logLevel,
      timestamp: this._options.timestamp,
    });

    return this._localInstance;
  }
}
