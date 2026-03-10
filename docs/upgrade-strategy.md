# Upgrade Strategy for Open-Code Components

When you copy components via `saka-ui add`, you take ownership of that code. Here's how to handle upstream updates.

## Checking for Changes

After updating the `@sakoa/ui` package, check what changed in the registry:

```bash
npx saka-ui diff button
```

This compares your local copy against the current registry version, stripping provenance headers for a fair comparison. Output is a colored unified diff.

## Merge Workflow

1. **Run diff** to see what changed upstream
2. **Review each change** — decide if you want it
3. **Apply manually** — copy specific changes into your local file
4. **Test** your component still works as expected

## Re-adding (Full Reset)

If you want the latest upstream version and are okay losing local changes:

1. Set `"overwrite": true` in `saka-ui.json` (or delete the local file)
2. Run `saka-ui add button`
3. The file is replaced with the fresh registry version
4. Re-apply your customizations manually

## Provenance Headers

Each copied file includes a header like:

```
// @saka-ui/registry v0.2.9 — button
// Source: saka-ui@0.2.9
// Do not remove this header if you want `saka-ui diff` to work.
```

This tells the `diff` command which registry version to compare against. If you remove it, `diff` still works but compares against the current registry version directly.

## Tips

- **Keep changes minimal** — the less you change, the easier merges are
- **Document your changes** — add comments explaining why you diverged
- **Check diff before updating** `@sakoa/ui` — know what's coming
- **Consider CSS variables first** — many visual changes don't need source edits
