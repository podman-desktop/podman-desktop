<script lang="ts">
import type { Component } from 'svelte';

import ConfigMapSecretIcon from '../images/ConfigMapSecretIcon.svelte';
import CronJobIcon from '../images/CronJobIcon.svelte';
import DeploymentIcon from '../images/DeploymentIcon.svelte';
import IngressRouteIcon from '../images/IngressRouteIcon.svelte';
import JobIcon from '../images/JobIcon.svelte';
import KubeIcon from '../images/KubeIcon.svelte';
import NodeIcon from '../images/NodeIcon.svelte';
import PodIcon from '../images/PodIcon.svelte';
import PvcIcon from '../images/PVCIcon.svelte';
import ServiceIcon from '../images/ServiceIcon.svelte';

interface Props {
  kind: string;
  size?: string;
}
let { kind, size }: Props = $props();

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