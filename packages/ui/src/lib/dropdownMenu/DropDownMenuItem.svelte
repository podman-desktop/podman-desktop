<script lang="ts">
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import type { Component } from 'svelte';

import Icon from '../icons/Icon.svelte';

interface Props {
  title: string;
  tooltip?: string;
  icon: IconDefinition | Component | string;
  enabled?: boolean;
  hidden?: boolean;
  onClick?: () => void;
}

let { title, tooltip = '', icon, enabled = true, hidden = false, onClick = (): void => {} }: Props = $props();

const enabledClasses =
  'hover:bg-[var(--pd-dropdown-item-hover-bg)] hover:text-[var(--pd-dropdown-item-hover-text)] hover:rounded-md text-[var(--pd-dropdown-item-text)] hover:cursor-pointer';
const disabledClasses = 'text-[var(--pd-dropdown-disabled-item-text)] bg-[var(--pd-dropdown-disabled-item-bg)]';
</script>

{#if !hidden}
  <!-- Use a div + onclick so there's no "blind spots" for when clicking-->
  <div class={`p-2.5 ${enabled ? enabledClasses : disabledClasses}`} role="none" onclick={onClick}>
    <span
      title={tooltip !== '' ? tooltip : title}
      class="group flex items-center no-underline whitespace-nowrap h-4"
      tabindex="-1">
      <Icon class="w-4 text-md" icon={icon} />
      {#if title}<span class="ml-2">{title}</span>{/if}
    </span>
  </div>
{/if}
