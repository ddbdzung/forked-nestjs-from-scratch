import type { ConnectOptions } from 'mongoose';

import { SystemException } from '@/core/helpers';

class ObjectiveClass {
  /**
   * @returns {Object} Plain object of class instance properties
   */
  public toPlainObject(): Record<string, unknown> {
    // Cast 'this' to 'any' to bypass TypeScript type checking for dynamic property access
    // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-explicit-any
    const self = this as unknown as any;

    return Object.getOwnPropertyNames(this).reduce(
      (obj, key) => {
        obj[key] = self[key];
        return obj;
      },
      {} as Record<string, unknown>,
    );
  }
}

const validIpAddressRegex =
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

const validHostnameRegex =
  /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;

export class MongodbConfiguration extends ObjectiveClass {
  private readonly _uri: string;
  private readonly _options: ConnectOptions;
  constructor(builder: MongodbConfigurationBuilder) {
    super();
    this._uri = builder.uriConfig.hasAccessCredentials
      ? this._buildUriWithAccessCredential(builder)
      : this._buildUriNoAccessCredential(builder);
    this._options = builder.options;
  }

  private _buildUriNoAccessCredential(builder: MongodbConfigurationBuilder): string {
    return `mongodb://${builder.uriConfig.host}:${builder.uriConfig.port}/${builder.uriConfig.databaseName}`;
  }

  private _buildUriWithAccessCredential(builder: MongodbConfigurationBuilder): string {
    return `mongodb://${builder.uriConfig.username}:${builder.uriConfig.password}@${builder.uriConfig.host}:${builder.uriConfig.port}/${builder.uriConfig.databaseName}`;
  }

  get uri(): string {
    return this._uri;
  }
  get options(): ConnectOptions {
    return this._options;
  }
}

export class MongodbConfigurationBuilder {
  private _uriConfig: {
    host: string;
    port: number;
    hasAccessCredentials: boolean;
    username: string;
    password: string;
    databaseName: string;
  };
  private _options: ConnectOptions;

  constructor() {
    this._uriConfig = {
      host: '',
      port: 0,
      hasAccessCredentials: false,
      username: '',
      password: '',
      databaseName: '',
    };
    this._options = {};
  }

  public get uriConfig(): {
    host: string;
    port: number;
    hasAccessCredentials: boolean;
    username: string;
    password: string;
    databaseName: string;
  } {
    return this._uriConfig;
  }
  public get options(): ConnectOptions {
    return this._options;
  }

  public setHost(host: string): MongodbConfigurationBuilder {
    if (!validIpAddressRegex.test(host) && !validHostnameRegex.test(host)) {
      throw new SystemException('Host must be a valid ip address or hostname');
    }

    this._uriConfig.host = host;
    return this;
  }

  public setPort(port: number): MongodbConfigurationBuilder {
    if (port < 0 || port > 65_535) {
      throw new SystemException('Port must be between 0 and 65535');
    }

    this._uriConfig.port = port;
    return this;
  }

  public setDatabaseName(databaseName: string): MongodbConfigurationBuilder {
    this._uriConfig.databaseName = databaseName;
    return this;
  }

  public withAccessCredentials(username: string, password: string): MongodbConfigurationBuilder {
    const specialCharacters = ['$', ':', '/', '?', '#', '[', ']', '@'];
    const formattedPassword = specialCharacters.some((char) => password.includes(char))
      ? encodeURIComponent(password)
      : password;

    this._uriConfig.hasAccessCredentials = true;
    this._uriConfig.username = username;
    this._uriConfig.password = formattedPassword;
    return this;
  }

  public withOptions(options: ConnectOptions): MongodbConfigurationBuilder {
    this._options = options;
    return this;
  }

  public build() {
    if (!this._uriConfig.host) {
      throw new SystemException('Host required to build mongodb configuration');
    }

    if (!this._uriConfig.port) {
      throw new SystemException('Port required to build mongodb configuration');
    }

    return new MongodbConfiguration(this);
  }
}
