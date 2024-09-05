/** @see https://github.com/nestjs/nest/blob/master/packages/core/errors/exceptions/runtime.exception.ts */
export class RuntimeException extends Error {
  constructor(message = '') {
    super(message);
  }

  public what() {
    return this.message;
  }
}

export class UninjectedTokenException extends RuntimeException {
  constructor(targetName: string, index: number) {
    super(`Injection token not found in constructor of ${targetName} at index ${index}`);
  }
}

export class UncaughtDependencyException extends RuntimeException {
  constructor(message?: string) {
    super(`[DIContainer]: Uncaught exception : ${message || ''}`);
  }
}
