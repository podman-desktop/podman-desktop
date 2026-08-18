<style>
.bootstrap-color {
  --bs-primary: var(--pd-button-primary-bg);
}
</style>

<script lang="ts">
import { Steps } from 'svelte-steps';

interface Props {
  steps: unknown[];
  current?: number;
}
let { steps, current = 0 }: Props = $props();
</script>

<div class="bootstrap-color" data-testid="step-div">
  <Steps steps={steps} size="1.7rem" line="1px" current={current} clickable={false} />
</div>
