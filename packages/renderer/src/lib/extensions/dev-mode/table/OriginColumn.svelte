<script lang="ts">
import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import { EXTENSION_OUTLINED_CHIP_CLASS } from '/@/lib/extensions/extension-badge-styles';

interface Props {
  object: SelectableExtensionDevelopmentFolderInfoUI;
}

let { object }: Props = $props();

const isCustom = $derived(object.source === 'custom');
const label = $derived(isCustom ? 'Custom' : 'Local');
const colorClass = $derived(
  isCustom
    ? 'border-[var(--pd-button-primary-bg)] text-[var(--pd-button-primary-bg)]'
    : 'border-[var(--pd-badge-sky)] text-[var(--pd-badge-sky)]',
);
</script>

<div class="py-1 min-w-0">
  <span
    class="{EXTENSION_OUTLINED_CHIP_CLASS} {colorClass} bg-transparent cursor-default"
    aria-label={label}
    role="status">
    {label}
  </span>
</div>
