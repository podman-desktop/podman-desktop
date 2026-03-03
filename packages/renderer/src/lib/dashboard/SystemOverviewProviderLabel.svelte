<script lang="ts">
interface Props {
  name: string;
  version?: string;
  vmType?: string;
}

let { name, version, vmType }: Props = $props();
</script>

<div class="flex items-center gap-2 text-[var(--pd-content-card-text)]">
  <span class="font-medium">{name}</span>
  {#if vmType ?? version}
    <span class="text-sm text-[var(--pd-content-text-sub)] bg-[var(--pd-content-card-bg)] rounded-md p-1">
      {#if vmType}{vmType}{/if}
      {#if vmType && version} - {/if}
      {#if version}v{version}{/if}
    </span>
  {/if}
</div>
