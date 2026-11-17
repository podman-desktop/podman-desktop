<script lang="ts">
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { Button, EmptyScreen } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import { t } from '/@/lib/i18n/translations.svelte';

function gotoResourcesPage(): void {
  router.goto('/preferences/resources/');
}

function gotoExtensionsPage(): void {
  router.goto('/extensions/');
}
</script>

<EmptyScreen
  title={t('resources.no-container-engine') ?? 'No Container Engine'}
  message={t('resources.ensure-that-you-have-at-least-one-container-engine-configured-and-operational-please-go-to-resources-and-follow-the-provided-guidelines-for-setting-up-a-container-engine') ?? 'Ensure that you have at least one container engine configured and operational. Please go to Resources and follow the provided guidelines for setting up a container engine.'}
  icon={faLayerGroup}>
  <div class="flex gap-2 justify-center">
    <Button type="link" on:click={gotoResourcesPage}>{t('resources.resources') ?? 'Resources'}</Button>
    <Button type="link" on:click={gotoExtensionsPage}>{t('resources.extensions') ?? 'Extensions'}</Button>
  </div>
</EmptyScreen>
