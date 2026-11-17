<script lang="ts">
import { t } from '/@/lib/i18n/translations.svelte';
import type { IConnectionStatus } from '/@/lib/preferences/Util';

interface Props {
  status?: IConnectionStatus;
}
let { status }: Props = $props();
const failureLabel = $derived(
  status?.action
    ? (t('connection.action.failed', { action: t(`connection.action.${status.action}`) ?? status.action }) ??
        `${status.action} failed`)
    : '',
);

async function showTaskManager(): Promise<void> {
  // call the command show-task-manager'
  await window.executeCommand('show-task-manager');
}
</script>

{#if status?.action && status?.error}
  <button
    aria-label={failureLabel}
    class="ml-3 text-[9px] text-[var(--pd-state-error)] underline"
    onclick={showTaskManager}>{failureLabel}</button>
{/if}
