<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';

import StatusDotIcon from './StatusDotIcon.svelte';
import { capitalize } from './Util';

interface Props {
  status: string;
  name?: string;
  tooltip?: string;
  number?: number;
}

let { status, name = '', tooltip = '', number = 0 }: Props = $props();

let resolvedTooltip = $derived(
  tooltip !== '' ? tooltip : name !== '' && status !== '' ? `${name}: ${capitalize(status)}` : '',
);
</script>

<Tooltip top tip={resolvedTooltip}>
  <div
    class="mr-0.5 {number ? 'mt-3' : ''}"
    data-testid="status-dot"
    title={resolvedTooltip}>
    <StatusDotIcon {status} />
  </div>
  {#if number}
    <div class="text-sm font-bold text-(--pd-content-text) mr-0.5">{number}</div>
  {/if}
</Tooltip>
