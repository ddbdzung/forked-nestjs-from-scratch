import { RuntimeException } from '@/core/common/exceptions';

/**
 * @description Uninjected token exception
 * @public
 */
export class UninjectedTokenException extends RuntimeException {
  constructor(targetName: string, index: number) {
    super(`Injection token not found in constructor of ${targetName} at index ${index}`);
  }
}

/**
 * @description Uncaught dependency inversion exception
 * @public
 */
export class UncaughtDependencyException extends RuntimeException {
  constructor(message?: string) {
    super(`[DIContainer]: Uncaught exception : ${message || ''}`);
  }
}
