<script lang="ts">
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { DropdownMenu } from '@podman-desktop/ui-svelte';
import { onDestroy } from 'svelte';
import type { Unsubscriber } from 'svelte/store';

import type { ContextUI } from '/@/lib/context/context';
import { ContextKeyExpr } from '/@/lib/context/contextKey';
import { context as storeContext } from '/@/stores/context';

import LoadingIcon from './LoadingIcon.svelte';

interface Props {
  title: string;
  icon: IconDefinition | string;
  hidden?: boolean;
  disabledWhen?: string;
  enabled?: boolean;
  onClick?: () => void;
  menu?: boolean;
  detailed?: boolean;
  inProgress?: boolean;
  tooltip?: string;
  contextUI?: ContextUI;
}

let {
  title,
  icon,
  hidden = false,
  disabledWhen = '',
  enabled = true,
  onClick = (): void => {},
  menu = false,
  detailed = false,
  inProgress = false,
  tooltip = '',
  contextUI,
}: Props = $props();

let globalContext: ContextUI;
let contextsUnsubscribe: Unsubscriber;

$effect(() => {
  if (disabledWhen !== '') {
    if (contextUI) {
      globalContext = contextUI;
      computeEnabled();
    } else {
      if (contextsUnsubscribe) {
        contextsUnsubscribe();
      }
      contextsUnsubscribe = storeContext.subscribe(value => {
        globalContext = value;
        computeEnabled();
      });
    }
  }
});

function computeEnabled(): void {
  // Deserialize the `when` property
  const whenDeserialized = ContextKeyExpr.deserialize(disabledWhen);
  // if there is some error when evaluating the when expression, we use the default value enabled = true
  const disabled = whenDeserialized?.evaluate(globalContext) ?? false;
  enabled = !disabled;
}

onDestroy(() => {
  // unsubscribe from the store
  if (contextsUnsubscribe) {
    contextsUnsubscribe();
  }
});

const buttonDetailedClass =
  'text-[var(--pd-action-button-details-text)] bg-[var(--pd-action-button-details-bg)] hover:text-[var(--pd-action-button-details-hover-text)] font-medium rounded-lg text-sm items-center px-3 py-2 text-center';
const buttonDetailedDisabledClass =
  'text-[var(--pd-action-button-details-disabled-text)] bg-[var(--pd-action-button-details-disabled-bg)] font-medium rounded-lg text-sm  items-center px-3 py-2 text-center';
const buttonClass =
  'text-[var(--pd-action-button-text)] hover:bg-[var(--pd-action-button-hover-bg)] hover:text-[var(--pd-action-button-hover-text)] font-medium rounded-full items-center px-2 py-2 text-center';
const buttonDisabledClass =
  'text-[var(--pd-action-button-disabled-text)] font-medium rounded-full items-center px-2 py-2 text-center';

function handleClick(): void {
  if (enabled && !inProgress) {
    onClick();
  }
}

const styleClass = $derived(
  detailed
    ? enabled && !inProgress
      ? buttonDetailedClass
      : buttonDetailedDisabledClass
    : enabled && !inProgress
      ? buttonClass
      : buttonDisabledClass,
);
</script>

<!-- If menu = true, use the menu, otherwise implement the button -->
{#if menu}
  <!-- enabled menu -->
  <DropdownMenu.Item
    title={title}
    tooltip={tooltip}
    icon={icon}
    enabled={enabled}
    hidden={hidden}
    onClick={handleClick} />
{:else}
  <!-- enabled button -->
  <button
    title={title}
    aria-label={title}
    onclick={handleClick}
    class="{styleClass} relative"
    class:disabled={inProgress}
    class:hidden={hidden}
    class:inline-flex={!hidden}
    disabled={!enabled}>
    <LoadingIcon
      icon={icon}
      loading={inProgress}
    />
  </button>
{/if}
