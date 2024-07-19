import { HTTP_RESPONSE_CODE, HTTP_RESPONSE_MESSAGE } from '@/core/constants/http.constant';

import { SystemException } from './exception.helper';

type Data = Record<string, unknown> | Record<string, unknown>[];
type Meta = Record<string, unknown>;

interface IAPIResponse {
  statusCode?: HttpResponseCode;
  message?: string;
  data?: Data;
  meta?: Meta;
}

/** @public */
export class APIResponseBuilder {
  private _statusCode?: HttpResponseCode;
  private _message = '';
  private _data?: Data;
  private _meta?: Meta;

  constructor(statusCode?: HttpResponseCode, message?: string, data?: Data, meta?: Meta) {
    this._statusCode = statusCode;
    if (message) {
      this._message = message;
    }
    this._data = data;
    this._meta = meta;
  }

  build() {
    if (!this._statusCode) {
      throw new SystemException('Status code is required');
    }

    if (!this._message) {
      throw new SystemException('Message is required');
    }

    return new APIResponse(this._statusCode, this._message, this._data, this._meta);
  }

  isApiOK() {
    this._statusCode = HTTP_RESPONSE_CODE.OK;
    this._message = HTTP_RESPONSE_MESSAGE[this._statusCode];
    return this;
  }

  isApiCreated() {
    this._statusCode = HTTP_RESPONSE_CODE.CREATED;
    this._message = HTTP_RESPONSE_MESSAGE[this._statusCode];
    return this;
  }

  isApiMovedPermanently() {
    this._statusCode = HTTP_RESPONSE_CODE.MOVED_PERMANENTLY;
    this._message = HTTP_RESPONSE_MESSAGE[this._statusCode];
    return this;
  }

  isApiBadRequest() {
    this._statusCode = HTTP_RESPONSE_CODE.BAD_REQUEST;
    this._message = HTTP_RESPONSE_MESSAGE[this._statusCode];
    return this;
  }

  isApiUnauthorized() {
    this._statusCode = HTTP_RESPONSE_CODE.UNAUTHORIZED;
    this._message = HTTP_RESPONSE_MESSAGE[this._statusCode];
    return this;
  }

  isApiForbidden() {
    this._statusCode = HTTP_RESPONSE_CODE.FORBIDDEN;
    this._message = HTTP_RESPONSE_MESSAGE[this._statusCode];
    return this;
  }

  isApiNotFound() {
    this._statusCode = HTTP_RESPONSE_CODE.NOT_FOUND;
    this._message = HTTP_RESPONSE_MESSAGE[this._statusCode];
    return this;
  }

  isApiMethodNotAllowed() {
    this._statusCode = HTTP_RESPONSE_CODE.METHOD_NOT_ALLOWED;
    this._message = HTTP_RESPONSE_MESSAGE[this._statusCode];
    return this;
  }

  isApiUnprocessableEntity() {
    this._statusCode = HTTP_RESPONSE_CODE.UNPROCESSABLE_ENTITY;
    this._message = HTTP_RESPONSE_MESSAGE[this._statusCode];
    return this;
  }

  isApiInternalServerError() {
    this._statusCode = HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR;
    this._message = HTTP_RESPONSE_MESSAGE[this._statusCode];
    return this;
  }

  isApiBadGateway() {
    this._statusCode = HTTP_RESPONSE_CODE.BAD_GATEWAY;
    this._message = HTTP_RESPONSE_MESSAGE[this._statusCode];
    return this;
  }

  isApiServiceUnavailable() {
    this._statusCode = HTTP_RESPONSE_CODE.SERVICE_UNAVAILABLE;
    this._message = HTTP_RESPONSE_MESSAGE[this._statusCode];
    return this;
  }

  withCode(statusCode: HttpResponseCode) {
    this._statusCode = statusCode;
    this._message = HTTP_RESPONSE_MESSAGE[statusCode];
    return this;
  }

  withMessage(message: string) {
    this._message = message;
    return this;
  }

  withData(data: Data) {
    this._data = data;
    return this;
  }

  withMeta(meta: Meta) {
    this._meta = meta;
    return this;
  }
}

export class APIResponse {
  private _statusCode?: HttpResponseCode;
  private _message = '';
  private _data?: Data;
  private _meta?: Meta;
  constructor(statusCode?: HttpResponseCode, message?: string, data?: Data, meta?: Meta) {
    this._statusCode = statusCode;
    if (message) {
      this._message = message;
    }
    this._data = data;
    this._meta = meta;
  }

  get statusCode() {
    return this._statusCode;
  }
  get message() {
    return this._message;
  }
  get data() {
    return this._data;
  }
  get meta() {
    return this._meta;
  }

  toObject() {
    const obj: IAPIResponse = {
      statusCode: this._statusCode,
      message: this._message,
    };
    if (this._data) {
      obj.data = this._data;
    }
    if (this._meta) {
      obj.meta = this._meta;
    }
    return obj;
  }
}
