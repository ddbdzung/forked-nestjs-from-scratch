import { SystemException } from '@/core/helpers/exception.helper';

/**
 * @param value Parse value as safe integer from string
 * @returns Parsed value as safe integer
 */
export const parseSafeInteger = (value: unknown) => {
  const parsedValue = parseInt(value as string);
  if (isNaN(parsedValue) || parsedValue.toString() !== value?.toString()) {
    throw new SystemException('Cannot parse value as integer');
  }

  if (!Number.isSafeInteger(parsedValue)) {
    throw new SystemException('Value is not a safe integer');
  }

  return parsedValue;
};
