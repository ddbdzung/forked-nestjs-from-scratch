/**
 * Function to filter out the keys from the object
 * @param keys Filter out the keys from the object
 * @returns Filtered object
 */
export const omit = (obj: Record<string, unknown>, keys: string[]): Record<string, unknown> => {
  // Guard clause to handle edge case when obj is null or undefined
  if (!obj) {
    return {};
  }

  // Using destructuring and Object.entries for clarity
  const result: Record<string, unknown> = Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key)),
  );

  return result;
};
