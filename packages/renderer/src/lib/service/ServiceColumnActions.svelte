<script lang="ts">
import ServiceActions from './ServiceActions.svelte';
import type { ServiceUI } from './ServiceUI';

interface Props {
  object: ServiceUI;
}
let { object }: Props = $props();
</script>

<ServiceActions service={object} on:update />
