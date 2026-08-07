<script lang="ts">
import type { IConnectionStatus } from '/@/lib/preferences/Util';

interface Props {
  status?: IConnectionStatus;
}
let { status }: Props = $props();

async function showTaskManager(): Promise<void> {
  // call the command show-task-manager'
  await window.executeCommand('show-task-manager');
}
</script>

{#if status?.action && status?.error}
  <button
    aria-label="{status.action} failed"
    class="ml-3 text-[9px] text-[var(--pd-state-error)] underline"
    onclick={showTaskManager}>{status.action} failed</button>
{/if}
