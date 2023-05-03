export const toEntries = <K extends string, V>(
  record: Readonly<Partial<Record<K, V>>>
): [K, V][] => {
  return Object.entries(record) as [K, V][];
};
