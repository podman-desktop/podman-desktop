<script lang="ts">
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Button, Tooltip } from '@podman-desktop/ui-svelte';
import Fa from 'svelte-fa';
import { router } from 'tinro';

import type { ContextUI } from '/@/lib/context/context';
import ProviderUpdateButton from '/@/lib/dashboard/ProviderUpdateButton.svelte';
import type { CheckStatus, ProviderInfo } from '/@api/provider-info';

interface Props {
  provider: ProviderInfo;
  globalContext: ContextUI | undefined;
  providerInstallationInProgress: boolean;
  onCreateNew: (provider: ProviderInfo, displayName: string) => Promise<void>;
  onUpdatePreflightChecks: (checks: CheckStatus[]) => void;
  isOnboardingEnabled: (provider: ProviderInfo, context: ContextUI) => boolean;
  hasAnyConfiguration: (provider: ProviderInfo) => boolean;
  class?: string;
}

let {
  provider,
  globalContext,
  providerInstallationInProgress,
  onCreateNew,
  onUpdatePreflightChecks,
  isOnboardingEnabled,
  hasAnyConfiguration,
  class: className = '',
}: Props = $props();

const isOnboarding = $derived(globalContext && isOnboardingEnabled(provider, globalContext));

const showOnboardingSetup = $derived(
  isOnboarding && (provider.status === 'not-installed' || provider.status === 'unknown'),
);

const providerDisplayName = $derived(
  (provider.containerProviderConnectionCreation
    ? (provider.containerProviderConnectionCreationDisplayName ?? undefined)
    : provider.kubernetesProviderConnectionCreation
      ? provider.kubernetesProviderConnectionCreationDisplayName
      : provider.vmProviderConnectionCreation
        ? provider.vmProviderConnectionCreationDisplayName
        : undefined) ?? provider.name,
);

const buttonTitle = $derived(
  (provider.containerProviderConnectionCreation
    ? (provider.containerProviderConnectionCreationButtonTitle ?? undefined)
    : provider.kubernetesProviderConnectionCreation
      ? provider.kubernetesProviderConnectionCreationButtonTitle
      : provider.vmProviderConnectionCreation
        ? provider.vmProviderConnectionCreationButtonTitle
        : undefined) ?? 'Create new',
);

const showCreateNewButton = $derived(
  provider.containerProviderConnectionCreation ||
    provider.kubernetesProviderConnectionCreation ||
    provider.vmProviderConnectionCreation,
);

const showSetupButton = $derived(
  globalContext && (isOnboardingEnabled(provider, globalContext) || hasAnyConfiguration(provider)),
);

const showUpdateButton = $derived(provider.updateInfo?.version && provider.version !== provider.updateInfo?.version);

function handleCreateNew(): Promise<void> {
  return onCreateNew(provider, providerDisplayName);
}

function handleSetup(): void {
  if (isOnboarding) {
    router.goto(`/preferences/onboarding/${provider.extensionId}`);
  } else {
    router.goto(`/preferences/default/preferences.${provider.extensionId}`);
  }
}
</script>

<div class="text-center mt-10 {className}">
  {#if showOnboardingSetup}
    <Button
      aria-label="Setup {provider.name}"
      title="Setup {provider.name}"
      onclick={handleSetup}>
      Setup ...
    </Button>
  {:else}
    <div class="flex flex-row justify-around flex-wrap gap-2">
      {#if showCreateNewButton}
        <Tooltip bottom tip="Create new {providerDisplayName}">
          <Button
            aria-label="Create new {providerDisplayName}"
            inProgress={providerInstallationInProgress}
            onclick={handleCreateNew}>
            {buttonTitle} ...
          </Button>
        </Tooltip>
      {/if}

      {#if showSetupButton}
        <Button
          aria-label="Setup {provider.name}"
          title="Setup {provider.name}"
          onclick={handleSetup}>
          <Fa size="0.9x" icon={faGear} />
        </Button>
      {/if}

      {#if showUpdateButton}
        <ProviderUpdateButton
          onPreflightChecks={onUpdatePreflightChecks}
          provider={provider} />
      {/if}
    </div>
  {/if}
</div>
