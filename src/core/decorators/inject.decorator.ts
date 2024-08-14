/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { container } from '../container/inversify.config'; // Adjust the import path as necessary

export function Inject(token: symbol) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    const existingInjectedParameters = Reflect.getOwnMetadata('design:paramtypes', target) || [];
    existingInjectedParameters[parameterIndex] = token;
    Reflect.defineMetadata('design:paramtypes', existingInjectedParameters, target);

    // Modify constructor to inject dependencies
    const originalConstructor = target;
    const newConstructor = function (...args: any[]) {
      const injectedArgs = existingInjectedParameters.map((dep: symbol) => container.get(dep));
      return new originalConstructor(...injectedArgs, ...args);
    };
    newConstructor.prototype = originalConstructor.prototype;
    return newConstructor;
  };
}
