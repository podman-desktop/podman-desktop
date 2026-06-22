<script lang="ts">
import { faList } from '@fortawesome/free-solid-svg-icons';
import { type CheckStatus, NavigationPage, type ProviderInfo } from '@podman-desktop/core-api';
import { Button } from '@podman-desktop/ui-svelte';

import { handleNavigation } from '/@/navigation';

import SystemOverviewPreflightChecks from './SystemOverviewPreflightChecks.svelte';
import { getConnectionStatusConfig, hasStartLifecycle } from './system-overview-utils.svelte';
import SystemOverviewProviderCardBase from './SystemOverviewProviderCardBase.svelte';

interface Props {
  provider: ProviderInfo;
}

let { provider }: Props = $props();

let startInProgress = $state(false);
let checksInProgress = $state(false);
let checksExpanded = $state(false);
let preflightChecks: CheckStatus[] = $state([]);

let isConfigured = $derived(provider.status === 'configured');
let canStart = $derived(isConfigured && hasStartLifecycle(provider));
let statusConfig = $derived(getConnectionStatusConfig(provider.status, provider));

let subtitleText = $derived.by(() => {
  if (provider.status === 'not-installed') {
    return `${provider.name} needs to be set up. Some features might not function optimally.`;
  }
  return 'No container engine (machine) created yet. Create one to run containers and pods.';
});

function toggleChecks(): void {
  if (preflightChecks.length > 0) {
    checksExpanded = !checksExpanded;
  } else {
    runChecks().catch(err => console.error('Error running checks', err));
    checksExpanded = true;
  }
}

async function runChecks(): Promise<void> {
  checksInProgress = true;
  preflightChecks = [];
  let currentCheck: CheckStatus | undefined;
  try {
    await window.runInstallPreflightChecks(provider.internalId, {
      startCheck: (status: CheckStatus): void => {
        currentCheck = status;
        preflightChecks = [...preflightChecks, currentCheck];
      },
      endCheck: (status: CheckStatus): void => {
        if (currentCheck) {
          currentCheck = status;
        }
        preflightChecks = [...preflightChecks.slice(0, -1), currentCheck!];
      },
    });
  } catch (err) {
    console.error(err);
  }
  checksInProgress = false;
}

function handleClick(): void {
  if (canStart) {
    startInProgress = true;
    window
      .startProvider(provider.internalId)
      .then(() => window.telemetryTrack('dashboard.healthCard.provider.started', { providerName: provider.name }))
      .catch((err: unknown) => console.error('Provider failed to start:', err))
      .finally(() => (startInProgress = false));
  } else {
    handleNavigation({
      page: NavigationPage.ONBOARDING,
      parameters: {
        extensionId: provider.extensionId,
      },
    });
  }
}
</script>

<SystemOverviewProviderCardBase {provider}>
  {#snippet subtitle()}
    <div class="text-sm text-[var(--pd-content-text-sub)]">
      {subtitleText}
    </div>
  {/snippet}
  {#snippet actions()}
    {#if provider.installationSupport}
      <Button type="secondary" icon={faList} inProgress={checksInProgress} onclick={toggleChecks}>
        {checksExpanded && preflightChecks.length > 0 ? 'Hide checks' : 'Show checks'}
      </Button>
    {/if}
    <Button type={statusConfig.buttonType} onclick={handleClick} inProgress={startInProgress}>{statusConfig.buttonText}</Button>
  {/snippet}
  {#if provider.installationSupport && checksExpanded && preflightChecks.length > 0}
    <SystemOverviewPreflightChecks {preflightChecks} onrun={runChecks} />
  {/if}
</SystemOverviewProviderCardBase>
