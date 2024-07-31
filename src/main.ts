import 'source-map-support/register';
import 'module-alias/register';
import 'reflect-metadata';

import type { Server } from 'http';

import debug from 'debug';

import { DEBUG_CODE, PREFIX_API } from '@/core/constants/common.constant';
import { ServerFactory, systemErrorHandler } from '@/core/helpers';

import { Env } from '@/app/modules/env/env.service';
import { MainModule } from '@/app/main.module';
import LogstashTransport from 'winston-logstash/lib/winston-logstash-latest';
import winston, { transport } from 'winston';

let server: Server | null = null;
systemErrorHandler(server);

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);
import type { ObjectId } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

type PersonSchema = {
  _id: ObjectId;
  name: string;
  code: string;
  age: number;
  stories: Schema.Types.ObjectId[];
};
type StorySchema = {
  authorCode: string;
  title: string;
  fans: Schema.Types.ObjectId[];
};
async function bootstrap() {
  ServerFactory.setPrefixBaseRoute(PREFIX_API);

  const webapp = ServerFactory.create(MainModule);
  const envInstance = Env.getInstance();
  const appPort = envInstance.get<number>('APP_PORT');

  server = webapp.listen(appPort, async () => {
    sysLogInfo(`[Main]: Server started at port ${appPort}`);

    const personSchema = new Schema({
      _id: Schema.Types.ObjectId,
      name: String,
      code: { type: String, index: true },
      age: Number,
      stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
    });

    const storySchema = new Schema({
      authorCode: { type: Schema.Types.String, ref: 'Person' },
      title: String,
      fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    });

    const Story = mongoose.model<StorySchema>('Story', storySchema);
    const Person = mongoose.model('Person', personSchema);

    // const author = new Person({
    //   _id: new mongoose.Types.ObjectId(),
    //   name: 'Ian Fleming',
    //   code: 'IF',
    //   age: 50,
    // });
    // await author.save();
    // const author2 = new Person({
    //   _id: new mongoose.Types.ObjectId(),
    //   name: 'Jon Snow',
    //   code: 'JS',
    //   age: 35,
    // });
    // await author2.save();

    // const story1 = new Story({
    //   title: 'Casino Royale',
    //   authorCode: author.code,
    // });
    // await story1.save();

    const author2 = await Person.findOne({ code: 'JS' });
    console.log('[DEBUG][DzungDang] author2:', author2);
    const story = await Story.findOne({ title: 'Casino Royale' })
      // .populate({
      //   path: 'authorCode',
      //   select: '',
      //   localField: 'authorCode',
      //   foreignField: 'code',
      // })
      .populate('fans')
      .exec();
    console.log('[DEBUG][DzungDang] story:', story);
    story.fans.push(author2._id);
    await story.save();
    // console.log(story);

    // const logger = new LoggerModule();
    // logger.debug('Main', ServerFactory.moduleRegistry, 1, 'a', true);
  });
}

bootstrap();
