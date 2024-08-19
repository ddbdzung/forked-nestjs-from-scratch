/* eslint-disable @typescript-eslint/no-explicit-any */

import debug from 'debug';

import { SystemException, AbstractModel } from '@/core/helpers';
import { DEBUG_CODE } from '@/core/constants/common.constant';
import { ISchemaType } from '@/core/interfaces/common.interface';
import { container } from '../../test';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

export function ModelDecoratorFactory() {
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
