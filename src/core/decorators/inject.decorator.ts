/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { Container } from '../container/inversify.config'; // Adjust the import path as necessary
import { USER_DI } from '@/app/modules/user/user.constant';

export function Inject(token: symbol) {
  return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const xx = Container.getInstance().get(token);
    console.log('[DEBUG][DzungDang] xx:', xx);
  };
}
