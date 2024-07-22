import { MongodbConfiguration, MongodbConfigurationBuilder } from './mongoose.builder';

export interface IRegisterOption {
  uriBuilder: (b: MongodbConfigurationBuilder) => MongodbConfiguration;
  isDebugMode: boolean;
  onSuccess?: () => void;
  onFail?: (error: Error) => void;
}
