import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant';

/** @public */
export enum ExceptionMetadataType {
  DEFAULT = 'other',
  TRANSLATE = 'translate',
}

interface IExceptionMetadata {
  type: ExceptionMetadataType;
  [key: string]: unknown;
}

interface IExceptionData {
  name?: string;
  statusCode: HttpResponseCode;
  message: string;
  metadata?: IExceptionMetadata[];
}

interface IException {
  name: string;
  message: string;
  innerError?: unknown;
  toString(): string;
  toObject(): IExceptionData;
}

class BaseException extends Error implements IException {
  public override readonly name: string = '';
  public readonly innerError?: unknown;
  private readonly _stack?: string;
  public statusCode: HttpResponseCode = HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR;

  constructor(message: string, innerError?: unknown) {
    super(message);
    this.innerError = innerError;
    if (innerError instanceof Error) {
      this.message = `(${message}): ${innerError.message}`;
      this._stack = innerError.stack;
    } else {
      this.message = message;
      this._stack = new Error().stack;
    }
  }

  public withCode(statusCode: HttpResponseCode): this {
    this.statusCode = statusCode;
    return this;
  }

  public override toString(): string {
    return `${this.name}: ${this.message}`;
  }

  public toObject(): IExceptionData {
    return {
      statusCode: HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      message: this.message,
    };
  }
}

/** @public */
export class SystemException extends BaseException {
  public override name = 'SystemException';
  constructor(message: string, innerError?: unknown) {
    super(message, innerError);
  }

  public override toObject(): IExceptionData {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}

/** @public */
export class BusinessException extends BaseException {
  public override name = 'BusinessException';
  public metadata: IExceptionMetadata[] = [{ type: ExceptionMetadataType.DEFAULT }];
  constructor(message: string, innerError?: unknown) {
    super(message, innerError);
  }

  public withMetadata(metadata: IExceptionMetadata[]): this {
    this.metadata = metadata;
    return this;
  }

  public override toObject() {
    const json: IExceptionData = {
      statusCode: this.statusCode,
      message: this.message,
    };
    if (this.metadata) {
      json.metadata = this.metadata;
    }

    return json;
  }
}
