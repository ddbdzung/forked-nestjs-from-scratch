/* eslint-disable @typescript-eslint/no-explicit-any */
import debug from 'debug';

import { ServerFactory } from '@/core/helpers/bootstrap.helper';
import { SystemException } from '@/core/helpers/exception.helper';
import { AbstractConfig } from '@/core/helpers/module.helper';
import { DEBUG_CODE } from '@/core/constants/common.constant';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

function ConfigFactoryDecorator() {
  return <T extends new (...args: any[]) => AbstractConfig>(ctor: T) => {
    let instance: InstanceType<T> | null = null;

    return class extends ctor {
      public override prefixModule: string;

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
