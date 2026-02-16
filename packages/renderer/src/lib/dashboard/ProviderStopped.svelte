<script lang="ts">
import type { ProviderInfo } from '@podman-desktop/core-api';

import ProviderCard from './ProviderCard.svelte';

export let provider: ProviderInfo;
</script>

<ProviderCard provider={provider}></ProviderCard>
