import { MongodbConfiguration, MongodbConfigurationBuilder } from './mongoose.builder';

export interface IRegisterOption {
  uriBuilder: (b: MongodbConfigurationBuilder) => MongodbConfiguration;
  isDebugMode: boolean;
}
