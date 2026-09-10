<script lang="ts">
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

interface Props {
  extension: { icon?: string | { light: string; dark: string }; name: string; state: string };
}
let { extension }: Props = $props();

let fade = $derived(extension.state !== 'started' ? ' brightness-50' : '');
</script>

{#if extension.icon}
  <Icon icon={extension.icon} title={extension.name} class="max-w-8 max-h-8 {fade}" />
{:else}
  <Icon class="h-8 w-8 rounded-full text-[var(--pd-invert-content-info-icon)] {fade}" size="1.6x" icon={faPuzzlePiece} />
{/if}
