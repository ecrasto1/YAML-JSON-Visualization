import { JSONCrack } from "jsoncrack-react";
import { useEffect, useState } from "react";
import { indexArrays, type JsonValue } from "./indexArrays";
import { contentToJson, type InputFormat } from "./parseInput";

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

  useEffect(() => {
    try {
      setJson(indexArrays(contentToJson(content, format)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [content, format]);

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
          <JSONCrack json={json} theme="dark" showControls layoutDirection="RIGHT" />
        )}
      </div>
    </div>
  );
}
