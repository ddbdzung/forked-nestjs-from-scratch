import { ForwardRefFn } from './injection-token';

export function forwardRef(cb: ForwardRefFn) {
  return () => cb();
}
