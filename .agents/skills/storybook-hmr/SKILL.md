---
name: storybook-hmr
description: >-
  Apply or revert the local Storybook HMR patch that auto-rebuilds the UI
  package when source files change. Use when starting Storybook work, component
  modernization, or when the user mentions Storybook HMR or hot reload not
  working for UI components.
---

# Storybook HMR Patch

Apply a local patch to `storybook/vite.config.js` that adds a file watcher for `packages/ui/src/lib/`. When any UI component source file changes, the watcher automatically runs `svelte-package` to rebuild `packages/ui/dist/`, invalidates Vite's module cache, and triggers a full reload. Without this patch, editing UI component source files has no effect in Storybook because the imports resolve through the package exports map to `dist/`.

This patch is intentionally kept local and must never be committed or pushed. The upstream project has declined to merge it.

## Patch location

Bundled with this skill:

```
.agents/skills/storybook-hmr/patches/storybook-hmr.patch
```

## Apply the patch

```bash
/usr/bin/git apply .agents/skills/storybook-hmr/patches/storybook-hmr.patch
```

If the upstream file has changed and the patch no longer applies cleanly, use 3-way merge:

```bash
/usr/bin/git apply --3way .agents/skills/storybook-hmr/patches/storybook-hmr.patch
```

After applying, restart Storybook (`pnpm --filter storybook dev`).

## Revert the patch

```bash
/usr/bin/git checkout -- storybook/vite.config.js
```

## Before committing

Always revert the patch before committing or creating a PR. The patch should never appear in git history.

## If the patch fails to apply

The upstream `storybook/vite.config.js` has changed too much. Regenerate the patch:

1. Read the current upstream `storybook/vite.config.js`
2. Apply the same changes manually: replace the `colorRegistryWatcher` function with a generic `createFileWatcher` factory and add the `uiPackageWatcher` call
3. Generate a new patch: `/usr/bin/git diff --no-color -- storybook/vite.config.js > .agents/skills/storybook-hmr/patches/storybook-hmr.patch`

The key changes the patch makes:

- Extracts a `createFileWatcher({ name, paths, ignored, command, invalidatePattern })` factory from the existing `colorRegistryWatcher`
- Adds a second watcher for `packages/ui/src/lib` that runs `pnpm --filter @podman-desktop/ui-svelte build` on change
- Invalidates Vite's module graph for `packages/ui/dist` entries before triggering reload

## Important

- Use `/usr/bin/git` (absolute path) for patch operations to bypass RTK proxy which mangles diff output
- The patch does not touch `package.json` or lockfiles
