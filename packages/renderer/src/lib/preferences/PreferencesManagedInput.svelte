<script lang="ts">
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import { t } from '/@/lib/i18n/translations.svelte';
</script>

<div class="flex flex-row space-x-1 items-center text-sm">
  <Icon icon={faLock} size="xs"/>
  <span>{t('settings.managedInput') ?? 'Managed by your organization'}</span>
</div>
