export const combineNonEmpty = (
  values: (string | null)[],
  separator = "\n"
): string | null => {
  let combined: string | null = null;
  values.forEach(value => {
    if (value) {
      if (!combined) combined = value;
      else combined += separator + value;
    }
  });
  return combined;
};
