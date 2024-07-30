/* eslint-disable @typescript-eslint/no-explicit-any */
function censor(censor: any) {
  let i = 0;

  return function (key: any, value: any) {
    if (i !== 0 && typeof censor === 'object' && typeof value == 'object' && censor == value)
      return '[Circular]';

    if (i >= 29)
      // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;
  };
}

export function safeStringify(val: any) {
  try {
    return JSON.stringify(val, censor(val));
  } catch (error) {
    return '[Circular]';
  }
}
