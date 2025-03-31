
<script lang="ts">
interface Props {
  status?: string;
  class?: string;
}

let { status, class: className = '' }: Props = $props();

const faRegularIconStatus: string[] = ['ready', 'started', 'stopped', 'error', 'unknown', 'Update available'];
</script>

{#if status === 'starting' || status === 'stopping'}
  <div aria-label="Connection Status Icon" class="max-h-3 rounded-full animate-spin border border-solid border-[var(--pd-action-button-spinner)] border-t-transparent {className}"></div>
{:else}
  <div aria-label="Connection Status Icon" class="max-h-3 {className}"
    class:fa-regular={faRegularIconStatus.includes(status)}
    class:fa={status === 'not-installed'}
    class:fa-circle-check={status === 'ready' || status === 'started'}
    class:fa-circle-dot={status === 'stopped'}
    class:fa-circle-xmark={status === 'error'}
    class:fa-exclamation-triangle={status === 'not-installed'}
    class:fa-circle-question={status === 'unknown'}
    class:fa-circle-up={status === 'Update available'}
    >
  </div>
{/if}
