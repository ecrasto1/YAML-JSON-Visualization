import type { JsonValue } from "./indexArrays";

const FLOW_KEY_PATTERN = /^(steps?|stages?)(\[\d+\])?$/i;

const isFlowKey = (key: string): boolean => FLOW_KEY_PATTERN.test(key);

/**
 * Serialized JSONPath keys (JSON.stringify(path), matching jsoncrack-react's
 * `collapsedPaths` format) for container nodes past `depth`. A node stays
 * expanded regardless of depth if it's a "step"/"stage" key itself, or an
 * ancestor of one further down — collapsing it would hide the flow.
 */
export const computeDepthCollapsedPaths = (value: JsonValue, depth: number): string[] => {
  const collapsed: string[] = [];

  const visit = (node: JsonValue, path: string[]): boolean => {
    if (node === null || typeof node !== "object") return false;

    const selfKey = path[path.length - 1];
    let showsFlow = selfKey !== undefined && isFlowKey(selfKey);

    for (const [key, child] of Object.entries(node)) {
      if (visit(child, [...path, key])) showsFlow = true;
    }

    if (path.length > 0 && path.length > depth && !showsFlow) {
      collapsed.push(JSON.stringify(path));
    }

    return showsFlow;
  };

  visit(value, []);
  return collapsed;
};
