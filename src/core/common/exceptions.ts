/** @see https://github.com/nestjs/nest/blob/master/packages/core/errors/exceptions/runtime.exception.ts */
/**
 * @description Runtime exception
 * @public
 */
export class RuntimeException extends Error {
  constructor(message = '') {
    super(message);
  }

  public what() {
    return this.message;
  }
}
