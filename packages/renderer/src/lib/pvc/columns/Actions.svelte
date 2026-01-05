<script lang="ts">
import PVCActions from '/@/lib/pvc/PVCActions.svelte';

import type { Props } from './props';

let { object }: Props = $props();
</script>

<PVCActions pvc={object} />
