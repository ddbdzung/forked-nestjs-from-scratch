import { ModuleOptions } from '../interfaces/modules/module-option.interface';
import { validateModuleKeys } from '../utils/validate-module-options.util';

export { ModuleDecoratorFactory as Module };

function ModuleDecoratorFactory(moduleOptions: ModuleOptions): ClassDecorator {
  const propsKeys = Object.keys(moduleOptions);
  validateModuleKeys(propsKeys);

  // TODO: Fix Function type later
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Function) => {
    for (const key in moduleOptions) {
      if (Object.prototype.hasOwnProperty.call(moduleOptions, key)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Reflect.defineMetadata(key, (moduleOptions as any)[key], target);
      }
    }
  };
}
