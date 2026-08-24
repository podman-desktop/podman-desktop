<script lang="ts">
import { faSquare as faOutlineSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import IconImage from '/@/lib/appearance/IconImage.svelte';

interface Props {
  icon?: string | { readonly light: string; readonly dark: string };
  displayName: string;
  description?: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

let { icon, displayName, description = '', checked = $bindable(), onToggle }: Props = $props();

function handleToggle(): void {
  checked = !checked;
  onToggle(checked);
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    handleToggle();
  }
}
</script>

<div
  role="checkbox"
  aria-checked={checked}
  aria-label="{displayName}: {description}"
  tabindex="0"
  class={[
    'flex w-full cursor-pointer items-center gap-4 rounded-lg border px-5 py-4 text-left outline-none transition-colors',
    checked
      ? 'border-(--pd-content-card-border-selected) bg-(--pd-content-card-inset-bg)'
      : 'border-(--pd-content-card-border) bg-(--pd-content-card-inset-bg) opacity-75',
  ]}
  onclick={handleToggle}
  onkeydown={handleKeydown}>
  <Icon
    size="1.33x"
    icon={checked ? faCheckSquare : faOutlineSquare}
    class={checked
      ? 'text-[var(--pd-input-checkbox-checked)]'
      : 'text-[var(--pd-input-checkbox-unchecked)]'} />

  {#if icon}
    <div aria-hidden="true" class="shrink-0">
      <IconImage image={icon} class="h-10 w-10" alt="" />
    </div>
  {/if}

  <div class="min-w-0 flex-1" aria-hidden="true">
    <div class="text-sm font-semibold text-(--pd-content-header)">{displayName}</div>
    {#if description}
      <div class="mt-0.5 text-xs text-(--pd-content-card-text)">{description}</div>
    {/if}
  </div>
</div>
