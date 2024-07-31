import 'source-map-support/register';
import 'module-alias/register';
import 'reflect-metadata';

import type { Server } from 'http';

import debug from 'debug';

import { DEBUG_CODE, PREFIX_API } from '@/core/constants/common.constant';
import { ServerFactory, systemErrorHandler } from '@/core/helpers';

import { Env } from '@/app/modules/env/env.service';
import { MainModule } from '@/app/main.module';
import { LoggerModule } from './core';
import LogstashTransport from 'winston-logstash/lib/winston-logstash-latest';
import winston, { transport } from 'winston';

let server: Server | null = null;
systemErrorHandler(server);

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);
import mongoose from 'mongoose';
const { Schema } = mongoose;

async function bootstrap() {
  ServerFactory.setPrefixBaseRoute(PREFIX_API);

  const webapp = ServerFactory.create(MainModule);
  const envInstance = Env.getInstance();
  const appPort = envInstance.get<number>('APP_PORT');

  server = webapp.listen(appPort, async () => {
    sysLogInfo(`[Main]: Server started at port ${appPort}`);

    const personSchema = Schema({
      _id: Schema.Types.ObjectId,
      name: String,
      code: { type: String, index: true },
      age: Number,
      stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
    });

    const storySchema = Schema({
      authorCode: { type: Schema.Types.String, ref: 'Person' },
      title: String,
      fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    });

    const Story = mongoose.model<storySchema>('Story', storySchema);
    const Person = mongoose.model('Person', personSchema);

    const story = await Story.findOne({ title: 'Casino Royale' })
      .populate({
        path: 'authorCode',
        select: '',
        localField: 'authorCode',
        foreignField: 'code',
      })
      .exec();
    console.log(story);

    // const logger = new LoggerModule();
    // logger.debug('Main', ServerFactory.moduleRegistry, 1, 'a', true);
  });
}

bootstrap();
