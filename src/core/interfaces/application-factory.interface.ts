import { VERSION_API } from '../constants/common.constant';

export interface ApplicationInterface<TServer = unknown> {
  enableVersioning(options: VERSION_API): this;
}
