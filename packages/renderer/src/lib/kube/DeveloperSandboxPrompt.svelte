<script lang="ts">
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Link } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import { combinedInstalledExtensions } from '/@/stores/all-installed-extensions';
import { featuredExtensionInfos } from '/@/stores/featuredExtensions';
import { providerInfos } from '/@/stores/providers';

const DEVELOPER_SANDBOX_EXTENSION_ID = 'redhat.redhat-sandbox';
const developerSandboxUrl = 'https://developers.redhat.com/developer-sandbox';
const developerSandboxDocsUrl = 'https://podman-desktop.io/docs/openshift/developer-sandbox';

const developerSandboxExtension = $derived(
  $featuredExtensionInfos.find(extension => extension.id === DEVELOPER_SANDBOX_EXTENSION_ID),
);

const isDeveloperSandboxExtensionInstalled = $derived(
  $combinedInstalledExtensions.some(extension => extension.id === DEVELOPER_SANDBOX_EXTENSION_ID),
);

const hasDeveloperSandboxConnection = $derived(
  $providerInfos.some(
    provider =>
      (provider.id.includes('sandbox') || provider.name.includes('Developer Sandbox')) &&
      provider.kubernetesConnections.length > 0,
  ),
);

const showPrompt = $derived(!hasDeveloperSandboxConnection);

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

async function createSandboxConnection(): Promise<void> {
  const sandboxProvider = $providerInfos.find(
    provider => provider.id.includes('sandbox') || provider.name.includes('Developer Sandbox'),
  );
  if (!sandboxProvider) {
    await installExtension();
    return;
  }

  await window.telemetryTrack('kubernetes.nocontext.developerSandbox.createConnection', {
    provider: sandboxProvider.id,
  });
  router.goto(`/preferences/resources/provider/${sandboxProvider.internalId}`);
}
</script>

{#if showPrompt}
  <div
    class="rounded-xl p-5 text-left bg-[var(--pd-content-card-bg)] border border-[var(--pd-content-card-border-selected)]"
    role="region"
    aria-label="Developer Sandbox prompt">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
      {#if developerSandboxExtension?.icon}
        <img
          src={developerSandboxExtension.icon}
          alt="Developer Sandbox logo"
          class="max-h-12 max-w-12 object-contain" />
      {/if}

      <div class="flex flex-1 flex-col gap-3">
        <div class="flex flex-col gap-1">
          <div class="text-xs font-semibold uppercase tracking-wide text-[var(--pd-badge-purple)]">
            Recommended
          </div>
          <h2 class="text-lg font-semibold text-[var(--pd-content-header)]">
            Try Red Hat Developer Sandbox
          </h2>
          <p class="text-sm text-[var(--pd-content-text)] text-pretty">
            Get a free, managed OpenShift environment with 14 GB RAM and 40 GB storage for 30 days.
            Start working with Kubernetes without setting up a local cluster.
          </p>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            type="primary"
            icon={faExternalLinkAlt}
            on:click={startSandboxForFree}
            aria-label="Start your sandbox for free">
            Start your sandbox for free
          </Button>

          {#if isDeveloperSandboxExtensionInstalled}
            <Button type="secondary" on:click={createSandboxConnection} aria-label="Connect Developer Sandbox">
              Connect Developer Sandbox
            </Button>
          {:else}
            <Button type="secondary" on:click={installExtension} aria-label="Install Developer Sandbox extension">
              Install extension
            </Button>
          {/if}
        </div>

        <div class="text-sm text-[var(--pd-content-text)]">
          Learn how to connect from Podman Desktop in the
          <Link on:click={openDeveloperSandboxDocs}>Developer Sandbox documentation</Link>.
        </div>
      </div>
    </div>
  </div>
{/if}
