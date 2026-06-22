<script lang="ts">
import { faCheckCircle, faRotate, faTimesCircle, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import type { CheckStatus } from '@podman-desktop/core-api';
import { Link, Spinner } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

interface Props {
  preflightChecks: CheckStatus[];
  onrun?: () => void;
}

let { preflightChecks, onrun }: Props = $props();

function getStatusConfig(preCheck: CheckStatus): { icon: typeof faCheckCircle; colorClass: string } {
  if (preCheck.successful) {
    return { icon: faCheckCircle, colorClass: 'text-[var(--pd-status-running)]' };
  }
  if (preCheck.severity === 'warning') {
    return { icon: faTriangleExclamation, colorClass: 'text-[var(--pd-state-warning)]' };
  }
  return { icon: faTimesCircle, colorClass: 'text-[var(--pd-status-terminated)]' };
}

async function openLink(url: string): Promise<void> {
  await window.openExternal(url);
}
</script>

<div class="flex flex-col w-full mt-2 rounded-lg bg-[var(--pd-content-card-carousel-card-bg)] overflow-hidden">
  <div class="flex items-center justify-between px-3 py-2 border-b border-[var(--pd-content-divider)]">
    <span class="text-xs font-medium text-[var(--pd-content-card-header-text)]">Requirement checks</span>
    {#if onrun}
      <button
        class="p-1 rounded hover:bg-[var(--pd-content-card-bg)] transition-colors"
        title="Re-run checks"
        aria-label="Re-run checks"
        onclick={onrun}>
        <Icon icon={faRotate} size="xs" />
      </button>
    {/if}
  </div>

  <div class="flex flex-col px-3 py-1">
    {#each preflightChecks as preCheck, index (index)}
      {@const status = preCheck.successful !== undefined ? getStatusConfig(preCheck) : undefined}
      <div class="flex flex-col gap-0.5 py-2 {index < preflightChecks.length - 1 ? 'border-b border-[var(--pd-content-divider)]' : ''}">
        <div class="flex items-center gap-2">
          {#if !status}
            <Spinner size="1em" />
          {:else}
            <Icon icon={status.icon} class={status.colorClass} size="sm" />
          {/if}
          <span aria-label="precheck-title" class="text-sm text-[var(--pd-content-card-text)]">{preCheck.name}</span>
        </div>
        {#if preCheck.description}
          <div class="ml-6 text-xs text-[var(--pd-content-text-sub)] break-words">
            <p aria-label="precheck-description">{preCheck.description}</p>
            {#if preCheck.docLinksDescription}
              <p aria-label="precheck-docLinksDescription" class="mt-0.5">{preCheck.docLinksDescription}</p>
            {/if}
            {#if preCheck.docLinks}
              <div class="mt-0.5 flex items-center gap-2">
                {#each preCheck.docLinks as link, index (index)}
                  <Link aria-label="precheck-link" on:click={async (): Promise<void> => await openLink(link.url)}>{link.title}</Link>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
