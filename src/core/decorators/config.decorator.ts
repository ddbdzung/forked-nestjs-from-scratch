/* eslint-disable @typescript-eslint/no-explicit-any */
import debug from 'debug';

import { SystemException, AbstractConfig } from '@/core/helpers';
import { DEBUG_CODE } from '@/core/constants/common.constant';
import { DECORATOR_TYPE } from '../constants/decorator.constant';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

/** @public */
function ConfigFactoryDecorator() {
  return <T extends new (...args: any[]) => AbstractConfig>(ctor: T) => {
    let instance: InstanceType<T> | null = null;

    return class extends ctor {
      constructor(...args: any[]) {
        if (instance) {
          return instance;
        }

        super(...args);

        instance = new ctor(...args) as InstanceType<T>;
        if (!instance) {
          throw new SystemException('Config instance cannot be created!');
        }

        instance.name = ctor.name;
        sysLogInfo(`[${ctor.name}]: Config initialized!`);
        return instance;
      }
    };
  };
}

export { ConfigFactoryDecorator as Config };
