<script lang="ts">
import DeploymentActions from './DeploymentActions.svelte';
import type { DeploymentUI } from './DeploymentUI';

interface Props {
  object: DeploymentUI;
}
let { object }: Props = $props();
</script>

<DeploymentActions deployment={object} on:update />
