import { RuntimeException } from '@/core/utils/exception.util';

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
