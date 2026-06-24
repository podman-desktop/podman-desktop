<script lang="ts">
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Fa from 'svelte-fa';

import { EXTENSION_OUTLINED_CHIP_CLASS, EXTENSION_OUTLINED_CHIP_UP_TO_DATE_CLASS } from './extension-badge-styles';

interface Props {
  class?: string;
}

let { class: className = '' }: Props = $props();

const label = 'Up to date';
</script>

<span
  class="{EXTENSION_OUTLINED_CHIP_CLASS} {EXTENSION_OUTLINED_CHIP_UP_TO_DATE_CLASS} {className}"
  aria-label={label}
  role="status">
  <Fa icon={faCheck} size="xs" aria-hidden="true" />
  {label}
</span>
