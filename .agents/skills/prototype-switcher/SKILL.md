---
name: prototype
description: >-
  Set up or tear down the UX prototype screen switcher in the Podman Desktop
  titlebar. Use when the user wants to start a new UI/UX prototype, add
  prototype screen states, or remove the prototype infrastructure after a
  prototype ships. Triggers: "set up a prototype", "new prototype",
  "prototype switcher", "remove prototype", "tear down prototype".
---

# UX Prototype Screen Switcher

Manages reusable prototype infrastructure that adds a screen switcher dropdown
to the Podman Desktop window titlebar. Each prototype defines named screens
with typed override data and optional timed phase transitions.

## When invoked

Determine what the user needs:

1. **Set up** - install the infrastructure files and help wire a new prototype
2. **Tear down** - remove the infrastructure after a prototype ships

---

## Set up

### Step 1 - Install infrastructure files

Check whether these files already exist. If they do, skip to Step 2.

1. **Create the store** at `packages/renderer/src/stores/prototype.ts`
   Copy the contents from `references/prototype-store.ts` (in this skill's directory).

2. **Create the selector** at `packages/renderer/src/lib/ui/PrototypeSelector.svelte`
   Copy the contents from `references/PrototypeSelector.svelte` (in this skill's directory).

3. **Patch TitleBar** at `packages/renderer/src/lib/ui/TitleBar.svelte`
   - Add import: `import PrototypeSelector from './PrototypeSelector.svelte';`
     (place it alphabetically among the relative imports, after any `/@/` imports)
   - In the `<!-- right -->` section, add `items-center` to the div's classes
   - Add `<PrototypeSelector />` as the first child of that div, before `WindowControlButtons`

   The right section should look like:

   ```svelte
   <!-- right -->
   <div class="flex flex-row grow justify-end items-center">
     <PrototypeSelector />
     {#if platform !== 'darwin'}
       <WindowControlButtons platform={platform} />
     {/if}
   </div>
   ```

### Step 2 - Wire the prototype

Ask the user for:

- **Prototype name** - short title shown in the titlebar (e.g. "Badge visibility")
- **Screens** - list of named states to switch between
- **Override shape** - what data each screen provides to the consuming component
- **Timelines** (optional) - which screens have timed phase transitions

Then create the registration in the appropriate component. Pattern:

```typescript
import { onDestroy } from 'svelte';

import { registerPrototype, unregisterPrototype } from '/@/stores/prototype';

interface MyOverride {
  // the user's override shape
}

const override = registerPrototype<MyOverride>({
  name: 'Prototype name here',
  screens: [
    { value: 'idle', label: 'Idle state' },
    { value: 'active', label: 'Active state' },
  ],
  overrides: {
    idle: {
      /* ... */
    },
    active: {
      /* ... */
    },
  },
});

onDestroy(unregisterPrototype);
```

To consume the override reactively in the component:

```typescript
let currentState: MyOverride | undefined;
const unsubscribe = override.subscribe(value => {
  currentState = value;
});
onDestroy(unsubscribe);
```

### Phase transitions

For screens that should auto-advance through phases on a timer, add `timelines`
and phase-keyed overrides using the `screenValue:phaseNumber` convention:

```typescript
registerPrototype({
  // ...
  overrides: {
    animated: { status: 'starting' }, // phase 0 (default)
    'animated:1': { status: 'running' }, // phase 1 (after 3s)
    'animated:2': { status: 'complete' }, // phase 2 (after 8s)
  },
  timelines: {
    animated: [
      { delay: 3000, phase: 1 },
      { delay: 8000, phase: 2 },
    ],
  },
});
```

### Step 3 - Verify

1. Run `pnpm typecheck:renderer` - should pass with 0 errors
2. Run `pnpm lint:check` - no new errors in the changed files
3. Run `pnpm watch` - confirm the titlebar shows the selector when the prototype is registered

---

## Tear down

When a prototype has shipped as a real feature and the switcher is no longer needed:

1. **Remove `registerPrototype()` / `unregisterPrototype()` calls** from the prototype's component(s)
2. **Remove the prototype's override interface and config object**
3. **Check if any other prototype still uses the infrastructure:**

   ```bash
   grep -r "registerPrototype\|unregisterPrototype" packages/renderer/src/ --include="*.ts" --include="*.svelte"
   ```

4. **If no other prototype uses it**, remove the infrastructure:
   - Delete `packages/renderer/src/stores/prototype.ts`
   - Delete `packages/renderer/src/lib/ui/PrototypeSelector.svelte`
   - Revert `packages/renderer/src/lib/ui/TitleBar.svelte`:
     - Remove the `PrototypeSelector` import
     - Remove `<PrototypeSelector />` from the right section
     - Remove `items-center` from the right section div

5. **Verify clean removal:**

   ```bash
   grep -r "prototype" packages/renderer/src/stores/ --include="*.ts"
   grep -r "PrototypeSelector" packages/renderer/src/ --include="*.svelte"
   grep -r "registerPrototype\|unregisterPrototype" packages/renderer/src/
   ```

   All three should return zero results.
