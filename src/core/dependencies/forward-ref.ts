export type ForwardRefFn<T> = () => T;

export function forwardRef<T>(cb: ForwardRefFn<T>) {
  const forwardRefFn = () => cb();
  return forwardRefFn;
}
