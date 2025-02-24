<script lang="ts">
import type { Component } from 'svelte';

import ConfigMapSecretIcon from '/@/lib/images/ConfigMapSecretIcon.svelte';
import CronJobIcon from '/@/lib/images/CronJobIcon.svelte';
import DeploymentIcon from '/@/lib/images/DeploymentIcon.svelte';
import IngressRouteIcon from '/@/lib/images/IngressRouteIcon.svelte';
import JobIcon from '/@/lib/images/JobIcon.svelte';
import KubeIcon from '/@/lib/images/KubeIcon.svelte';
import NodeIcon from '/@/lib/images/NodeIcon.svelte';
import PodIcon from '/@/lib/images/PodIcon.svelte';
import PvcIcon from '/@/lib/images/PVCIcon.svelte';
import ServiceIcon from '/@/lib/images/ServiceIcon.svelte';

interface Props {
  kind: string;
  size?: string;
}
let { kind, size = '1em' }: Props = $props();

let Icon: Component = $derived.by(() => {
  switch (kind) {
    case 'Node':
      return NodeIcon;
    case 'Deployment':
      return DeploymentIcon;
    case 'Pod':
      return PodIcon;
    case 'Service':
      return ServiceIcon;
    case 'Ingress':
      return IngressRouteIcon;
    case 'Route':
      return IngressRouteIcon;
    case 'ConfigMap':
      return ConfigMapSecretIcon;
    case 'Secret':
      return ConfigMapSecretIcon;
    case 'PersistentVolumeClaim':
      return PvcIcon;
    case 'CronJob':
      return CronJobIcon as Component;
    case 'Job':
      return JobIcon as Component;
    default:
      return KubeIcon;
  }
});
</script>

<Icon size={size}/>
