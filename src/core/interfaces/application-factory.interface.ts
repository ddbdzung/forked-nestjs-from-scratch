import { VERSION_API } from '../constants/common.constant';

export interface IApplication<TServer = unknown> {
  enableVersioning(options: VERSION_API): this;
}
