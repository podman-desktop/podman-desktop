---
name: extension-features
description: >-
  Guide for working with the Podman Desktop extension feature mechanism: declaring
  features in an extension manifest, how the registry propagates them to the
  renderer, and how Svelte components detect active features. Use when adding a
  new feature declaration to an extension, writing renderer code that reacts to
  an extension being active/inactive, or debugging why a feature flag is not
  being picked up.
---

# Extension Features in Podman Desktop

Extensions can advertise named capabilities ("features") that the renderer
watches. Any Svelte component can reactively detect whether a feature is
currently active without knowing which extension registered it.

## Key files

| File                                                              | Role                                                                                        |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `packages/main/src/plugin/feature-registry.ts`                    | `FeatureRegistry` — stores features, fires IPC on changes                                   |
| `packages/main/src/plugin/extension/extension-loader.ts`          | Reads `contributes.features` from the manifest and calls `registerFeatures()` on activation |
| `packages/main/src/plugin/extension/extension-manifest-schema.ts` | Zod schema — `features` is `z.array(z.string()).optional()`                                 |
| `packages/renderer/src/stores/registered-features.ts`             | Svelte store + event target for the renderer                                                |
| `packages/renderer/src/PreferencesNavigation.svelte`              | Real-world usage example                                                                    |

---

## 1 — Declaring a feature in an extension

Add a `features` array under `contributes` in the extension's `package.json`:

```json
{
  "contributes": {
    "features": ["my-feature-name"]
  }
}
```

The extension loader reads this at activation time and calls
`featureRegistry.registerFeatures(extensionId, features[])` automatically.
The returned `Disposable` is added to the extension's subscriptions, so the
feature is unregistered when the extension is deactivated — no manual cleanup
needed.

---

## 2 — How the registry works (main process)

`FeatureRegistry` (`packages/main/src/plugin/feature-registry.ts`):

- Stores a `Map<extensionId, string[]>`.
- `registerFeatures(extensionId, features)` — sets the entry and fires `onFeaturesUpdated`.
- `unregisterFeatures(extensionId)` — removes the entry and fires `onFeaturesUpdated`.
- On every `onFeaturesUpdated`, sends `feature-registry:features-updated` (with the flat list of all current features) to the renderer via `apiSender`.
- Handles the IPC call `feature-registry:getRegisteredFeatures` so the renderer can fetch the current list on startup.

---

## 3 — Renderer store (`registered-features.ts`)

```ts
import { registeredFeatures, onDidChangeRegisteredFeatures } from '/@/stores/registered-features';
```

### `registeredFeatures`

A `Writable<string[]>` Svelte store. Updated by `EventStore` whenever
`feature-registry:features-updated` fires or on `system-ready`.

### `onDidChangeRegisteredFeatures`

An `EventTarget` that dispatches a `CustomEvent<boolean>` per feature name:

- `detail === true` → feature was just added
- `detail === false` → feature was just removed

---

## 4 — Detecting a feature in a Svelte component

### Pattern A — reactive store (simplest, covers initial state)

```svelte
<script lang="ts">
  import { registeredFeatures } from '/@/stores/registered-features';

  // Reactive: true whenever the feature is in the current list
  let featureActive = $derived($registeredFeatures.includes('my-feature-name'));
</script>

{#if featureActive}
  <!-- feature-specific UI -->
{/if}
```

### Pattern B — store subscription + event listener (for side effects)

Use this when detecting a feature should trigger imperative logic (e.g.
toggling visibility of a nav item), following the pattern in
`PreferencesNavigation.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { onDidChangeRegisteredFeatures, registeredFeatures } from '/@/stores/registered-features';

  const FEATURE = 'my-feature-name';

  let featureActive = $state(false);

  function applyFeatureState(enabled: boolean): void {
    featureActive = enabled;
    // ... other imperative updates
  }

  const featureListener = (event: Event): void => {
    applyFeatureState((event as CustomEvent<boolean>).detail);
  };

  onMount(() => {
    // 1. Listen for future changes
    onDidChangeRegisteredFeatures.addEventListener(FEATURE, featureListener);

    // 2. Sync with current state (handles features already active at mount time)
    const unsub = registeredFeatures.subscribe(features => {
      applyFeatureState(features.includes(FEATURE));
    });

    return (): void => {
      onDidChangeRegisteredFeatures.removeEventListener(FEATURE, featureListener);
      unsub();
    };
  });
</script>
```

> **Why both?** The event listener catches changes that happen _after_ mount.
> The store subscription catches the state that was already true _at_ mount.
> Using only the event listener misses features that were registered before
> the component mounted.

---

## 5 — Existing feature names

| Feature string                | Registered by          | Effect in renderer                                              |
| ----------------------------- | ---------------------- | --------------------------------------------------------------- |
| `kubernetes-contexts-manager` | kube-context extension | Hides the built-in Kubernetes section in Preferences navigation |

---

## 6 — End-to-end flow summary

```
extension package.json
  └─ contributes.features: ["my-feature"]
        │
        ▼  (extension activates)
extension-loader.ts
  └─ featureRegistry.registerFeatures(extensionId, ["my-feature"])
        │
        ▼
FeatureRegistry
  ├─ stores in Map
  └─ fires onFeaturesUpdated → apiSender.send("feature-registry:features-updated", [...])
        │
        ▼  (IPC to renderer)
registered-features.ts (EventStore)
  ├─ updates registeredFeatures store
  └─ dispatches CustomEvent on onDidChangeRegisteredFeatures
        │
        ▼
Svelte component
  └─ reacts via $derived / subscribe / addEventListener
```
