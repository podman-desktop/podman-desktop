<script lang="ts">
import IngressRouteActions from '../IngressRouteActions.svelte';
import type { Props } from './props';

let { object }: Props = $props();
</script>

<IngressRouteActions ingressRoute={object} />
