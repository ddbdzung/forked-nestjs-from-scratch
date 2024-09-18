import { MongodbConfiguration, MongodbConfigurationBuilder } from './mongoose.builder';

export interface RegisterOption {
  uriBuilder: (b: MongodbConfigurationBuilder) => MongodbConfiguration;
  isDebugMode: boolean;
  onSuccess?: () => void;
  onFail?: (error: Error) => void;
}
