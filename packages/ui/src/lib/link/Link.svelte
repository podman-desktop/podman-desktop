<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { type Component, createEventDispatcher, type Snippet } from 'svelte';

import Icon from '../icons/Icon.svelte';

const dispatch = createEventDispatcher<{ click: undefined }>();

interface Props {
  icon?: IconDefinition | Component | string;
  class?: string;
  children: Snippet;
  onclick?: () => void;
  'aria-label'?: string;
}

let {
  icon = undefined,
  class: classes = '',
  'aria-label': ariaLabel,
  children,
  onclick = (): void => {
    dispatch('click');
  },
}: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_missing_attribute -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<a
  class="text-[var(--pd-link)] hover:bg-[var(--pd-link-hover-bg)] transition-all rounded-[4px] p-0.5 no-underline cursor-pointer {classes}"
  {onclick}
  role="link"
  aria-label={ariaLabel ?? ''}>
  {#if icon}
    <span class="flex flex-row space-x-2">
      <Icon icon={icon}/>
      <span>{@render children?.()}</span>
    </span>
  {:else}
    {@render children?.()}
  {/if}
</a>
