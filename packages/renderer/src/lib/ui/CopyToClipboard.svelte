<script lang="ts">
import { faPaste } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  clipboardData: string;
  title: string;
  class?: string;
}

let { clipboardData, title, class: className = '' }: Props = $props();

async function copyTextToClipboard(): Promise<void> {
  await window.clipboardWriteText(clipboardData);
}
</script>

<div class="float-right">
  <Tooltip bottom tip={t('common.copyToClipboard') ?? 'Copy to Clipboard'}>
    <button
      title={t('common.copyToClipboard') ?? 'Copy To Clipboard'}
      class="ml-5 {className}"
      aria-label={t('common.copyToClipboard') ?? 'Copy To Clipboard'}
      onclick={copyTextToClipboard}>
      <Icon icon={faPaste} />
    </button>
  </Tooltip>
</div>
<div class="mt-1 my-auto text-xs truncate {className}" aria-label={t('common.copyValue', { value: title }) ?? `${title} copy to clipboard`} title={title}>
  {title}
</div>
