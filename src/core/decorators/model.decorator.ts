/* eslint-disable @typescript-eslint/no-explicit-any */

import debug from 'debug';

import { SystemException } from '@/core/helpers/exception.helper';
import { DEBUG_CODE } from '@/core/constants/common.constant';
import { AbstractModel } from '@/core/helpers/module.helper';
import { ISchemaType } from '../interfaces/common.interface';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

function ModelDecoratorFactory() {
  return <T extends new (...args: any[]) => AbstractModel>(ctor: T) => {
    let instance: InstanceType<T> | null = null;

    return class extends ctor {
      public override name: string;
      public override schema: Record<string, ISchemaType>;

      constructor(...args: any[]) {
        if (instance) {
          return instance;
        }

        super(...args);

        instance = new ctor(...args) as InstanceType<T>;
        if (!instance) {
          throw new SystemException('Model instance cannot be created!');
        }

        sysLogInfo(`[${ctor.name}]: Model initialized!`);
        return instance;
      }
    };
  };
}

export { ModelDecoratorFactory as Model };
