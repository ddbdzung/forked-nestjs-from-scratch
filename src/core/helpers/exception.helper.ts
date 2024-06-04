import { HTTP_RESPONSE_CODE, HTTP_RESPONSE_CODE_LIST } from '@/core/constants/http.constant';

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
  metadata?: IExceptionMetadata;
}

interface IException {
  name: string;
  message: string;
  innerError?: unknown;
  toString(): string;
  toJSON(): IExceptionData;
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

  public toJSON(): IExceptionData {
    return {
      statusCode: HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      message: this.message,
    };
  }
}

export class SystemException extends BaseException {
  public override name = 'SystemException';
  constructor(message: string, innerError?: unknown) {
    super(message, innerError);
  }

  public override toJSON(): IExceptionData {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}

export class BusinessException extends BaseException {
  public override name = 'BusinessException';
  public metadata: IExceptionMetadata = { type: ExceptionMetadataType.DEFAULT };
  constructor(message: string, innerError?: unknown) {
    super(message, innerError);
  }

  public withMetadata(metadata: IExceptionMetadata): this {
    this.metadata = metadata;
    return this;
  }

  public override toJSON() {
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
