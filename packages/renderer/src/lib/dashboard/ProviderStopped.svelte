<script lang="ts">
import type { ProviderInfo } from '@podman-desktop/core-api';

import ProviderCard from './ProviderCard.svelte';

interface Props {
  provider: ProviderInfo;
}
let { provider }: Props = $props();
</script>

<ProviderCard provider={provider}></ProviderCard>
