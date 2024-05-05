/**
 * @param value Parse value as safe integer from string
 * @returns Parsed value as safe integer
 */
export const parseSafeInteger = (value: unknown) => {
  const parsedValue = parseInt(value as string);
  if (isNaN(parsedValue) || parsedValue.toString() !== value?.toString()) {
    throw new Error('Error: Cannot parse value as integer');
  }

  if (!Number.isSafeInteger(parsedValue)) {
    throw new Error('Error: Value is not a safe integer');
  }

  return parsedValue;
};
