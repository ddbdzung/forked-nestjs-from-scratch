import Module from '@/core/decorators/module.decorator';

import { AppModule } from './app.module';
import { MongooseModule } from './mongoose.module';

@Module({
  registry: [AppModule, MongooseModule],
})
export class MainModule {}
