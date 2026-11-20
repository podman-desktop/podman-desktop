# Guidelines for Podman Desktop Design

UX rules for dialogs, buttons, and forms. For coding rules, see [CODE-GUIDELINES.md](CODE-GUIDELINES.md).

## Dialog language guide

Native `showMessageBox` dialogs must follow the title and button language patterns below. In-app dialogs built with the `Dialog` component follow the in-app title and button rules.

For button layout and ordering in dialogs, modals, and forms, see [Button layout in dialogs, modals, and forms](#button-layout-in-dialogs-modals-and-forms).
For which actions need a confirmation at all, and which buttons must be styled as danger, see [Destructive actions](#destructive-actions).

### Titles

Native `showMessageBox` titles use `[Verb] [Object]` format. Add `?` for confirmations. No articles ("a", "the").

| Dialog type  | Format                   | Examples                                      |
| ------------ | ------------------------ | --------------------------------------------- |
| Confirmation | `[Verb] [Object]?`       | `Delete Container?`, `Update Podman Desktop?` |
| Action       | `[Verb] [Object]`        | `Push Image`, `Apply Kubernetes YAML`         |
| Error result | `[Verb] [Object] Failed` | `Run Container Failed`, `Pull Image Failed`   |
| Info         | `[Verb] [Object]`        | `View Version`, `Feedback Submitted`          |

### Confirmation questions

Format: `Are you sure you want to [verb] [object]?`

Include the specific resource name: `Are you sure you want to delete container angry_vaughan?`

### Button text

These rules apply to native `showMessageBox` dialog buttons, which follow OS dialog conventions.

- Use action verbs that match the title: `Delete`, `Install`, `Update`, `Prune`
- Never use generic labels: no `Yes`, `No`, `OK`, `Confirm`
- Use `Dismiss` for single-button info/error dialogs
- Use `Cancel` for the cancel/escape action
- Use title case for multi-word buttons: `View Release Notes`, `Copy Link`
- Destructive actions use `variant: 'delete'` for danger styling

### Button labels

In-app `<Button>` components (anywhere outside native `showMessageBox` dialogs, e.g. page actions, modals built with the `Dialog` component) use sentence case instead of title case, matching the rest of the UI.

- Capitalize only the first word and proper nouns: `Manage registries`, `Clear all`, `Use existing image`
- Proper nouns and product/technical terms keep their standard capitalization: `Build from Containerfile`, `Update Podman Desktop`
- Do not title-case every word: avoid `Use Existing Image`, `Manage Registries`

### In-app Dialog titles

Titles for in-app dialogs built with the `Dialog` component use sentence case, matching in-app buttons. Capitalize the first word and proper nouns: `Push image`, `Add registry`, `Edit context`.

### Using `withConfirmation`

Pass an explicit `title` and `variant` via options. For non-delete actions, use `buttonLabel` to set the confirmation button text:

```typescript
withConfirmation(deleteContainer, `delete container ${name}`, {
  title: 'Delete Container?',
  variant: 'delete',
});

withConfirmation(cancelTask, `cancel task ${name}`, {
  title: 'Cancel Task?',
  buttonLabel: 'Cancel',
});
```

### Two-choice dialogs

When a dialog presents two equally valid options (not a cancel/action pair), style both buttons as `type="secondary"` – neither option is subordinate to the other.

- Use a distinct action verb for each option, and make each label say what the click does: `Use existing image` / `Build from Containerfile`
- Use sentence case, not title case: capitalize only the first word and proper nouns (e.g. `Containerfile`, `Podman`) – see [Button labels](#button-labels)
- Order: `Close`/`Dismiss` leftmost, then the less common option, then the more common option
- Use `Close`/`Dismiss` (`type="link"`), not `Cancel`, to back out without choosing – nothing has been committed yet, so there is nothing to cancel
- Use action verbs, not descriptive labels

```svelte
<Button type="link" on:click={onClose}>Close</Button>
<Button type="secondary" on:click={fromExistingImage}>Use existing image</Button>
<Button type="secondary" on:click={fromDockerfile}>Build from Containerfile</Button>
```

Contrast with the cancel/action pattern, where `Cancel` stays `type="link"` and only one button is `type="primary"`:

```svelte
<Button type="link" on:click={cancel}>Cancel</Button>
<Button type="primary" on:click={save}>Save</Button>
```

### Tone

- Professional but conversational
- Direct and clear
- Active voice
- Specific, not generic

## Destructive actions

Every action that deletes, removes, clears, or uninstalls something belongs to one of three tiers. The tier is decided by what the user loses, not if a dialog follows. When an action sits between two tiers, pick the more protective one. The tier sets the button style, if a confirmation is required, and if the user may turn the confirmation off. Clearing a view that refills when reopened (such as a log terminal) loses nothing, so it is not a destructive action and gets a neutral control.

### Tiers

#### 🟪 Mild

Something of little value to the user, or that they can get back by reinstalling or re-adding it.

- Examples: clear all tasks, uninstall an extension, untrack a local extension folder.
- Confirmation: none.
- Call the action directly.

#### 🟧 Destructive

Resources the action cannot undo, but that the user can generally recreate without much effort.

- Examples: delete a container, image, pod, volume or network, bulk delete.
- Confirmation: required by default. For common actions, a preference may let the user turn it off, such as `userConfirmation.bulk` for bulk deletes.
- Actions covered by a preference: use the helper that reads it, such as `withBulkConfirmation()` from `/@/lib/actions/BulkActions`.
- Other actions: `withConfirmation()` from `/@/lib/dialogs/messagebox-utils`.

#### 🟥 Very destructive

Data or configuration they cannot recreate, or that takes other resources with it.

- Examples: Clear / Purge Data, delete a connection or machine, delete the current Kubernetes context.
- Confirmation: required, cannot be turned off.
- Delete actions: `withConfirmation()` from `/@/lib/dialogs/messagebox-utils` with `variant: 'delete'`.
- Other actions (Clear, Purge): `window.showMessageBox` with `type: 'danger'` and the action verb as the button label. `withConfirmation()` cannot do this: `variant: 'delete'` always labels the button `Delete`.

### Button styling

- The control that starts the action uses `type="danger"` in every tier, whether or not a confirmation follows. The dialog does not make the page button less dangerous: `Clear / Purge Data` is danger on the page and in the dialog.
- Exception: icon-only actions in table rows and action columns (`ListItemButtonIcon`, `LoadingIconButton`) keep the neutral icon color at rest and switch to the danger color on hover and on keyboard focus. A column of red trash icons would overfill the page. The icon and its accessible name carry the meaning, the color reinforces it.
- Styling never depends on the confirmation preference. A delete button looks the same no matter if the user turned confirmations off or not.
- There is one danger style. Do not add outlined, lighter, or "soft" danger variants.
- The confirmation dialog's action button is danger too, labeled with the action verb (see [Button text](#button-text)), and focus starts on Cancel (see [Focus management](#focus-management)).
- Any component that can host a destructive action must support the danger style. `Button` does. `DropdownMenu.Item`, `ListItemButtonIcon`, and `LoadingIconButton` do not yet. Add the support in the component rather than styling a single call site.

## Button layout in dialogs, modals, and forms

All dialogs, modals, and forms must adhere to the following guidelines to ensure accessibility, keyboard navigation, and visual coherence.

### ButtonRow component usage

Action rows must use the shared `ButtonRow` component from `@podman-desktop/ui-svelte`, even for a single button.
Custom button layouts are prohibited.

Note: the `Dialog` component is already using `ButtonRow`, so no need to declare it again in the `buttons` snippet.

✅ **Use this pattern:**

```svelte
<script lang="ts">
import { ButtonRow } from '@podman-desktop/ui-svelte';
</script>

<ButtonRow>
  <Button type="link" onclick={onCancel}>Cancel</Button>
  <Button type="primary" onclick={onSave}>Save</Button>
</ButtonRow>
```

🚫 **Instead of:**

```svelte
<div class="flex justify-end gap-2">
  <Button type="link" onclick={onCancel}>Cancel</Button>
  <Button type="primary" onclick={onSave}>Save</Button>
</div>
```

### Form alignment

The `ButtonRow` component is already right-aligned within itself, so any usage must ensure this styling is preserved, including in single-button forms. No centered or full-width standalone buttons.

✅ **Use this pattern:**

```svelte
<form onsubmit={onSubmit}>
  <ButtonRow>
    <Button type="link" onclick={onCancel}>Cancel</Button>
    <Button type="primary">Submit</Button>
  </ButtonRow>
</form>
```

🚫 **Instead of:**

```svelte
<form onsubmit={onSubmit}>
  <ButtonRow>
    <Button type="link" onclick={onCancel}>Cancel</Button>
    <Button type="primary" class="w-full">Submit</Button>
  </ButtonRow>
</form>
```

### Explicit cancel buttons

Every dialog, modal, or form must have a labeled Close/Cancel/Dismiss button that will either cancel the action or close the component, even when an icon-only close button exists. Screen readers and keyboard users rely on focusable, labeled controls.

✅ **Use this pattern:**

```svelte
<Dialog title="Duplicate container?" onclose={onCancel}>
  {#snippet content()}
    <p>Do you want to duplicate this container?</p>
  {/snippet}
  {#snippet buttons()}
    <Button type="link" onclick={onCancel}>Cancel</Button>
    <Button type="primary" onclick={onConfirm}>Continue</Button>
  {/snippet}
</Dialog>
```

🚫 **Instead of:**

```svelte
<Dialog title="Duplicate container?" onclose={onCancel}>
  {#snippet content()}
    <p>Do you want to duplicate this container?</p>
  {/snippet}
  {#snippet buttons()}
    <Button type="primary" onclick={onConfirm}>Continue</Button>
  {/snippet}
</Dialog>
```

### Button sequencing

Cancel/secondary buttons appear first, while primary actions should be positioned last (right in LTR layouts, mirrored for RTL). With three or more buttons, cancel/dismiss must come first (leftmost in LTR), followed by secondary, and ending with the primary (rightmost in LTR).

✅ **Use this pattern:**

```svelte
<ButtonRow>
  <Button type="link" onclick={onCancel}>Cancel</Button>
  <Button type="primary" onclick={onDelete}>Delete</Button>
</ButtonRow>
```

🚫 **Instead of:**

```svelte
<ButtonRow>
  <Button type="primary" onclick={onDelete}>Delete</Button>
  <Button type="link" onclick={onCancel}>Cancel</Button>
</ButtonRow>
```

### DOM/tab order

Visual order must match DOM sequence. Never use CSS `order` property to manipulate visual order. Tab navigation must proceed left-to-right (LTR) through the button row.

✅ **Use this pattern:**

```svelte
<ButtonRow>
  <Button type="link" onclick={onCancel}>Cancel</Button>
  <Button type="primary" onclick={onSave}>Save</Button>
</ButtonRow>
```

🚫 **Instead of:**

```svelte
<ButtonRow>
  <Button type="primary" onclick={onSave} class="order-2">Save</Button>
  <Button type="link" onclick={onCancel} class="order-1">Cancel</Button>
</ButtonRow>
```

### Focus management

Non-destructive dialogs, forms, or modals may focus primary actions on open. Destructive components must default focus to Cancel buttons to prevent accidental data loss or destructive action execution. If there is no Cancel, use `initialFocus="none"` (`ButtonRow`'s default focus) so focus never falls through to the destructive action.

✅ **Use this pattern (destructive action):**

```svelte
<ButtonRow initialFocus="first">
  <Button type="link" onclick={onCancel}>Cancel</Button>
  <Button type="danger" onclick={onDelete}>Delete</Button>
</ButtonRow>
```

For Dialog components, follow the previous instructions by using the `initialButtonFocus` prop.

✅ **Use this pattern (non-destructive action):**

```svelte
<Dialog title="Duplicate container?" onclose={onCancel} initialButtonFocus="last">
  {#snippet content()}
    <p>Do you want to duplicate this container?</p>
  {/snippet}
  {#snippet buttons()}
    <Button type="link" onclick={onCancel}>Cancel</Button>
    <Button type="primary" onclick={onConfirm}>Continue</Button>
  {/snippet}
</Dialog>
```

MessageBox components (using Dialog) handle focus management internally as follows:

- `initialButtonFocus="first"` for type `danger` if there is a cancel/dismiss button, otherwise `initialButtonFocus="none"`
- `initialButtonFocus="last"` for all other cases
