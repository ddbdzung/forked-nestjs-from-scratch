import { RuntimeException } from './common';

export class DependencyInjectionError extends RuntimeException {
  constructor(message: string) {
    super(message);
    this.name = 'DependencyInjectionError';
  }
}
