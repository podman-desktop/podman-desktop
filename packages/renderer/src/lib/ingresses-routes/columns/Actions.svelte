<script lang="ts">
import IngressRouteActions from '/@/lib/ingresses-routes/IngressRouteActions.svelte';

import type { Props } from './props';

let { object }: Props = $props();
</script>

<IngressRouteActions ingressRoute={object} />
