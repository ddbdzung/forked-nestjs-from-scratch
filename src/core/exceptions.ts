export class DependencyInjectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DependencyInjectionError';
  }
}
