<script lang="ts">
import { IngressRouteUtils } from './ingress-route-utils';
import type { IngressUI } from './IngressUI';
import type { RouteUI } from './RouteUI';

interface Props {
  object: IngressUI | RouteUI;
}
let { object }: Props = $props();

const ingressRouteUtils = new IngressRouteUtils();
</script>

{#each ingressRouteUtils.getBackends(object) as backend, index (`${backend}-${index}`)}
  <div class="text-[var(--pd-table-body-text)]">{backend}</div>
{/each}
