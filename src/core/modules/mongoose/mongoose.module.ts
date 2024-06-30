/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, model, connect } from 'mongoose';
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
    const { uriBuilder, isDebugMode = false } = options;

    if (isDebugMode) {
      mongoose.set('debug', true);
    }

    const configuration = uriBuilder(new MongodbConfigurationBuilder());

    connect(configuration.uri, configuration.options)
      .then(() => {
        sysLogInfo(`[MongooseModule]: Connected to ${configuration.uri}`);
      })
      .catch((error) => {
        if (error instanceof Error) {
          sysLogInfo(`[MongooseModule]: ${error.message}`);
        }

        throw error;
      });

    return class extends AbstractDatabaseModule {
      constructor() {
        super();

        const instance = new MongooseModule();
        instance.name = 'MongooseModule';
        sysLogInfo(`[${instance.name}]: Module initialized!`);

        ServerFactory.moduleRegistry[instance.name] = instance;
        ServerFactory.globalModuleRegistry[instance.name] = instance;
        return instance;
      }
    };
  }
}
