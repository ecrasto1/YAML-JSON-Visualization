export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

/**
 * Rewrites every array into an object keyed `${key}[i]` (e.g. "step[0]", "step[1]"),
 * so the graph shows each array item's position instead of indistinguishable siblings.
 */
export const indexArrays = (value: JsonValue, keyHint = "item"): JsonValue => {
  if (Array.isArray(value)) {
    const indexed: Record<string, JsonValue> = {};
    value.forEach((item, i) => {
      const itemKey = `${keyHint}[${i}]`;
      indexed[itemKey] = indexArrays(item, itemKey);
    });
    return indexed;
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, JsonValue> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = indexArrays(val, key);
    }
    return result;
  }

  return value;
};
