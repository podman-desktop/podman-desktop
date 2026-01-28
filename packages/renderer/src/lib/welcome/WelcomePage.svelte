<script lang="ts">
import { Button, Checkbox, Link, Tooltip } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import { router } from 'tinro';

import IconImage from '/@/lib/appearance/IconImage.svelte';
import DesktopIcon from '/@/lib/images/DesktopIcon.svelte';
import { onboardingList } from '/@/stores/onboarding';
import { providerInfos } from '/@/stores/providers';

import bgImage from './background.png';
import { WelcomeUtils } from './welcome-utils';

interface Props {
  showWelcome?: boolean;
  showTelemetry?: boolean;
}

let { showWelcome = false, showTelemetry = false }: Props = $props();

const welcomeUtils = new WelcomeUtils();

let telemetry = $state(true);
let telemetryMessages = $derived(await window.getTelemetryMessages());
let podmanDesktopVersion: string = $derived(await window.getPodmanDesktopVersion());
// Get every provider that has a container connections
let providersWithContainerConnections = $derived(
  $providerInfos.filter(provider => provider.containerConnections.length > 0),
);

// Using providerInfos as well as the information we have from onboarding,
// we will by default auto-select as well as add containerEngine to the list as true/false
// so we can make sure that extensions with container engines are listed first
let onboardingProviders = $derived(
  $onboardingList
    .map(provider => {
      // Check if it's in the list, if it is, then it has a container engine
      const hasContainerConnection = providersWithContainerConnections.some(
        connectionProvider => connectionProvider.extensionId === provider.extension,
      );
      return {
        ...provider,
        selected: true,
        containerEngine: hasContainerConnection,
      };
    })
    .sort((a, b) => Number(b.containerEngine) - Number(a.containerEngine)),
); // Sort by containerEngine (true first)

onMount(async () => {
  const ver = await welcomeUtils.getVersion();
  if (!ver) {
    await welcomeUtils.updateVersion('initial');
    showWelcome = true;
  }
  router.goto('/');

  const telemetryPrompt = await welcomeUtils.havePromptedForTelemetry();
  if (!telemetryPrompt) {
    showTelemetry = true;
  }

  if (showWelcome) {
    await window.updateConfigurationValue(`releaseNotesBanner.show`, podmanDesktopVersion);
  }
});

async function closeWelcome(): Promise<void> {
  showWelcome = false;
  if (showTelemetry) {
    await welcomeUtils.setTelemetry(telemetry);
  }
}

// Function to toggle provider selection
function toggleOnboardingSelection(providerName: string): void {
  // Go through providers, find the provider name and toggle the selected value
  // then update providers
  onboardingProviders = onboardingProviders.map(provider => {
    if (provider.name === providerName) {
      provider.selected = !provider.selected;
    }
    return provider;
  });
}

function startOnboardingQueue(): void {
  const selectedProviders = onboardingProviders.filter(provider => provider.selected);
  const extensionIds = selectedProviders.map(provider => provider.extension);
  const queryParams = new URLSearchParams({ ids: extensionIds.join(',') }).toString();
  router.goto(`/global-onboarding?${queryParams}`);
}
</script>

{#if showWelcome}
  <div
    class="flex flex-col flex-auto fixed top-0 left-0 right-0 bottom-0 bg-[var(--pd-content-card-bg)] bg-no-repeat z-50"
    style="background-image: url({bgImage}); background-position: 50% -175%; background-size: 100% 75%">
    <!-- Header -->
    <div class="flex flex-row flex-none backdrop-blur-sm p-6 mt-10">
      <div class="flex flex-auto text-lg font-bold">Get started with Podman Desktop</div>
    </div>

    <!-- Body -->
    <div class="flex flex-col justify-center content-center flex-auto backdrop-blur-sm p-2 overflow-y-auto">
      <div class="flex justify-center p-2"><DesktopIcon /></div>
      <div class="flex justify-center text-lg font-bold p-2">
        <span class="mr-2">🎉</span>Welcome to Podman Desktop v{podmanDesktopVersion} !
      </div>
      <div class="flex flex-row justify-center">
        <div class="bg-[var(--pd-content-card-inset-bg)] px-4 pb-4 pt-2 rounded-sm">
          {#if onboardingProviders && onboardingProviders.length > 0}
            <div class="flex justify-center text-sm text-[var(--pd-content-card-text)] pb-2">
              <div>Choose the extensions to include:</div>
            </div>
            <div aria-label="providerList" class="grid grid-cols-3 gap-3">
              {#each onboardingProviders as onboarding, index (index)}
                <div
                  class="rounded-md bg-[var(--pd-content-card-bg)] flex flex-row justify-between border-2 p-4 {onboarding.selected
                    ? 'border-[var(--pd-content-card-border-selected)]'
                    : 'border-[var(--pd-content-card-border)]'}">
                  <div class="place-items-top flex flex-col flex-1">
                    <div class="flex flex-row place-items-left flex-1">
                      <IconImage image={onboarding.icon} class="max-h-12 h-auto w-auto" alt="{onboarding.name} logo" />
                      <div
                        class="flex flex-1 mx-2 underline decoration-2 decoration-dotted underline-offset-2 cursor-default justify-left text-capitalize">
                        <Tooltip top tip={onboarding.description}>
                          {onboarding.displayName}
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  <Checkbox
                    title="{onboarding.displayName} checkbox"
                    name="{onboarding.displayName} checkbox"
                    bind:checked={onboarding.selected}
                    on:click={(): void => toggleOnboardingSelection(onboarding.name)}
                    class="text-xl" />
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
      <div class="flex justify-center p-2 text-sm items-center">
        Configure these and more under Settings.
      </div>
    </div>

    <!-- Telemetry -->
    {#if showTelemetry}
      <div class="flex flex-col justify-end flex-none p-4">
        <div class="flex flex-row justify-center items-start p-1 text-sm">
          <Checkbox
            id="toggle-telemetry"
            bind:checked={telemetry}
            name="Enable telemetry"
            class="text-lg px-2"
            title="Enable telemetry"><div class="text-base font-medium">Telemetry:</div></Checkbox>
          <div class="w-2/5 text-[var(--pd-content-card-text)]">
            {#if telemetryMessages}
              {telemetryMessages.acceptMessage}
              {#if telemetryMessages?.info}
                <Link
                  on:click={async (): Promise<void> => {
                    await window.openExternal(telemetryMessages.info?.url ?? '');
                  }}>{telemetryMessages?.info.link}</Link>
              {/if}
            {/if}
          </div>
        </div>
        <div class="flex justify-center p-1 text-sm text-[var(--pd-content-card-text)]">
          <div>
            You can always modify this preference later in Settings &gt; Preferences
          </div>
        </div>
      </div>
    {/if}

    <!-- Footer - button bar -->
    <div class="flex justify-end flex-none bg-[var(--pd-content-bg)] p-8">
      <div class="flex flex-row">
        <!-- If Providers have any onboarding elements selected, create a button that says "Start onboarding" rather than Skip -->
        {#if onboardingProviders && onboardingProviders.filter(o => o.selected).length > 0}
          <!-- We will "always" show the "Skip" button
          in-case anything were to happen with the Start onboarding button / sequence not working correctly.
          we do not want the user to not be able to continue. -->
          <Button
            type="secondary"
            on:click={closeWelcome}>Skip</Button>
          <Button
            class="ml-2"
            on:click={async (): Promise<void> => {
              await closeWelcome();
              startOnboardingQueue();
            }}>Start onboarding</Button>
        {:else}
          <Button
            on:click={closeWelcome}>Skip</Button>
        {/if}
      </div>
    </div>
  </div>
{/if}
