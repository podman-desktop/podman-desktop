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
  <div class="pl-2 flex items-center">
    <Tooltip bottom tip={error}>
      <span role='button' tabindex='0'>
        <Icon icon={faTriangleExclamation} class="text-[var(--pd-state-error)]" />
      </span>
    </Tooltip>
  </div>
{/if}
