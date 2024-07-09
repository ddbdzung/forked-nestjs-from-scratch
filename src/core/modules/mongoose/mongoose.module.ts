/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { connect } from 'mongoose';
import debug from 'debug';

import { Module } from '@/core/decorators/module.decorator';
import { AbstractDatabaseModule } from '@/core/helpers/module.helper';
import { ServerFactory } from '@/core/helpers/bootstrap.helper';
import { DEBUG_CODE } from '@/core/constants/common.constant';

import { IRegisterOption } from './mongoose.interface';
import { MongodbConfigurationBuilder } from './mongoose.builder';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

@Module()
export class MongooseModule extends AbstractDatabaseModule {
  public static register(options: IRegisterOption) {
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

    return class extends AbstractDatabaseModule {
      constructor() {
        super();

        const instance = new MongooseModule();
        instance.name = 'MongooseModule';
        sysLogInfo(`[${instance.name}]: Module initialized!`);

        ServerFactory.globalModuleRegistry[instance.name] = instance;
        return instance;
      }
    };
  }
}
