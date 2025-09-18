<script lang="ts">
import { Button } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import KubePlayIcon from './KubePlayIcon.svelte';

function runContainerYaml(): void {
  router.goto('/kube/play');
}
</script>

<Button onclick={runContainerYaml} title="Create containers, pods and volumes based on Kubernetes YAML" icon={KubePlayIcon}>
  Podman Kube Play
</Button>
