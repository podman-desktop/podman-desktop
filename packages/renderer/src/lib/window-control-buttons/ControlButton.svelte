<script lang="ts">
import WindowControlLinuxButton from './LinuxControlButton.svelte';
import WindowControlWindowsButton from './WindowsControlButton.svelte';

interface Props {
  name: string;
  action?: () => void;
  platform: string;
}

let { name, action = (): void => {}, platform }: Props = $props();
</script>

{#if platform === 'linux'}
  <WindowControlLinuxButton name={name} action={action} />
{:else if platform === 'win32'}
  <WindowControlWindowsButton name={name} action={action} />
{/if}
