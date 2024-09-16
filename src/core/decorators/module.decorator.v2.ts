import { ModuleOptions } from '../interfaces/modules/module-option.interface';
import { validateModuleKeys } from '../utils/validate-module-options.util';

export { ModuleDecoratorFactory as Module };

function ModuleDecoratorFactory(moduleOptions: ModuleOptions): ClassDecorator {
  validateModuleKeys(Object.keys(moduleOptions));

  return (target) => {
    Object.entries(moduleOptions).forEach(([key, value]) => {
      Reflect.defineMetadata(key, value, target);
    });
  };
}
