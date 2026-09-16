<script lang="ts">
import KubeIcon from './KubeIcon.svelte';

interface Props {
  size?: string;
}

let { size = '1em' }: Props = $props();
</script>

<KubeIcon size={size} solid={true} />
