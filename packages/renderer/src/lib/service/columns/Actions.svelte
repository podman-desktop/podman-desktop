<script lang="ts">
import ServiceActions from '/@/lib/service/ServiceActions.svelte';

import type { Props } from './props';

let { object }: Props = $props();
</script>

<ServiceActions service={object} />
