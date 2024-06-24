import { AbstractConfig } from '@/core/helpers/module.helper';

export class PostConfig extends AbstractConfig {
  override modelName = 'post';
  override prefixModule = 'posts';
}
