<script lang="ts">
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import type { CheckStatus, ProviderInfo } from '@podman-desktop/core-api';
import { Button } from '@podman-desktop/ui-svelte';

interface Props {
  provider: ProviderInfo;
  onPreflightChecks: (status: CheckStatus[]) => void;
}

let { provider, onPreflightChecks }: Props = $props();

let installInProgress = $state(false);

let checksStatus = $state<CheckStatus[]>([]);

let preflightChecksFailed = $state(false);

let hasWarnings = $state(false);

async function performInstallation(): Promise<void> {
  installInProgress = true;

  if (hasWarnings) {
    await window.installProvider(provider.internalId);
    onPreflightChecks([]);
    hasWarnings = false;
    installInProgress = false;
    return;
  }

  checksStatus = [];
  let checkSuccess = false;
  let currentCheck: CheckStatus;
  try {
    checkSuccess = await window.runInstallPreflightChecks(provider.internalId, {
      endCheck: status => {
        if (currentCheck) {
          currentCheck = status;
        } else {
          return;
        }
        checksStatus.push(currentCheck);
        onPreflightChecks(checksStatus);
      },
      startCheck: status => {
        currentCheck = status;
        onPreflightChecks([...checksStatus, currentCheck]);
      },
    });
  } catch (err) {
    console.error(err);
  }
  if (checkSuccess) {
    if (checksStatus.some(c => c.successful === false && c.severity === 'warning')) {
      hasWarnings = true;
    } else {
      await window.installProvider(provider.internalId);
      onPreflightChecks([]);
    }
  } else {
    preflightChecksFailed = true;
  }

  installInProgress = false;
}
</script>

{#if provider.installationSupport}
  <Button
    inProgress={installInProgress}
    disabled={preflightChecksFailed}
    icon={faRocket}
    onclick={performInstallation}>
    {hasWarnings ? 'Proceed with installation' : 'Install'}
  </Button>
{/if}
