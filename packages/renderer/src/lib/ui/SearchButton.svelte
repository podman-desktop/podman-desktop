<script lang="ts">
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

interface Props {
  onclick?: () => void;
}

let { onclick = (): void => {} }: Props = $props();
</script>

<button id="Search button" title="Search" class="absolute top-1/2 left-1/2 text-[color:var(--pd-global-nav-icon)] transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center gap-1" style="-webkit-app-region: none;" {onclick}>
    <Icon icon={faMagnifyingGlass} />Search
</button>