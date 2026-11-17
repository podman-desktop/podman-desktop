<script lang="ts">
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import { t } from '/@/lib/i18n/translations.svelte';
import Label from '/@/lib/ui/Label.svelte';
</script>

<Label tip={t('settings.managed.description') ?? 'This setting is managed by your organization.'} right>
  <div class="flex flex-row space-x-1 items-center">
    <Icon icon={faLock} size="xs"/>
    <span>{t('settings.managed') ?? 'Managed'}</span>
  </div>
</Label>
