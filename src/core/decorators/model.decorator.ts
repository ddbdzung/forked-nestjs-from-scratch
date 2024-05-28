/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import type { IModelDecoratorOptions } from '../interfaces/common.interface';

function ModelDecoratorFactory<T>(
  options: IModelDecoratorOptions = {
    plugins: [],
  },
) {
  const { plugins } = options;
  return (target: any, propertyName: string) => {
    if (propertyName !== 'model') {
      throw new Error('Model property must be named "model"!');
    }

    Reflect.defineMetadata(`model:plugins`, plugins, target);
  };
}

export { ModelDecoratorFactory as Model };
