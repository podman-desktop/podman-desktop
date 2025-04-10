<script lang="ts">
import IngressRouteActions from './IngressRouteActions.svelte';
import type { IngressUI } from './IngressUI';
import type { RouteUI } from './RouteUI';

interface Props {
  object: IngressUI | RouteUI;
}
let { object }: Props = $props();
</script>

<IngressRouteActions ingressRoute={object} />
