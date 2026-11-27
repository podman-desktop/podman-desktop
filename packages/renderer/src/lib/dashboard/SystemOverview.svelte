<script lang="ts">
import { SYSTEM_OVERVIEW_EXPANDED } from '@desktop-framework/api';
import { Tooltip } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import DashboardSection from '/@/lib/dashboard/DashboardSection.svelte';
import SystemOverviewContent from '/@/lib/dashboard/SystemOverviewContent.svelte';
import { systemOverviewInfos } from '/@/stores/dashboard/system-overview.svelte';

import { STATUS_TEXT_CLASS } from './system-overview-utils.svelte';
</script>

{#snippet status(expanded: boolean)}
  {#if !expanded}
    <Tooltip tip={$systemOverviewInfos.text} containerClass="inline-flex items-center">
      {#key $systemOverviewInfos.status.status}
        <Icon class={STATUS_TEXT_CLASS[$systemOverviewInfos.status.status]} icon={$systemOverviewInfos.status.icon} size={$systemOverviewInfos.status.status === 'progressing' ? '1.25em' : 'lg'} />
      {/key}
    </Tooltip>
  {/if}
{/snippet}

<DashboardSection id="System Overview" expandedKey={SYSTEM_OVERVIEW_EXPANDED} {status}>
  <div class="bg-(--pd-content-card-bg) p-2 pt-0 mt-2 rounded-lg">
    <SystemOverviewContent />
  </div>
</DashboardSection>
