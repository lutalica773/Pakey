# Pakey Studio Architecture Plan

Pakey Studio is a future visual layer for designing, validating, and packaging
Pakey apps. The current implementation is intentionally additive: it introduces
types, plugin contracts, UI component stubs, and documentation without wiring
anything into the existing CLI, Tauri runtime, builders, or release pipeline.

## Compatibility Contract

Studio must preserve current behavior by default.

- Existing `pake` CLI commands remain the source of truth for shipping builds.
- Existing Tauri runtime behavior remains unchanged.
- Existing builder classes remain unchanged.
- Existing generated config files remain unchanged.
- Studio modules are not imported by production code until an explicit
  integration step is designed and reviewed.

## Proposed Layers

```text
Studio UI
  -> Studio project model
  -> Studio plugin API
  -> future adapter layer
  -> existing CLI/config/build pipeline
```

The current additive files implement only the first three conceptual pieces:

- `studio/core/project-model.ts`
- `studio/core/plugin.ts`
- `studio/ui/components/*.tsx`

## Project Model

The Studio project model is a UI-friendly representation of app packaging
intent. It groups settings by concern:

- `identity` - name, identifier, version, app icon, tray icon.
- `window` - URL, size, window controls, navigation, find, zoom.
- `runtime` - user agent, proxy, incognito, WebAssembly, tray, instances.
- `build` - targets, debug mode, binary retention, macOS entitlements.
- `injection` - CSS and JavaScript files to inject.
- `metadata` - non-build annotations for Studio.

The model deliberately does not replace `PakeCliOptions` or `pake.json`. A
future adapter can translate Studio projects into existing CLI/config inputs
without changing the current build flow.

## Plugin Interface

Plugins are modeled as plain TypeScript contracts. The initial contract supports
future validation, transformation, and UI contribution points.

Capability examples:

- `project:read`
- `project:validate`
- `project:transform`
- `ui:panel`
- `ui:toolbar`
- `build:inspect`

There is no plugin loader yet. That is intentional: plugin execution requires a
security, lifecycle, and compatibility design before runtime integration.

## UI Components

The initial React components are presentation-only:

- `ProjectSummary` renders a read-only summary of a Studio project.
- `PluginSlot` renders declared UI contributions for a specific region.

These components do not import application state, call the CLI, or invoke Tauri.

## Future Adapter Work

When Studio is ready to connect to the existing product, add adapters rather
than changing existing modules in place.

Recommended future adapters:

- Studio project to CLI options.
- CLI options to Studio project.
- Studio project validation using existing option rules.
- Studio build preview to explain generated artifacts before invoking builders.

## Guardrails

- Keep `studio/` independent from `bin/` until integration is explicit.
- Keep generated config as an output of an adapter, not shared mutable state.
- Treat injected scripts as runtime product code and avoid Studio-side mutation.
- Prefer schema-versioned Studio project files for future migrations.
