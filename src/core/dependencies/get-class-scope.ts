import { InjectableOptions, SCOPE, SCOPE_METADATA_KEY } from './injectable.decorator';

export function getClassScope(target: Ctr) {
  return (
    (Reflect.getMetadata(SCOPE_METADATA_KEY, target) as InjectableOptions | undefined)?.scope ||
    SCOPE.DEFAULT
  );
}
