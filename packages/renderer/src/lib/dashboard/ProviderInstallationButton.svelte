<script lang="ts">
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import type { CheckStatus, ProviderInfo } from '@podman-desktop/core-api';
import { Button } from '@podman-desktop/ui-svelte';

export let provider: ProviderInfo;

export let onPreflightChecks: (status: CheckStatus[]) => void;

let installInProgress = false;

let checksStatus: CheckStatus[] = [];

let preflightChecksFailed = false;

async function performInstallation(provider: ProviderInfo): Promise<void> {
  installInProgress = true;
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
    await window.installProvider(provider.internalId);
    // reset checks
    onPreflightChecks([]);
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
    on:click={(): Promise<void> => performInstallation(provider)}>
    Install
  </Button>
{/if}
