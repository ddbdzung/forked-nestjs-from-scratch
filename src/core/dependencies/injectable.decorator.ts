import { CONSTRUCTOR_PARAM_METADATA_KEY } from './dependency-container';

/**
 * @description Injectable decorator to module to class constructor
 * @public
 */
export function Injectable(options: InjectableOptions = { scope: SCOPE.DEFAULT }) {
  return (target: Ctr) => {
    Reflect.defineMetadata(SCOPE_METADATA_KEY, options, target);

    const constructorParamList = Reflect.getMetadata(CONSTRUCTOR_PARAM_METADATA_KEY, target) || [];
    Reflect.defineMetadata(CONSTRUCTOR_PARAM_METADATA_KEY, constructorParamList, target);

    return target;
  };
}

export const SCOPE_METADATA_KEY = '__SCOPE_METADATA_KEY__';

export interface InjectableOptions {
  scope: SCOPE;
}

/**
 * @public
 */
export enum SCOPE {
  // Singleton
  DEFAULT = 'DEFAULT',

  // New instance every time it is requested
  // TRANSIENT = 'TRANSIENT', // Not implemented yet

  // New instance per request (e.g. HTTP request)
  // REQUEST = 'REQUEST', // Not implemented yet
}
