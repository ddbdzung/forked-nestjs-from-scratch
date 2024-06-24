/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IRepositoryDecoratorOptions } from '@/core/interfaces/common.interface';

import debug from 'debug';

import { ServerFactory } from '@/core/helpers/bootstrap.helper';
import { SystemException } from '@/core/helpers/exception.helper';
import { DEBUG_CODE } from '@/core/constants/common.constant';

const sysLogInfo = debug(DEBUG_CODE.APP_SYSTEM_INFO);

function RepositoryDecoratorFactory(
  options: IRepositoryDecoratorOptions = {
    name: '',
  },
) {
  const { name } = options;
  if (!name) {
    throw new SystemException('Repository name must be provided!');
  }

  if (ServerFactory.repositoryRegistry[name]) {
    throw new SystemException(`Repository with name "${name}" has been registered!`);
  }

  return <T extends new (...args: any[]) => any>(ctor: T) => {
    let instance: InstanceType<T> | null = null;

    Object.defineProperty(ctor, 'name', {
      value: name,
      writable: false,
      configurable: false,
    });

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
        if (name) {
          ServerFactory.repositoryRegistry[name] = instance;
        }

        return instance;
      }
    };
  };
}

export { RepositoryDecoratorFactory as Repository };
