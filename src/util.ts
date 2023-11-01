export const assertNotNil = <T>(
  maybe: T,
  varName: string
): asserts maybe is NonNullable<T> => {
  if (maybe == null) {
    throw new TypeError(`Unexpected nullish ${varName} value`);
  }
};
