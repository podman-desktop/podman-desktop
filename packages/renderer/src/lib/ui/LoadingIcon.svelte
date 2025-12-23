<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Fa, type IconSize } from 'svelte-fa';

interface Props {
  icon: IconDefinition;
  loadingWidthClass?: string;
  loadingHeightClass?: string;
  loading?: boolean;
  iconSize?: IconSize;
}

<<<<<<< HEAD
let {
  icon,
  loadingWidthClass = 'w-6',
  loadingHeightClass = 'h-6',
  loading = false,
  iconSize = undefined,
}: Props = $props();
=======
let { icon, loadingWidthClass = 'w-6', loadingHeightClass = 'h-6', loading = false, iconSize = undefined }: Props = $props();
>>>>>>> 3d6f8e545dc (refactor: migrated LoadingIcon component to svelte5)
</script>

<div>
  <Fa size={iconSize} icon={icon} />
  <div
    aria-label="spinner"
    class="{loading
      ? ''
      : 'hidden'} {loadingWidthClass} {loadingHeightClass} rounded-full animate-spin -translate-1/2 border border-solid border-[var(--pd-action-button-spinner)] border-t-transparent absolute left-1/2 top-1/2">
  </div>
</div>
