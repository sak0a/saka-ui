# ADR: Hybrid Distribution Model for Saka UI

**Date:** 2026-03-05
**Status:** Accepted
**Authors:** Laurin Frank, Claude

## Context

Saka UI currently ships as a standard npm package. Users `import { SButton } from 'saka-ui'` and get pre-built components. This works well for quick adoption, but limits deep visual customization — users must rely on props and CSS overrides to change component internals.

Libraries like shadcn/ui have popularized an "open-code" model where component source is copied directly into the consumer's project. This gives full editing control but sacrifices centralized updates.

We want both: keep the npm package import path for users who want convenience, and add a registry + CLI layer so users can copy component source when they need deep customization.

## Decision

**Approach A: Source Mirror** — the registry is derived from the existing component source. No code duplication in the repo. A build script copies source files into `registry/source/` with rewritten imports. A CLI reads component manifests and copies files into the consumer's project.

### Alternatives considered

- **Pre-built Registry Bundles** — each registry component is self-contained with inlined deps. Rejected: too much duplication, hard to maintain, defeats shared utilities.
- **Hybrid Copy+Import** — copy SFCs but keep composable imports pointing at the `saka-ui` package. Rejected: not truly standalone, users can't edit composables.

## Architecture

### Three layers

```
┌──────────────────────────────────────┐
│  Package Layer (existing)            │
│  src/index.ts → dist/saka-ui.js     │
│  Users: import { SButton } from     │
│         'saka-ui'                    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Registry Layer (new)                │
│  registry/source/ — raw .vue/.ts    │
│  registry/components/*.json —       │
│    manifests                         │
│  Derived from src/ at build time     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  CLI Layer (new)                     │
│  dist/cli/index.mjs                  │
│  Commands: init, add, list, diff     │
│  Reads manifests, copies source,     │
│  rewrites imports                    │
└──────────────────────────────────────┘
```

### Registry structure

```
registry/
├── index.json                 # master list of copyable components
├── components/
│   ├── button.json            # manifest per component
│   ├── card.json
│   ├── input.json
│   └── ...
└── source/
    ├── components/
    │   └── ui/
    │       ├── SButton.vue
    │       ├── card/
    │       │   ├── SCard.vue
    │       │   ├── SCardHeader.vue
    │       │   └── ...
    │       └── SInput.vue
    └── composables/
        ├── useTheme.ts
        └── ...
```

### Component manifest format

```json
{
  "name": "button",
  "displayName": "SButton",
  "description": "Button with variants, sizes, icons, ripple, and loading state",
  "version": "0.1.0",
  "files": ["components/ui/SButton.vue"],
  "dependencies": [],
  "composables": [],
  "peerDependencies": { "vue": "^3.2.0" },
  "devDependencies": { "@mdi/font": "^7.0.0" }
}
```

- `files` — paths relative to `registry/source/`
- `dependencies` — other registry components (resolved transitively)
- `composables` — composable files to copy alongside
- `peerDependencies` — npm packages the consumer must have
- `devDependencies` — optional npm packages

### CLI commands

| Command | Purpose |
|---------|---------|
| `saka-ui init` | Create `saka-ui.json` config (component dir, composable dir, TS flag) |
| `saka-ui add <name>` | Copy component + deps, rewrite imports, add provenance header |
| `saka-ui list` | Show available components, mark already-installed ones |
| `saka-ui diff <name>` | Unified diff of local copy vs registry version |

### Consumer config (`saka-ui.json`)

```json
{
  "componentDir": "src/components/ui",
  "composableDir": "src/composables",
  "typescript": true,
  "overwrite": false
}
```

### Provenance header (injected into copied files)

```
// @saka-ui/registry v0.1.0 — button
// Source: saka-ui@0.1.0
// Do not remove this header if you want `saka-ui diff` to work.
```

### Build pipeline

1. `vue-tsc && vite build` — library build (unchanged)
2. `tsx scripts/build-registry.ts` — copy src/ → registry/source/, rewrite `~/` path aliases to relative paths, validate manifests
3. `tsx scripts/build-cli.ts` (or tsup) — bundle CLI to `dist/cli/index.mjs`

### CLI dependencies (bundled, not exposed to consumers)

- `commander` — argument parsing
- `prompts` — interactive prompts
- `fast-glob` — file discovery
- `diff` — diff generation

### npm package contents

```
dist/
├── saka-ui.js, saka-ui.umd.cjs, style.css, index.d.ts  # library (unchanged)
└── cli/index.mjs                                          # CLI
registry/
├── index.json, components/*.json                          # manifests
└── source/                                                # raw files
```

## Component extension surface

For pilot components, we improve customization ergonomics:

- **`inheritAttrs: false`** + explicit `v-bind="$attrs"` on root element
- **Class merge props**: `contentClass`, `headerClass`, `inputClass`, etc. for styling internal elements
- **CSS variable documentation**: each component documents which `--s-*` vars it reads
- **Props stay for**: behavior, a11y, state, core variants/sizes
- **Props removed for**: granular visual values (individual padding, border-radius numbers, color hex codes) — these become CSS vars or source edits

## Pilot components

| Name | Files | Composable deps | Component deps |
|------|-------|-----------------|----------------|
| button | `SButton.vue` | none | none |
| card | `SCard.vue`, `SCardHeader.vue`, `SCardContent.vue`, `SCardFooter.vue`, `SCardMedia.vue`, `SCardActions.vue` | none | none |
| input | `SInput.vue` | none | none |

Chosen because they are dependency-light, heavily used, and exercise the full copy pipeline.

## Documentation deliverables

1. `docs/open-code-mode.md` — Package mode vs Open-code mode comparison
2. `docs/cli-quickstart.md` — CLI usage with examples
3. `docs/customization-strategy.md` — Props vs CSS vars vs source edits decision tree
4. `docs/upgrade-strategy.md` — Using `diff`, manual merge, re-add workflow

## Backward compatibility

- All existing imports from `saka-ui` continue to work unchanged
- No components or exports are removed
- `dist/saka-ui.js` build is unaffected
- Registry and CLI are additive — consumers who don't use them see no changes

## Non-goals (this phase)

- Migrating all 40+ components to the registry
- Automatic conflict-free updating of heavily customized copies
- Separate `@saka-ui/cli` package

## Consequences

- **Positive**: Users get full source control when needed; package mode stays simple; incremental adoption
- **Negative**: CLI adds maintenance surface; copied components can drift from upstream; manifests must be kept in sync manually (mitigated by build-time validation)
