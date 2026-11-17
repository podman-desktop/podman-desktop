<script lang="ts">
import type { ContextGeneralState } from '@desktop-framework/api';

import { t } from '/@/lib/i18n/translations.svelte';
import NodeIcon from '/@/lib/images/NodeIcon.svelte';
import KubernetesEmptyScreen from '/@/lib/kube/KubernetesEmptyScreen.svelte';
import { kubernetesCurrentContextState } from '/@/stores/kubernetes-contexts-state';

// If the current context is CONNECTED and we are on this empty screen
// say that you may not have permission to view the nodes on your cluster.
// otherwise just output the standard "Try switching" text.
function getText(state: ContextGeneralState | undefined): string {
  if (state?.reachable) {
    return (
      t('kubernetes.resources.nodes.permission') ?? 'You may not have permission to view the nodes on your cluster'
    );
  }
  return t('kubernetes.resources.switchContext') ?? 'Try switching to a different context or namespace';
}

let text = $derived(getText($kubernetesCurrentContextState));
</script>

<KubernetesEmptyScreen icon={NodeIcon} resources={['nodes']} titleEmpty={t('kubernetes.resources.nodes.empty') ?? 'No nodes'} titleNotPermitted={t('kubernetes.resources.nodes.inaccessible') ?? 'Nodes not accessible'} message={text} />
