<script lang="ts">
import { faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';
import humanizeDuration from 'humanize-duration';
import moment from 'moment';

import Dialog from '/@/lib/dialogs/Dialog.svelte';
import { t } from '/@/lib/i18n/translations.svelte';
import type { EventStoreInfo } from '/@/stores/event-store';

interface Props {
  closeCallback: () => void;
  eventStoreInfo: EventStoreInfo;
}

let { closeCallback, eventStoreInfo }: Props = $props();

let fetchInProgress = $state(false);
async function fetch(): Promise<void> {
  fetchInProgress = true;
  try {
    await eventStoreInfo.fetch();
  } finally {
    fetchInProgress = false;
  }
}
</script>

<Dialog title={t('management.details.title', { name: eventStoreInfo.name }) ?? `Details of ${eventStoreInfo.name}`} onclose={closeCallback} initialButtonFocus="first">
  {#snippet content()}
    <div  class="inline-block w-full overflow-hidden overflow-y-auto text-left transition-all">
      <div class="flex flex-col rounded-lg">
        <div class="bg-[var(--pd-card-bg)] text-[var(--pd-card-text)] w-full p-4 mb-4">
          <div class="pb-2 text-lg">{t('management.info') ?? 'Info'}:</div>

          <div class="mx-2 flex flex-row items-center">
            {t('management.size') ?? 'Size'}: <div role="status" aria-label={t('management.size') ?? 'size'}>{eventStoreInfo.size}</div>
            <div class="mx-2">
              <Button class="my-1" inProgress={fetchInProgress} on:click={fetch} icon={faRefresh}
                >{t('management.refresh') ?? 'Refresh'}</Button>
            </div>
          </div>
        </div>

        <!-- Display buffer events-->
        <div class="pb-4">
          <div class="bg-[var(--pd-card-bg)] text-[var(--pd-card-text)] w-full p-4 h-45">
            <div class="pb-2 text-lg">
              {t('management.events.updating') ?? 'Updating events'}:
              {#if eventStoreInfo.bufferEvents.length > 0}
                <Button
                  class="my-1"
                  inProgress={fetchInProgress}
                  title={t('management.events.clear') ?? 'Clear events'}
                  on:click={eventStoreInfo.clearEvents}
                  icon={faTrash}>{t('management.clear') ?? 'Clear'}</Button>
              {/if}
            </div>
            {#if eventStoreInfo.bufferEvents.length > 0}
              {@const reverseOrderedBufferEvents = [...eventStoreInfo.bufferEvents].reverse()}

              <ul class="h-32 overflow-auto list-disc list-inside text-xs" aria-label={t('management.events.buffer') ?? 'buffer-events'}>
                {#each reverseOrderedBufferEvents as bufferEvent, index (index)}
                  <li aria-label={bufferEvent.name}>
                    {#if bufferEvent.skipped}
                      {t('management.events.skipped') ?? 'Skipped event'}
                    {:else}
                      {t('management.events.grab', { count: String(bufferEvent.length) }) ?? `Grab ${bufferEvent.length} items from`}
                    {/if}

                    {t('management.events.name', { name: bufferEvent.name }) ?? `'${bufferEvent.name}' event`}
                    {#if bufferEvent.args?.length > 0}
                      ({bufferEvent.args})
                    {/if}

                    {t('management.events.ago', { duration: humanizeDuration(moment().diff(bufferEvent.date), { round: true, largest: 1, language: t('management.durationLanguage') ?? 'en' }) }) ?? `${humanizeDuration(moment().diff(bufferEvent.date), { round: true, largest: 1 })} ago.`}

                    {#if bufferEvent.humanDuration}
                      {t('management.events.took', { duration: bufferEvent.humanDuration }) ?? `Took ${bufferEvent.humanDuration}.`}
                    {/if}

                    {#if bufferEvent.skipped}
                      {t('management.events.ignoring') ?? '(ignoring)'}
                    {/if}
                  </li>
                {/each}
              </ul>
            {:else}
              <div class="h-32 flex flex-row mx-auto text-xs text-[var(--pd-content-text)] text-center">{t('management.events.empty') ?? 'No buffer events'}</div>
            {/if}
          </div>
        </div>

        <div class="text-xs text-[var(--pd-content-text)] mt-2 text-center">{t('management.events.help') ?? 'Track events that have updated the store'}</div>
      </div>
    </div>
  {/snippet}
  {#snippet buttons()}
      <Button type="primary" aria-label={t('management.close') ?? 'Close'} on:click={closeCallback}>{t('management.close') ?? 'Close'}</Button>
  {/snippet}
</Dialog>
