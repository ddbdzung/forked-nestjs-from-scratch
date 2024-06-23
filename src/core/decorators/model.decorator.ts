/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import type { IModelDecoratorOptions } from '@/core/interfaces/common.interface';

import { SystemException } from '@/core/helpers/exception.helper';

function ModelDecoratorFactory(
  options: IModelDecoratorOptions = {
    plugins: [],
  },
) {
  const { plugins } = options;

  return (target: any, propertyName: string) => {
    if (propertyName !== 'model') {
      throw new SystemException('Model property must be named "model"!');
    }

    Reflect.defineMetadata(`model:plugins`, plugins, target);
  };
}

export { ModelDecoratorFactory as Model };
