import { JSONCrack } from "jsoncrack-react";
import type { JSONPath } from "jsonc-parser";
import { useEffect, useMemo, useState } from "react";
import { computeDepthCollapsedPaths } from "./depthCollapse";
import { indexArrays, type JsonValue } from "./indexArrays";
import { contentToJson, type InputFormat } from "./parseInput";

const DEFAULT_DEPTH = 2;

const SAMPLE_YAML = `name: jsoncrack-core
version: 1.0.0
description: Standalone YAML/JSON to graph visualizer
steps:
  - name: build
  - name: test
  - name: deploy
stages:
  - name: dev
  - name: prod
author:
  name: piano man
  role: engineer
`;

export default function App() {
  const [format, setFormat] = useState<InputFormat>("yaml");
  const [content, setContent] = useState(SAMPLE_YAML);
  const [json, setJson] = useState<JsonValue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [depth, setDepth] = useState(DEFAULT_DEPTH);
  const [manualOverrides, setManualOverrides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      setJson(indexArrays(contentToJson(content, format)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [content, format]);

  useEffect(() => {
    setManualOverrides({});
  }, [depth, json]);

  const collapsedPaths = useMemo(() => {
    if (typeof json !== "object" || json === null) return [];
    const collapsedSet = new Set(computeDepthCollapsedPaths(json, depth));
    for (const [key, collapsed] of Object.entries(manualOverrides)) {
      if (collapsed) collapsedSet.add(key);
      else collapsedSet.delete(key);
    }
    return [...collapsedSet];
  }, [json, depth, manualOverrides]);

  const handleToggleCollapse = (path: JSONPath) => {
    const key = JSON.stringify(path);
    setManualOverrides(prev => ({ ...prev, [key]: !collapsedPaths.includes(key) }));
  };

  return (
    <div className="app">
      <div className="editor-pane">
        <div className="toolbar">
          <label>
            Format:
            <select value={format} onChange={e => setFormat(e.target.value as InputFormat)}>
              <option value="yaml">YAML</option>
              <option value="json">JSON</option>
            </select>
          </label>
          <label>
            Depth:
            <input
              type="number"
              min={0}
              max={20}
              value={depth}
              onChange={e => setDepth(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>
        </div>
        <textarea
          className="editor"
          value={content}
          onChange={e => setContent(e.target.value)}
          spellCheck={false}
        />
        {error && <div className="error">{error}</div>}
      </div>
      <div className="graph-pane">
        {typeof json === "object" && json !== null && (
          <JSONCrack
            json={json}
            theme="dark"
            showControls
            layoutDirection="RIGHT"
            collapsedPaths={collapsedPaths}
            onToggleCollapse={handleToggleCollapse}
          />
        )}
      </div>
    </div>
  );
}
