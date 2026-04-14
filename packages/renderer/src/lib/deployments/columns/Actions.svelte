<script lang="ts">
import DeploymentActions from '/@/lib/deployments/DeploymentActions.svelte';

import type { Props } from './props';

let { object }: Props = $props();
</script>

<DeploymentActions deployment={object} />
