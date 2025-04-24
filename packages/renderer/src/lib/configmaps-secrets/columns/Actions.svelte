<script lang="ts">
import ConfigmapSecretActions from '../ConfigMapSecretActions.svelte';
import type { Props } from './props';

let { object }: Props = $props();
</script>

<ConfigmapSecretActions configMapSecret={object} />
