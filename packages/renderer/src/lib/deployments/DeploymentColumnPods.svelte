<script lang="ts">
import type { DeploymentUI } from './DeploymentUI';

interface Props {
  object: DeploymentUI;
}
let { object }: Props = $props();
</script>

<div class="text-[var(--pd-table-body-text)]">
  {object.ready} / {object.replicas}
</div>
