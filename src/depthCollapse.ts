import type { JsonValue } from "./indexArrays";

const FLOW_KEY_PATTERN = /^(steps?|stages?)(\[\d+\])?$/i;

const isFlowKey = (key: string): boolean => FLOW_KEY_PATTERN.test(key);

/**
 * Serialized JSONPath keys (JSON.stringify(path), matching jsoncrack-react's
 * `collapsedPaths` format) for container nodes past `depth`. A node stays
 * expanded regardless of depth if it's a "step"/"stage" key itself, or an
 * ancestor of one further down — collapsing it would hide the flow.
 *
 * `expandedRoots` are paths (serialized the same way) the user double-clicked
 * to peek into — each one resets the depth budget to 0 for its own subtree,
 * so double-clicking reveals up to `depth` further levels instead of dumping
 * the whole subtree at once.
 */
export const computeDepthCollapsedPaths = (
  value: JsonValue,
  depth: number,
  expandedRoots: ReadonlySet<string> = new Set(),
): string[] => {
  const collapsed: string[] = [];

  const visit = (node: JsonValue, path: string[], budgetStart: number): boolean => {
    if (node === null || typeof node !== "object") return false;

    const selfKey = path[path.length - 1];
    let showsFlow = selfKey !== undefined && isFlowKey(selfKey);

    const relativeDepth = path.length - budgetStart;
    const childBudgetStart = expandedRoots.has(JSON.stringify(path)) ? path.length : budgetStart;

    for (const [key, child] of Object.entries(node)) {
      if (visit(child, [...path, key], childBudgetStart)) showsFlow = true;
    }

    if (path.length > 0 && relativeDepth > depth && !showsFlow) {
      collapsed.push(JSON.stringify(path));
    }

    return showsFlow;
  };

  visit(value, [], 0);
  return collapsed;
};
