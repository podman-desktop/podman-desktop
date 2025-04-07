<script lang="ts">
import ConfigmapSecretActions from './ConfigMapSecretActions.svelte';
import type { ConfigMapSecretUI } from './ConfigMapSecretUI';

interface Props {
  object: ConfigMapSecretUI;
}
let { object }: Props = $props();
</script>

<ConfigmapSecretActions configMapSecret={object} />
