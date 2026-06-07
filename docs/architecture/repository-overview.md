# Pakey Repository Architecture

This document captures the current repository shape without changing existing
behavior. It is intended as a stable reference for future Pakey Studio work.

## Current Product Flow

```text
pake <url> [options]
  -> bin/cli.ts
  -> bin/helpers/cli-program.ts
  -> bin/options/index.ts
  -> bin/helpers/merge.ts
  -> src-tauri/.pake/*.json
  -> bin/builders/*Builder.ts
  -> Tauri build
  -> platform installer or app bundle
```

## Major Subsystems

### TypeScript CLI

The CLI lives under `bin/`. It owns command parsing, defaults, input
normalization, icon handling, environment preparation, config generation, and
platform build orchestration.

Important files:

- `bin/cli.ts` - command entrypoint.
- `bin/helpers/cli-program.ts` - Commander option surface.
- `bin/defaults.ts` - default CLI option values.
- `bin/types.ts` - CLI and generated config TypeScript contracts.
- `bin/options/index.ts` - app name, identifier, and icon normalization.
- `bin/helpers/merge.ts` - CLI option to Tauri config generation.
- `bin/builders/BaseBuilder.ts` - shared build lifecycle.
- `bin/builders/MacBuilder.ts`, `WinBuilder.ts`, `LinuxBuilder.ts` -
  platform-specific build behavior.

### Tauri Runtime Template

The runtime lives under `src-tauri/`. The CLI treats this directory as the app
template and writes generated configuration into `src-tauri/.pake` during CLI
builds.

Important files:

- `src-tauri/src/lib.rs` - Tauri app bootstrap and plugin registration.
- `src-tauri/src/app/config.rs` - Rust model for generated `pake.json`.
- `src-tauri/src/app/window.rs` - webview creation and window behavior.
- `src-tauri/src/app/setup.rs` - tray and global shortcut setup.
- `src-tauri/src/app/menu.rs` - macOS app menu.
- `src-tauri/src/app/invoke.rs` - commands exposed to injected scripts.
- `src-tauri/src/inject/*.js` - browser-side runtime helpers.

### Tests

The test suite combines fast Vitest coverage with a broader Node test runner.

- `tests/unit/` - focused unit tests and snapshots.
- `tests/integration/` - path and workflow integration tests.
- `tests/index.js` - broad CLI test runner with optional real-build coverage.
- `tests/release.js` - release-focused checks.

### Automation

GitHub Actions workflows live under `.github/workflows/`.

- `quality-and-test.yml` - formatting, Rust quality, fast validation, full
  build validation.
- `release.yml` - release placeholder, CLI artifact, popular app builds,
  Docker publishing.
- `npm-publish.yml` - npm trusted publishing.
- `single-app.yaml` and `pake-cli.yaml` - packaging workflow support.

## Studio Boundary

Future Pakey Studio code should stay behind an explicit boundary:

- Studio project model: `studio/core/project-model.ts`
- Studio plugin contracts: `studio/core/plugin.ts`
- Studio UI components: `studio/ui/components/`
- Studio documentation: `docs/architecture/studio.md`

No existing CLI or runtime module imports Studio files today. That keeps the
current build behavior stable while allowing additive design work.
