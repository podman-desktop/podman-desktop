<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import { t } from '/@/lib/i18n/translations.svelte';
import ListItemButtonIcon from '/@/lib/ui/ListItemButtonIcon.svelte';

import { IngressRouteUtils } from './ingress-route-utils';
import type { IngressUI } from './IngressUI';
import type { RouteUI } from './RouteUI';

interface Props {
  ingressRoute: IngressUI | RouteUI;
  detailed?: boolean;
}

let { ingressRoute, detailed = false }: Props = $props();

const ingressRouteUtils = new IngressRouteUtils();
let resourceKind = $derived(ingressRouteUtils.isIngress(ingressRoute) ? 'Ingress' : 'Route');

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
  title={t('kubernetes.resources.delete', { kind: resourceKind }) ?? `Delete ${resourceKind}`}
  onClick={(): void =>
    withConfirmation(
      deleteIngressRoute,
      `delete ${ingressRouteUtils.isIngress(ingressRoute) ? 'ingress' : 'route'} ${ingressRoute.name}`,
      { title: t('kubernetes.resources.deleteTitle', { kind: resourceKind }) ?? `Delete ${resourceKind}?`, message: t('kubernetes.resources.deleteMessage', { kind: resourceKind, name: ingressRoute.name }) ?? `Are you sure you want to delete ${ingressRouteUtils.isIngress(ingressRoute) ? 'ingress' : 'route'} ${ingressRoute.name}?`, variant: 'delete' },
    )}
  detailed={detailed}
  icon={faTrash} />
