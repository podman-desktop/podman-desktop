<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements';

import { getExtensionStatusPresentation } from './extension-status';
import StatusDotIcon from './StatusDotIcon.svelte';

interface Props extends HTMLAttributes<HTMLDivElement> {
  status: string;
}

let { status, class: className = '', ...restProps }: Props = $props();

const presentation = $derived(getExtensionStatusPresentation(status));
</script>

<div class="flex min-w-0 max-w-full items-center gap-1.5 {className}" data-testid="extension-status" {...restProps}>
  <span class="inline-flex w-3 shrink-0 items-center justify-center" aria-hidden="true">
    <StatusDotIcon status={presentation.icon} size="12" />
  </span>
  <span class="min-w-0 truncate text-sm {presentation.textClass}">
    {presentation.label}
  </span>
</div>
