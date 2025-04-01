
<script lang="ts">
interface Props {
  status?: string;
  class?: string;
}

let { status, class: className = '' }: Props = $props();
</script>


{#if status === 'starting' || status === 'stopping'}
  <div aria-label="Connection Status Icon" class="max-h-1 rounded-full animate-spin border border-solid border-[var(--pd-action-button-spinner)] border-t-transparent {className}"></div>
{:else if status === 'ready' || status === 'started'}
  <div aria-label="Connection Status Icon" class="h-[6px] w-[6px] absolute top-[0px] right-[-2px] rounded-full bg-[var(--pd-default-text)] border-1 border-[var(--pd-statusbar-bg)] {className}"></div>
<!-- {:else if status === 'stopped'}
  <div class="absolute top-0 left-0 h-full w-full flex flex-col items-center">
    <div aria-label="Connection Status Icon" class="h-full w-[4px] rotate-135 rounded-full bg-[var(--pd-status-stopped)] border-1 border-[var(--pd-statusbar-bg)] {className}"></div>
  </div> -->
<!-- {:else if status === 'Update available'}
  <div aria-label="Connection Status Icon" class="fa-solid fa-circle-up fa-xs absolute top-0 right-[-50%] rounded-full border-2 border-[var(--pd-statusbar-bg)] bg-[var(--pd-statusbar-bg)] {className}"></div> -->
{/if}
