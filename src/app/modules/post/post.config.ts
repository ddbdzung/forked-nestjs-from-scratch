import { Config } from '@/core/decorators';
import { AbstractConfig } from '@/core/helpers';

@Config()
export class PostConfig extends AbstractConfig {
  override prefixModule = 'posts';
}
