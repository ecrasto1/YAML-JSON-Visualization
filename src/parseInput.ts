import { load } from "js-yaml";
import { type ParseError, parse as parseJsonc } from "jsonc-parser";
import type { JsonValue } from "./indexArrays";

export type InputFormat = "json" | "yaml";

export const contentToJson = (value: string, format: InputFormat): JsonValue => {
  if (!value.trim()) return {};

  if (format === "yaml") {
    return (load(value) as JsonValue) ?? {};
  }

  const errors: ParseError[] = [];
  const result = parseJsonc(value, errors);
  if (errors.length > 0) return JSON.parse(value);
  return result;
};
