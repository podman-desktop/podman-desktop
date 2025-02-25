<script lang="ts">
import type { KubernetesObject, V1Secret } from '@kubernetes/client-node';
import { StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { onDestroy, onMount } from 'svelte';
import { router } from 'tinro';
import { stringify } from 'yaml';

import { listenResource } from '/@/lib/kube/resource-listen';
import { kubernetesCurrentContextSecrets } from '/@/stores/kubernetes-contexts-state';
import type { IDisposable } from '/@api/disposable';

import Route from '../../Route.svelte';
import MonacoEditor from '../editor/MonacoEditor.svelte';
import SecretIcon from '../images/ConfigMapSecretIcon.svelte';
import KubeEditYAML from '../kube/KubeEditYAML.svelte';
import DetailsPage from '../ui/DetailsPage.svelte';
import StateChange from '../ui/StateChange.svelte';
import { getTabUrl, isTabSelected } from '../ui/Util';
import { ConfigMapSecretUtils } from './configmap-secret-utils';
import ConfigMapSecretActions from './ConfigMapSecretActions.svelte';
import type { ConfigMapSecretUI } from './ConfigMapSecretUI';
import SecretDetailsSummary from './SecretDetailsSummary.svelte';

interface Props {
  name: string;
  namespace: string;
}
let { name, namespace }: Props = $props();

let secret: ConfigMapSecretUI | undefined = $state(undefined);
let detailsPage: DetailsPage | undefined = $state(undefined);
let kubeSecret: V1Secret | undefined = $state(undefined);
let kubeError: string | undefined = $state(undefined);

let listener: IDisposable | undefined;

onMount(async () => {
  const secretUtils = new ConfigMapSecretUtils();
  listener = await listenResource({
    resourceName: 'secrets',
    name,
    namespace,
    listenEvents: false,
    legacyResourceStore: kubernetesCurrentContextSecrets,
    onResourceNotFound: () => {
      if (detailsPage) {
        // the secret has been deleted
        detailsPage.close();
      }
    },
    onResourceUpdated: (resource: KubernetesObject, isExperimental: boolean) => {
      secret = secretUtils.getConfigMapSecretUI(resource);
      if (isExperimental) {
        kubeSecret = resource;
      } else {
        loadDetails().catch((err: unknown) => console.error(`Error getting config map secret ${name} details`, err));
      }
    },
  });
});

onDestroy(() => {
  listener?.dispose();
});

async function loadDetails(): Promise<void> {
  const getKubeSecret = await window.kubernetesReadNamespacedSecret(name, namespace);
  if (getKubeSecret) {
    kubeSecret = getKubeSecret;
  } else {
    kubeError = `Unable to retrieve Kubernetes details for ${name}`;
  }
}
</script>

{#if secret}
  <DetailsPage title={secret.name} subtitle={secret.namespace} bind:this={detailsPage}>
    <StatusIcon slot="icon" icon={SecretIcon} size={24} status={secret.status} />
    <svelte:fragment slot="actions">
      <ConfigMapSecretActions configMapSecret={secret} detailed={true} on:update={(): ConfigMapSecretUI | undefined => (secret = secret)} />
    </svelte:fragment>
    <div slot="detail" class="flex py-2 w-full justify-end text-sm text-[var(--pd-content-text)]">
      <StateChange state={secret.status} />
    </div>
    <svelte:fragment slot="tabs">
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />
      <Tab title="Kube" selected={isTabSelected($router.path, 'kube')} url={getTabUrl($router.path, 'kube')} />
    </svelte:fragment>
    <svelte:fragment slot="content">
      <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
        <SecretDetailsSummary secret={kubeSecret} kubeError={kubeError} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <MonacoEditor content={JSON.stringify(kubeSecret, undefined, 2)} language="json" />
      </Route>
      <Route path="/kube" breadcrumb="Kube" navigationHint="tab">
        <KubeEditYAML content={stringify(kubeSecret)} />
      </Route>
    </svelte:fragment>
  </DetailsPage>
{/if}
