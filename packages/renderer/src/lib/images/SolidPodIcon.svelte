<script lang="ts">
import PodIcon from './PodIcon.svelte';

interface Props {
  size?: string;
}

let { size = '1em' }: Props = $props();
</script>

<PodIcon size={size} solid={true} />
