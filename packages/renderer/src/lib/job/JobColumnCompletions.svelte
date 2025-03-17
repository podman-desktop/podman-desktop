<script lang="ts">
import type { JobUI } from './JobUI';

interface Props {
  object: JobUI;
}
let { object }: Props = $props();
</script>

<div class="text-[var(--pd-table-body-text)]">
  {object.succeeded} / {object.completions}
</div>
