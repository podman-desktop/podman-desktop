---
name: component-modernization
description: >-
  Prepare and execute Design System component modernization. Drafts GitHub
  subtask issues, applies the Storybook HMR patch, and guides the modernization
  workflow. Use when starting work on a new component modernization, creating
  subtask issues, or when the user mentions design system modernization.
---

# Component Modernization Workflow

End-to-end workflow for modernizing a Podman Desktop UI component as part of the Design System Modernization initiative (#13479).

## Step 1: Apply Storybook HMR patch

Before starting, apply the local HMR patch so Storybook hot-reloads when UI component source files change:

```bash
/usr/bin/git apply .agents/skills/storybook-hmr/patches/storybook-hmr.patch
```

If it fails due to upstream changes, use `/storybook-hmr` skill to regenerate.

## Step 2: Draft subtask issues

For each component modernization epic, create two subtasks as GitHub issues (type: Task). The user files these manually - never use the GitHub MCP to create issues.

### Subtask 1: Storybook stories

**Title:** `Storybook: Add stories for \`{ComponentName}\` component`**Label:**`area/storybook`

**Body template:**

```markdown
### Task content

Add comprehensive Storybook stories for the `{ComponentName}` component (`{component_path}`) to document all current behaviors and usage contexts.

- Parent: #{parent_issue}

### Stories to create

{story_list - tailored to the specific component, typically 4-6 stories covering:}

1. **Basic** - interactive controls
2. **Usage context stories** - mock real layouts where the component appears
3. **Accessibility** - ARIA attributes, HC support, reduced motion
4. **Comparison** (if applicable) - side-by-side with related components

### Notes

- Follow the `kind` dispatch pattern established in `ProgressBar.stories.svelte`
- Use CSS-variable Tailwind classes for theme compatibility across all 4 themes (light, dark, hc-light, hc-dark)
- Include `autodocs` tag for auto-generated documentation
- {import_note - relative path for renderer components, package import for ui-svelte components}
```

### Subtask 2: Modernize component

**Title:** `Modernize \`{ComponentName}\``**Label:**`area/ui`

**Body template:**

```markdown
### Task content

Modernize the `{ComponentName}` component (`{component_path}`) as part of the Design System Modernization initiative.

- Parent: #{parent_issue}
- Blocked by: {storybook_subtask_reference}

### Changes

1. {change_list - tailored to the specific component, typically covering:}
   - Tailwind v4 syntax updates
   - Color registry token usage (with HC support)
   - ARIA / a11y improvements
   - Animation updates
   - Replace inline implementations with shared components
   - Test updates
   - Storybook annotation updates

### Key design decisions

{decisions - component-specific choices like rounded corners, dimensions, modes}
```

## Step 3: Research the component

Before implementing, investigate:

1. **All usage sites** - grep for imports and component usage across the codebase
2. **Color registry tokens** - check which tokens exist and which need to be added
3. **Existing tests** - understand current test coverage
4. **Related components** - identify inline duplicates or related progress/loading indicators
5. **The parent epic** - read the issue body for context and screenshots

## Step 4: Implement

Follow this order:

1. **Storybook stories first** - create comprehensive stories documenting current behavior
2. **Rebuild UI package** - `pnpm --filter @podman-desktop/ui-svelte build`
3. **Component modernization** - apply visual/a11y changes
4. **Update tests** - match new structure
5. **Verify** - run tests, check all 4 themes in Storybook, check in running app

## Step 5: Before committing

1. **Revert the HMR patch**: `git checkout -- storybook/vite.config.js`
2. **Run all checks**: `pnpm lint-staged`, `pnpm test:ui`, `pnpm typecheck`, `pnpm lint:check`
3. The user handles committing, pushing, and filing PRs

## Reference: ProgressBar modernization

The completed ProgressBar modernization (#16244) is the reference implementation:

- **Stories PR:** #17417 - comprehensive Storybook stories with `kind` dispatch pattern
- **Move PR:** #17424 - moved from renderer to UI package (if applicable)
- **Modernize PR:** #17422 - visual/a11y modernization

Key patterns established:

- Neutral stone palette with full HC support (hcDark/hcLight)
- WAI-ARIA attributes on `role="progressbar"` elements
- High-contrast guide lines (transparent in normal, visible in HC)
- Outline borders for definition
- `prefers-reduced-motion` support
- Tailwind v4 CSS variable shorthand syntax
