<script lang="ts">
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

interface Props {
  error?: string;
}

let { error }: Props = $props();
</script>

{#if error}
  <Tooltip bottom tip={error}>
    <button aria-label="Connection Error: {error}" class="ml-2 flex items-center">
      <Icon icon={faTriangleExclamation} class="text-[var(--pd-state-error)]" size="0.875x" />
    </button>
  </Tooltip>
{/if}
