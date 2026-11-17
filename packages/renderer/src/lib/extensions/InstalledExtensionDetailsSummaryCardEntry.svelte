<script lang="ts">
import type { Snippet } from 'svelte';

import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  label: string;
  value: string;
  // displayed after the value
  children?: Snippet;
}

let { label, value, children }: Props = $props();
</script>

<div class="flex flex-col lg:mb-4 items-start">
  <div class="uppercase text-sm text-[var(--pd-details-card-header)]">{t(`workloads.extensionField.${label}`) ?? label}</div>
  <div class="text-left font-thin text-sm text-[var(--pd-details-card-text)]">{value}{#if children}&nbsp;{@render children()}{/if}</div>
</div>
