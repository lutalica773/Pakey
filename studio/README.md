# Pakey Studio

Pakey Studio is a forward-compatible workspace for future visual packaging,
project editing, and extension workflows.

This folder is intentionally additive and inert. Nothing in the existing CLI,
Tauri runtime, build pipeline, builders, or generated config flow imports these
modules today. The current `pake` command continues to use the established
`bin/` and `src-tauri/` paths exactly as before.

## Proposed Structure

```text
studio/
├── core/
│   ├── index.ts
│   ├── plugin.ts
│   └── project-model.ts
└── ui/
    └── components/
        ├── PluginSlot.tsx
        └── ProjectSummary.tsx
```

## Design Goals

- Preserve 100% CLI and Tauri runtime compatibility.
- Model Studio projects without depending on generated Tauri config internals.
- Define plugin contracts before adding a plugin loader.
- Keep UI components presentation-only until an app shell exists.
- Allow future migration from CLI options to Studio projects through explicit
  adapters rather than implicit shared mutable state.

## Non-Goals

- No runtime behavior changes.
- No build pipeline changes.
- No Rust integration.
- No automatic plugin discovery or execution.
- No schema migration for existing `pake.json` files.
