<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import { IngressRouteUtils } from './ingress-route-utils';
import type { IngressUI } from './IngressUI';
import type { RouteUI } from './RouteUI';

export let ingressRoute: IngressUI | RouteUI;
export let detailed = false;

const ingressRouteUtils = new IngressRouteUtils();

async function deleteIngressRoute(): Promise<void> {
  ingressRoute.status = 'DELETING';

  if (ingressRouteUtils.isIngress(ingressRoute)) {
    await window.kubernetesDeleteIngress(ingressRoute.name);
  } else {
    await window.kubernetesDeleteRoute(ingressRoute.name);
  }
}
</script>

<ListItemButtonIcon
  title={`Delete ${ingressRouteUtils.isIngress(ingressRoute) ? 'Ingress' : 'Route'}`}
  onClick={(): void =>
    withConfirmation(
      deleteIngressRoute,
      `delete ${ingressRouteUtils.isIngress(ingressRoute) ? 'ingress' : 'route'} ${ingressRoute.name}`,
    )}
  detailed={detailed}
  icon={faTrash} />
