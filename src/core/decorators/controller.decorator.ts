import debug from 'debug';

import { AbstractController, AbstractModel, SystemException } from '../helpers';
import { DEBUG_CODE } from '../constants/common.constant';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

/* eslint-disable @typescript-eslint/no-explicit-any */
function ControllerDecoratorFactory() {
  return <T extends new (...args: any[]) => AbstractController>(ctor: T) => {
    let instance: InstanceType<T> | null = null;

    return class extends ctor {
      constructor(...args: any[]) {
        if (instance) {
          return instance;
        }

        super(...args);

        instance = new ctor(...args) as InstanceType<T>;
        if (!instance) {
          throw new SystemException('Controller instance cannot be created!');
        }

        sysLogInfo(`[${ctor.name}]: Controller initialized!`);
        return instance;
      }
    };
  };
}

export { ControllerDecoratorFactory as Controller };
