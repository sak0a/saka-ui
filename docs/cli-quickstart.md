# CLI Quickstart

## Prerequisites

- Node.js 18+
- `saka-ui` installed in your project

## Initialize

Run `init` to create a `saka-ui.json` config file:

```bash
npx saka-ui init
```

You'll be prompted for:
- **Component directory** — where `.vue` files are copied (default: `src/components/ui`)
- **Composable directory** — where shared composables are copied (default: `src/composables`)
- **TypeScript** — auto-detected from `tsconfig.json`
- **Overwrite** — whether `add` should overwrite existing files (default: no)

This creates `saka-ui.json` in your project root.

## Add Components

Copy a component (and its dependencies) into your project:

```bash
npx saka-ui add button
npx saka-ui add card input     # multiple at once
```

The CLI will:
1. Resolve any transitive dependencies
2. Show you what will be copied
3. Ask for confirmation
4. Copy files into your configured directories
5. Inject a provenance header for future `diff` support

## List Available Components

See what's in the registry:

```bash
npx saka-ui list
```

Output shows each component with its description. Components already in your project are marked with ✓.

## Check for Changes

Compare your local copy against the current registry version:

```bash
npx saka-ui diff button
```

Shows a colored unified diff of any changes you've made. Useful before upgrading to see what you'd need to re-apply.

## Configuration

`saka-ui.json` supports these options:

```json
{
  "componentDir": "src/components/ui",
  "composableDir": "src/composables",
  "typescript": true,
  "overwrite": false
}
```
