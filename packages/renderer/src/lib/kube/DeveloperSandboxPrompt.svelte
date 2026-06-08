<script lang="ts">
import { faPlusCircle, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Button, Link } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onDestroy, onMount } from 'svelte';
import { router } from 'tinro';

import type { DeveloperSandboxPromptOverride } from '/@/lib/kube/developer-sandbox-prompt-prototype';
import {
  computeDeveloperSandboxPromptVisible,
  DEVELOPER_SANDBOX_EXTENSION_ID,
  DEVELOPER_SANDBOX_PROVIDER_ID,
  findDeveloperSandboxProvider,
  getDeveloperSandboxResourcesPath,
} from '/@/lib/kube/developer-sandbox-prompt-state';
import { combinedInstalledExtensions } from '/@/stores/all-installed-extensions';
import { activePrototype, currentOverride } from '/@/stores/prototype';
import { providerInfos } from '/@/stores/providers';

import redHatDeveloperLogo from './RedHatDeveloperLogo.png';

const developerSandboxDocsUrl = 'https://podman-desktop.io/docs/openshift/developer-sandbox';

let prototypeOverride = $state<DeveloperSandboxPromptOverride | undefined>(undefined);

let unsubscribeOverride: (() => void) | undefined;

onMount(() => {
  unsubscribeOverride = currentOverride.subscribe(value => {
    prototypeOverride = value as DeveloperSandboxPromptOverride | undefined;
  });
});

onDestroy(() => {
  unsubscribeOverride?.();
});

const hasDeveloperSandboxConnection = $derived(
  $providerInfos.some(
    provider => findDeveloperSandboxProvider([provider]) !== undefined && provider.kubernetesConnections.length > 0,
  ),
);

const isDeveloperSandboxExtensionInstalledLive = $derived(
  $combinedInstalledExtensions.some(extension => extension.id === DEVELOPER_SANDBOX_EXTENSION_ID),
);

const isPrototypeActive = $derived($activePrototype !== undefined);

const useLiveState = $derived(isPrototypeActive && prototypeOverride?.useLiveState === true);

const showPrompt = $derived(
  computeDeveloperSandboxPromptVisible(prototypeOverride, isPrototypeActive, hasDeveloperSandboxConnection),
);

const isDeveloperSandboxExtensionInstalled = $derived(
  useLiveState
    ? isDeveloperSandboxExtensionInstalledLive
    : isPrototypeActive
      ? (prototypeOverride?.extensionInstalled ?? false)
      : isDeveloperSandboxExtensionInstalledLive,
);

async function openDeveloperSandboxDocs(): Promise<void> {
  await window.telemetryTrack('kubernetes.nocontext.developerSandbox.openDocs');
  await window.openExternal(developerSandboxDocsUrl);
}

async function installExtension(): Promise<void> {
  await window.telemetryTrack('kubernetes.nocontext.developerSandbox.installExtension');
  router.goto(`/extensions/details/${DEVELOPER_SANDBOX_EXTENSION_ID}/`);
}

async function connectDeveloperSandbox(): Promise<void> {
  if (!isDeveloperSandboxExtensionInstalled) {
    await installExtension();
    return;
  }

  await window.telemetryTrack('kubernetes.nocontext.developerSandbox.connectFromResources', {
    providerId: DEVELOPER_SANDBOX_PROVIDER_ID,
  });
  router.goto(getDeveloperSandboxResourcesPath());
}
</script>

{#if showPrompt}
  <div
    class="rounded-xl border border-[var(--pd-content-bg)] flex flex-col bg-[var(--pd-content-card-bg)] h-full overflow-hidden text-left"
    role="region"
    aria-label="Developer Sandbox prompt">
    <div class="p-5 flex flex-col flex-1">
    <div class="flex flex-col flex-1">
    <div class="flex justify-left text-[var(--pd-details-empty-icon)] py-2 mb-2">
      <img
        src={redHatDeveloperLogo}
        alt="Red Hat Developer logo"
        class="mx-0 max-h-10 w-auto object-contain object-left" />
    </div>

    <h1 class="text-lg font-semibold mb-4 text-[var(--pd-content-header)]">
      Developer Sandbox
    </h1>

    <p class="text-sm text-[var(--pd-content-text)]">
      A free, managed OpenShift environment with 14 GB RAM and 40 GB storage for 30 days.
      <Link class="inline-flex items-center" on:click={openDeveloperSandboxDocs}>
        Learn more
        <Icon class="ml-1 self-center" icon={faUpRightFromSquare} size="1x" />
      </Link>.
    </p>
    </div>

    <div class="flex justify-center pt-4 mt-auto">
      {#if isDeveloperSandboxExtensionInstalled}
        <Button
          type="primary"
          on:click={connectDeveloperSandbox}
          class="flex items-center"
          aria-label="Connect Developer Sandbox">
          <Icon icon={faPlusCircle} size="1.2x" class="mr-1"/>
          Connect
        </Button>
      {:else}
        <Button
          type="primary"
          on:click={installExtension}
          class="flex items-center"
          aria-label="Install Developer Sandbox extension">
          <Icon icon={faPlusCircle} size="1.2x" class="mr-1"/>
          Install extension
        </Button>
      {/if}
    </div>
    </div>
  </div>
{/if}
