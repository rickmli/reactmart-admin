export function filterDefinedFields(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined)
  );
}
