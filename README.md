# jsoncrack-core

A standalone extraction of jsoncrack.com's YAML/JSON → interactive graph
visualization. This folder is self-contained — it is **not** part of the
repo's pnpm workspace and can be copied elsewhere and run with plain npm.

## What's here

- `src/parseInput.ts` — converts a YAML or JSON string into a plain JS
  object (`js-yaml` for YAML, `jsonc-parser` for JSON), mirroring the logic
  in `apps/www/src/lib/utils/jsonAdapter.ts`.
- `src/App.tsx` — a minimal editor + `<JSONCrack />` component from the
  published [`jsoncrack-react`](https://www.npmjs.com/package/jsoncrack-react)
  package, which handles the actual graph parsing/layout/rendering.

## Run it

```bash
cd core
npm install
npm run dev
```

Then open the printed local URL. Paste or edit YAML/JSON in the left pane
and the graph renders live on the right.

## Build

```bash
npm run build
npm run preview
```
