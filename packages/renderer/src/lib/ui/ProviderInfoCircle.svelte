<script lang="ts">
import { providerColors } from './ProviderInfoCircle';

interface Props {
  type: 'kubernetes' | 'podman' | 'docker' | undefined;
}
let { type }: Props = $props();
let color = $derived(providerColors[type ?? 'unknown']);
</script>

<div aria-label="Provider info circle" class="w-2 h-2 {color} rounded-full"></div>
