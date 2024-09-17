import { CorsOptions } from 'cors';

import { VERSION_API } from '../constants/common.constant';

export interface ApplicationInterface<TServer = unknown> {
  /**
   * Enable versioning API in the application scope
   * @param options Version API options
   */
  enableVersioning(options: VERSION_API): this;

  /**
   * Enable CORS (Cross-Origin Resource Sharing) in the application scope
   * @param options CORS options
   */
  enableCors(options: CorsOptions): void;
}

export interface ApplicationConfigInterface {
  globalPrefix: string;
}
