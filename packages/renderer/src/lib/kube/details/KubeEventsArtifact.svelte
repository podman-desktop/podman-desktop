<script lang="ts">
import Cell from '/@/lib/details/DetailsCell.svelte';
import Title from '/@/lib/details/DetailsTitle.svelte';
import type { EventUI } from '/@/lib/events/EventUI';
import { t } from '/@/lib/i18n/translations.svelte';
import EventsTable from '/@/lib/kube/details/EventsTable.svelte';

interface Props {
  events: EventUI[];
}

let { events }: Props = $props();
</script>

<tr>
  <Title>{t('workloads.events') ?? 'Events'}</Title>
</tr>
{#if events?.length}
  <EventsTable events={events} />
{:else}
  <tr><Cell>{t('workloads.noEvents') ?? 'No events'}</Cell></tr>
{/if}
