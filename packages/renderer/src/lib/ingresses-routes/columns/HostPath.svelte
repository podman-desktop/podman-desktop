<script lang="ts">
import { Link } from '@podman-desktop/ui-svelte';

import { IngressRouteUtils } from '/@/lib/ingresses-routes/ingress-route-utils';

import type { Props } from './props';

let { object }: Props = $props();

const ingressRouteUtils = new IngressRouteUtils();
</script>

{#each ingressRouteUtils.getHostPaths(object) as hostPath, index (index)}
  <div class="text-[var(--pd-table-body-text)] overflow-hidden text-ellipsis">
    {#if hostPath.url}
      <Link
        aria-label={hostPath.label}
        on:click={async (): Promise<void> => {
          if (hostPath.url) {
            await window.openExternal(hostPath.url);
          }
        }}>
        {hostPath.label}
      </Link>
    {:else}
      {hostPath.label}
    {/if}
  </div>
{/each}
