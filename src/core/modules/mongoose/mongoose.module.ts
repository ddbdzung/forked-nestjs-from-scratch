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

// const process = () => {
//   // 1. Create an interface representing a document in MongoDB.
//   interface IUser {
//     name: string;
//     email: string;
//     avatar?: string;
//   }

//   // 2. Create a Schema corresponding to the document interface.
//   const userSchema = new Schema<IUser>({
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     avatar: String,
//   });

//   // 3. Create a Model.
//   const User = model('User', userSchema);
//   // const User = model<IUser>('User', userSchema);

//   run().catch((err) => console.log(err));

//   async function run() {
//     // 4. Connect to MongoDB
//     await connect('mongodb://127.0.0.1:27017/test');

//     const user = new User({
//       name: 'Bill',
//       email: 'bill@initech.com',
//       avatar: 'https://i.imgur.com/dM7Thhn.png',
//     });
//     await user.save();

//     console.log(user.email); // 'bill@initech.com'
//   }
// };

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
        return instance;
      }
    };
  }
}
