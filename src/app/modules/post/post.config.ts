import { Config } from '@/core/decorators/config.decorator';
import { AbstractConfig } from '@/core/helpers/module.helper';

@Config()
export class PostConfig extends AbstractConfig {
  override prefixModule = 'posts';
}
