import { InjectableOptions, SCOPE, SCOPE_METADATA_KEY } from './injectable.decorator';

/**
 * @description Get class scope defined by @Injectable decorator
 * @param target Class constructor to get the scope
 * @public
 */
export function getClassScope(target: Ctr) {
  return (
    (Reflect.getMetadata(SCOPE_METADATA_KEY, target) as InjectableOptions | undefined)?.scope ||
    SCOPE.DEFAULT
  );
}
