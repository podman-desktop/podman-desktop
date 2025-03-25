<script lang="ts">
import { Link } from '@podman-desktop/ui-svelte';

import { IngressRouteUtils } from './ingress-route-utils';
import type { IngressUI } from './IngressUI';
import type { RouteUI } from './RouteUI';

interface Props {
  object: IngressUI | RouteUI;
}
let { object }: Props = $props();

const ingressRouteUtils = new IngressRouteUtils();
</script>

{#each ingressRouteUtils.getHostPaths(object) as hostPath, index (index)}
  <div class="text-[var(--pd-table-body-text)] overflow-hidden text-ellipsis">
    {#if hostPath.url}
      <Link
        aria-label={hostPath.label}
        onclick={async (): Promise<void> => {
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
