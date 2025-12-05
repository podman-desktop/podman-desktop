<script lang="ts">
import { ContainerGroupInfoTypeUI } from '../container/ContainerInfoUI';
import Label from './Label.svelte';
import ProviderInfoCircle from './ProviderInfoCircle.svelte';

type ProviderNameType = 'docker' | 'podman' | 'kubernetes' | undefined;

// provider: name of the provider (e.g. podman, docker, kubernetes)
// context: only used for Kubernetes-like distros
interface Props {
  provider?: string;
  context?: string;
}
let { provider = '', context = '' }: Props = $props();

// providerName: name of the provider in lowercase (e.g. podman, docker, kubernetes)
let providerName: ProviderNameType = $derived(getProviderName(provider));

function getProviderName(providerName: string): ProviderNameType {
  switch (providerName?.toLowerCase()) {
    case ContainerGroupInfoTypeUI.PODMAN:
      return 'podman';
    case ContainerGroupInfoTypeUI.DOCKER:
      return 'docker';
    case 'kubernetes':
      return 'kubernetes';
    default:
      return undefined;
  }
}
</script>

<Label containerClass="w-full" tip={provider === 'Kubernetes' ? context : ''} name={provider} capitalize>
  <ProviderInfoCircle type={providerName} />
</Label>
