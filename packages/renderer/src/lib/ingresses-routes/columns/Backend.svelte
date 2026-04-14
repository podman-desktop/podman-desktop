<script lang="ts">
import { IngressRouteUtils } from '/@/lib/ingresses-routes/ingress-route-utils';

import type { Props } from './props';

let { object }: Props = $props();

const ingressRouteUtils = new IngressRouteUtils();
</script>

{#each ingressRouteUtils.getBackends(object) as backend, index (index)}
  <div class="text-[var(--pd-table-body-text)]">{backend}</div>
{/each}
