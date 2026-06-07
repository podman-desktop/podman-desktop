<script lang="ts">
import { faUpRightFromSquare, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
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
  kubernetesEmptyCardHeaderClass,
} from '/@/lib/kube/developer-sandbox-prompt-state';
import { combinedInstalledExtensions } from '/@/stores/all-installed-extensions';
import { activePrototype, currentOverride } from '/@/stores/prototype';
import { providerInfos } from '/@/stores/providers';

import redHatDeveloperLogo from './RedHatDeveloperLogo.png';

const developerSandboxUrl = 'https://developers.redhat.com/developer-sandbox';
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

async function startSandboxForFree(): Promise<void> {
  await window.telemetryTrack('kubernetes.nocontext.developerSandbox.startFree');
  await window.openExternal(developerSandboxUrl);
}

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

interface Props {
  class?: string;
}

let { class: className = '' }: Props = $props();
</script>

{#if showPrompt}
  <div
    class="rounded-xl border border-[var(--pd-content-bg)] flex flex-col bg-[var(--pd-content-card-bg)] h-full overflow-hidden text-left {className}"
    role="region"
    aria-label="Developer Sandbox prompt">
    <div
      class="bg-[var(--pd-badge-purple)] text-[var(--pd-badge-dd-extension-text)] rounded-t-xl px-2 text-sm {kubernetesEmptyCardHeaderClass} flex flex-row items-center gap-1.5">
      <Icon icon={faWandMagicSparkles} size="sm" />
      Recommended
    </div>

    <div class="p-5 flex flex-col flex-1">
    <div class="flex flex-col flex-1">
    <div class="flex justify-left text-[var(--pd-details-empty-icon)] py-2 mb-2">
      <img
        src={redHatDeveloperLogo}
        alt="Red Hat Developer logo"
        class="mx-0 max-h-10 w-auto object-contain object-left" />
    </div>

    <h1 class="text-lg font-semibold mb-4 text-[var(--pd-content-header)]">
      Try Red Hat Developer Sandbox
    </h1>

    <p class="text-sm text-[var(--pd-content-text)] mb-4 text-pretty">
      Get a free, managed OpenShift environment with 14 GB RAM and 40 GB storage for 30 days.
      Start working with Kubernetes without setting up a local cluster.
    </p>

    <p class="text-sm text-[var(--pd-content-text)]">
      Learn how to connect from Podman Desktop in the
      <Link class="inline-flex items-center" on:click={openDeveloperSandboxDocs}>
        Developer Sandbox documentation
        <Icon class="ml-1 self-center" icon={faUpRightFromSquare} size="1x" />
      </Link>.
    </p>
    </div>

    <div class="flex flex-col gap-2 pt-4 mt-auto sm:flex-row sm:flex-wrap sm:justify-center">
      <Button
        type="primary"
        class="inline-flex items-center"
        on:click={startSandboxForFree}
        aria-label="Start your sandbox for free">
        Start your sandbox for free
        <Icon class="ml-1 self-center" icon={faUpRightFromSquare} size="1x" />
      </Button>

      {#if isDeveloperSandboxExtensionInstalled}
        <Button type="secondary" on:click={connectDeveloperSandbox} aria-label="Connect Developer Sandbox">
          Connect Developer Sandbox
        </Button>
      {:else}
        <Button type="secondary" on:click={installExtension} aria-label="Install Developer Sandbox extension">
          Install extension
        </Button>
      {/if}
    </div>
    </div>
  </div>
{/if}
