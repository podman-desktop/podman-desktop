<script lang="ts">
import type { WelcomeMessages } from '@podman-desktop/core-api';
import { Button, Checkbox, Tooltip } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onMount } from 'svelte';
import { router } from 'tinro';

import DesktopIcon from '/@/lib/images/DesktopIcon.svelte';
import OnboardingWelcomeTelemetry from '/@/lib/onboarding/OnboardingWelcomeTelemetry.svelte';
import { onboardingList } from '/@/stores/onboarding';
import { providerInfos } from '/@/stores/providers';

import bgImage from './background.png';
import type { OnboardingInfoWithAdditionalInfo } from './welcome-utils';
import { WelcomeUtils } from './welcome-utils';

export let showWelcome = false;

const welcomeUtils = new WelcomeUtils();
let podmanDesktopVersion: string;

let onboardingProviders: OnboardingInfoWithAdditionalInfo[] = [];
let welcomeMessages: WelcomeMessages;

$: onboardingProviders = welcomeUtils.getSortedOnboardingExtensions($onboardingList, $providerInfos);

onMount(async () => {
  const ver = await welcomeUtils.getVersion();
  if (!ver) {
    await welcomeUtils.updateVersion('initial');
    showWelcome = true;
  }
  router.goto('/');
  welcomeMessages = await window.getWelcomeMessages();

  podmanDesktopVersion = await window.getPodmanDesktopVersion();

  if (showWelcome) {
    await window.updateConfigurationValue(`releaseNotesBanner.show`, podmanDesktopVersion);
  }
});

async function closeWelcome(): Promise<void> {
  showWelcome = false;
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
      <div class="flex flex-auto text-lg font-bold">{welcomeMessages?.getStartedMessage}</div>
    </div>

    <!-- Body -->
    <div class="flex flex-col justify-center content-center flex-auto backdrop-blur-sm p-2 overflow-y-auto">
      <div class="flex justify-center p-2"><DesktopIcon /></div>
      <div class="flex justify-center text-lg font-bold p-2">
        <span class="mr-2">🎉</span>{welcomeMessages?.welcomeMessage} v{podmanDesktopVersion} !
      </div>
      {#if onboardingProviders && onboardingProviders.length > 0}
        <div class="flex flex-row justify-center">
          <div class="bg-[var(--pd-content-card-inset-bg)] px-4 pb-4 pt-2 rounded-sm">
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
                      {#if onboarding.icon}
                        <Icon icon={onboarding.icon} class="max-h-12 h-auto w-auto" title="{onboarding.name} logo" />
                      {/if}
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
          </div>
        </div>
        <div class="flex justify-center p-2 text-sm items-center">
          Configure these and more under Settings.
        </div>
      {/if}
    </div>

    <!-- Telemetry -->
    <OnboardingWelcomeTelemetry />

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
