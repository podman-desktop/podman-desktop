<script lang="ts">
import { NavigationPage } from '@desktop-framework/api';
import { Link } from '@podman-desktop/ui-svelte';

import DetailsCell from '/@/lib/details/DetailsCell.svelte';
import DetailsTable from '/@/lib/details/DetailsTable.svelte';
import DetailsTitle from '/@/lib/details/DetailsTitle.svelte';
import { t } from '/@/lib/i18n/translations.svelte';
import { handleNavigation } from '/@/navigation';

import type { VolumeInfoUI } from './VolumeInfoUI';

interface Props {
  volume: VolumeInfoUI;
}

let { volume }: Props = $props();

let createdTime: Date = $derived(new Date(volume.created));

function openContainer(containerID: string): void {
  handleNavigation({
    page: NavigationPage.CONTAINER_LOGS,
    parameters: {
      id: containerID,
    },
  });
}
</script>

<DetailsTable>
  <tr>
    <DetailsTitle>{t('resources.details') ?? 'Details'}</DetailsTitle>
  </tr>
  <tr>
    <DetailsCell>{t('resources.name') ?? 'Name'}</DetailsCell>
    <DetailsCell>{volume.name}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('resources.size') ?? 'Size'}</DetailsCell>
    <DetailsCell>{volume.humanSize}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('resources.age') ?? 'Age'}</DetailsCell>
    <DetailsCell>{volume.age}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('resources.created') ?? 'Created'}</DetailsCell>
    <DetailsCell>{createdTime}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('resources.status') ?? 'Status'}</DetailsCell>
    <DetailsCell>{t(`resources.status.${volume.status.toLowerCase()}`) ?? volume.status.toLowerCase()}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('resources.mount-point') ?? 'Mount Point'}</DetailsCell>
    <DetailsCell>{volume.mountPoint}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('resources.scope') ?? 'Scope'}</DetailsCell>
    <DetailsCell>{volume.scope}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('resources.driver') ?? 'Driver'}</DetailsCell>
    <DetailsCell>{volume.driver}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('resources.engine-id') ?? 'Engine ID'}</DetailsCell>
    <DetailsCell>{volume.engineId}</DetailsCell>
  </tr>
  <tr>
    <DetailsCell>{t('resources.engine-name') ?? 'Engine Name'}</DetailsCell>
    <DetailsCell>{volume.engineName}</DetailsCell>
  </tr>
  {#if volume.containersUsage.length > 0}
    <tr>
      <DetailsTitle>{t('resources.container-usage') ?? 'Container Usage'}</DetailsTitle>
    </tr>
    {#each volume.containersUsage as container (container.id)}
      <tr>
        <DetailsCell>
          <Link on:click={(): void => openContainer(container.id)}
            >{container.names.map(name => (name.startsWith('/') ? name.slice(1) : name)).join(' ')}</Link>
        </DetailsCell>
        <DetailsCell>{container.id}</DetailsCell>
      </tr>
    {/each}
  {/if}
</DetailsTable>
