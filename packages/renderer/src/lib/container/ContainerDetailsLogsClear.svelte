<script lang="ts">
import { faEraser, faTrashRestore } from '@fortawesome/free-solid-svg-icons';
import Fa from 'svelte-fa';

const {
  onclear,
}: {
  onclear: () => void;
} = $props();

let revert = $state(false);

export function setRevert(r: boolean): void {
  revert = r;
}
</script>

<div class="absolute top-0 right-2 px-1 z-50 m-1 opacity-50 space-x-1">
  <button title={revert ? 'Restore logs' : 'Clear logs'} onclick={onclear} class="">
    <Fa
      class="cursor-pointer rounded-full bg-[var(--pd-button-disabled)] min-h-8 w-8 p-1.5 hover:bg-[var(--pd-button-primary-hover-bg)]"
      icon={revert ? faTrashRestore : faEraser}
    />
  </button>
</div>
