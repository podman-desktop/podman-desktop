<script lang="ts">
import { faRocket } from '@fortawesome/free-solid-svg-icons';

import ListItemButtonIcon from './ListItemButtonIcon.svelte';

interface Props {
  title: string;
}

let { title }: Props = $props();
</script>

<!-- tooltip is constant: a rerender of this component only changes title, as a parent component would -->
<ListItemButtonIcon title={title} tooltip="Save image to a local directory" icon={faRocket} />
