/**
 * @public
 */
export type ForwardRefFn<T> = () => T;

/**
 * forwardRef function is used to resolve circular dependencies.
 * @public
 */
export function forwardRef<T>(cb: ForwardRefFn<T>) {
  const forwardRefFn = () => cb();
  return forwardRefFn;
}
