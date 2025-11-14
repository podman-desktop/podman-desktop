<script lang="ts">
import { Button } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import SolidKubeIcon from '../images/SolidKubeIcon.svelte';

let inProgress = false;

async function kubeApply(): Promise<void> {
  router.goto('/kube/apply');
}
</script>

<Button on:click={kubeApply} title="Apply YAML" icon={SolidKubeIcon} inProgress={inProgress}>Apply YAML</Button>
