/* eslint-disable @typescript-eslint/no-explicit-any */

import debug from 'debug';

import { SystemException } from '@/core/helpers/exception.helper';
import { DEBUG_CODE } from '@/core/constants/common.constant';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

function RepositoryDecoratorFactory() {
  return <T extends new (...args: any[]) => any>(ctor: T) => {
    let instance: InstanceType<T> | null = null;

    return class extends ctor {
      constructor(...args: any[]) {
        if (instance) {
          return instance;
        }

        super(...args);

        instance = new ctor(...args) as InstanceType<T>;
        if (!instance) {
          throw new SystemException('Repository instance cannot be created!');
        }

        sysLogInfo(`[${ctor.name}]: Repository initialized!`);
        return instance;
      }
    };
  };
}

export { RepositoryDecoratorFactory as Repository };
