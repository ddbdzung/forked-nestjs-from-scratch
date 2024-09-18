import mongoose, { connect } from 'mongoose';
import debug from 'debug';

import type { RegisterOption } from './mongoose.interface';

import { DEBUG_CODE } from '@/core/constants';
import { MongodbConfigurationBuilder } from './mongoose.builder';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

export class MongooseModule {
  public static register(options: RegisterOption) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const { uriBuilder, isDebugMode = false, onSuccess = () => {}, onFail = () => {} } = options;

    if (isDebugMode) {
      mongoose.set('debug', true);
    }

    const configuration = uriBuilder(new MongodbConfigurationBuilder());

    connect(configuration.uri, configuration.options)
      .then(() => {
        sysLogInfo(`[MongooseModule]: Connected to ${configuration.uri}`);

        onSuccess();
      })
      .catch((error) => {
        if (error instanceof Error) {
          sysLogInfo(`[MongooseModule]: ${error.message}`);

          onFail(error);
        }

        throw error;
      });

    return MongooseModule;
  }
}
