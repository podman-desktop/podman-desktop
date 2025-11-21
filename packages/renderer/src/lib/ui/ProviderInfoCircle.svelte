<script lang="ts">
import { providerColors } from './ProviderInfoCircle';

interface Props {
  type?: 'kubernetes' | 'podman' | 'docker';
}
let { type }: Props = $props();
let color = $derived(providerColors[type ?? 'unknown']);
</script>

<div aria-label="Provider info circle" class="min-w-2 min-h-2 {color} rounded-full"></div>
