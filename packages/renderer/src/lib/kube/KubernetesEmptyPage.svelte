<script lang="ts">
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import type { ProviderInfo } from '@podman-desktop/core-api';
import { Button, Link } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import IconImage from '/@/lib/appearance/IconImage.svelte';
import EmbeddableCatalogExtensionList from '/@/lib/extensions/EmbeddableCatalogExtensionList.svelte';
import KubeIcon from '/@/lib/images/KubeIcon.svelte';
import {
  developerSandboxPromptVisible,
  findDeveloperSandboxProvider,
  kubernetesEmptyCardHeaderClass,
} from '/@/lib/kube/developer-sandbox-prompt-state';
import DeveloperSandboxPrompt from '/@/lib/kube/DeveloperSandboxPrompt.svelte';
import Markdown from '/@/lib/markdown/Markdown.svelte';
import { providerInfos } from '/@/stores/providers';

const kubernetesExternalDocs = 'https://podman-desktop.io/docs/kubernetes';

async function createNew(provider: ProviderInfo): Promise<void> {
  await window.telemetryTrack('kubernetes.nocontext.createNew', {
    provider: provider.id,
  });
  router.goto(`/preferences/resources/provider/${provider.internalId}`);
}

async function oninstall(extensionId: string): Promise<void> {
  await window.telemetryTrack('kubernetes.nocontext.installExtension', {
    extension: extensionId,
  });
}

async function ondetails(extensionId: string): Promise<void> {
  await window.telemetryTrack('kubernetes.nocontext.showExtensionDetails', {
    extension: extensionId,
  });
}

const kubernetesProviderConnections = $derived(
  $providerInfos.filter(
    provider => provider.kubernetesProviderConnectionCreation && findDeveloperSandboxProvider([provider]) === undefined,
  ),
);

const developerSandboxGridColSpan = $derived.by(() => {
  const providerCount = kubernetesProviderConnections.length;
  if (providerCount === 0) {
    return 'lg:col-span-3';
  }

  const remainder = providerCount % 3;
  if (remainder === 0) {
    return 'lg:col-span-3';
  }
  if (remainder === 1) {
    return 'lg:col-span-2';
  }
  return 'lg:col-span-1';
});
</script>

<div class="mt-8 flex justify-center overflow-auto">
  <div class="max-w-[800px] flex flex-col text-center space-y-3">
    <div class="flex justify-center text-[var(--pd-details-empty-icon)] py-2">
      <KubeIcon size="80" />
    </div>
    <h1 class="text-xl text-[var(--pd-details-empty-header)]">No Kubernetes cluster</h1>
    <div class="text-[var(--pd-details-empty-sub-header)] text-pretty">
      A Kubernetes cluster is a group of nodes (virtual or physical) that run Kubernetes, a system for automating the deployment and management of containerized applications.
    </div>
    {#if kubernetesProviderConnections.length > 0}
    <div class="text-[var(--pd-details-empty-sub-header)] text-pretty">
      Deploy a Kubernetes cluster of your choice below:
    </div>
    {/if}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 justify-center items-stretch">

      <DeveloperSandboxPrompt class={`${developerSandboxGridColSpan} min-w-0`} />

      {#each kubernetesProviderConnections as provider (provider.id)}
        {@const label = `${provider.kubernetesProviderConnectionCreationButtonTitle ?? 'Create new'}`}
      <div class="rounded-xl border border-[var(--pd-content-bg)] flex flex-col bg-[var(--pd-content-card-bg)] h-full overflow-hidden text-left">

        {#if $developerSandboxPromptVisible}
          <div class={kubernetesEmptyCardHeaderClass} aria-hidden="true"></div>
        {/if}

        <div class="p-5 flex flex-col flex-1">
        <div class="flex flex-col flex-1">
        <div class="flex justify-left text-[var(--pd-details-empty-icon)] py-2 mb-2">
        <IconImage image={provider?.images?.icon} class="mx-0 max-h-10" alt={provider.name}></IconImage>
        </div>
        <h1 class="text-lg font-semibold mb-4 text-[var(--pd-content-header)]">
          {provider.kubernetesProviderConnectionCreationDisplayName ?? provider.name}
        </h1>
    
        <p class="text-sm text-[var(--pd-content-text)]">
        <Markdown markdown={provider.emptyConnectionMarkdownDescription} />
        </p>
        </div>
    
        <div class="flex justify-center pt-4 mt-auto">
        <Button
          type={$developerSandboxPromptVisible ? 'secondary' : 'primary'}
          on:click={(): Promise<void> => createNew(provider)}
          class="flex items-center"
          aria-label={label}
        >
          <Icon icon="{faPlusCircle}" size="1.2x" class="mr-1"/>
          {label}
        </Button>
        </div>
        </div>
      </div>
      {/each}
    </div>
    
    <EmbeddableCatalogExtensionList
      oninstall={oninstall}
      ondetails={ondetails}
      showEmptyScreen={false}
      title="Extensions to help you deploy Kubernetes clusters on your machine or connect remotely to:"
      category="Kubernetes"
      keywords={['provider']}
      showInstalled={false} />

    <div class="text-[var(--pd-details-empty-sub-header)] text-pretty">
     Want to learn more about Kubernetes on Podman Desktop? <Link on:click={(): Promise<void> => window.openExternal(kubernetesExternalDocs)}>Check out our documentation.</Link>
    </div>
  </div>
</div>
