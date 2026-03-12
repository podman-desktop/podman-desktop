<script lang="ts">
import Label from '/@/lib/ui/Label.svelte';

interface Props {
  name: string;
  version?: string;
  vmType?: string;
}

let { name, version, vmType }: Props = $props();
</script>

<div
  class="flex items-center gap-2 text-[var(--pd-content-card-text)] [--pd-label-bg:var(--pd-content-card-bg)] [--pd-label-text:var(--pd-content-text-sub)]">
  <span class="font-medium">{name}</span>
  {#if vmType ?? version}
    <Label name={[vmType, version ? `v${version}` : undefined].filter(Boolean).join(' - ')} />
  {/if}
</div>
