<script lang="ts">
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Fa from 'svelte-fa';

interface Props {
  onclick: () => void;
  class?: string;
}

let { onclick, class: className }: Props = $props();
</script>

<button
  type="button"
  class="hover:bg-[var(--pd-button-close-hover-bg)] hover:bg-opacity-10 transition-all rounded-[4px] p-1 no-underline cursor-pointer outline-transparent focus:outline-[var(--pd-button-primary-hover-bg)] {className}"
  onclick={onclick}
  title="Close"
  aria-label="Close">
  <Fa icon={faTimes} />
</button>
