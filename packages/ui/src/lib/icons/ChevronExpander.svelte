<script lang="ts">
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Icon from './Icon.svelte';

interface Props {
  expanded?: boolean;
  size?: string;
  class?: string;
}

let { expanded = false, size = undefined, class: className = '' }: Props = $props();
</script>

<Icon
  icon={faChevronRight}
  {size}
  class="transition-transform duration-200 motion-reduce:transition-none {expanded ? 'rotate-90' : 'rotate-0'} {className}" />
