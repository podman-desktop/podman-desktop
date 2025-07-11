<script lang="ts">
import { faCircleExclamation, faCircleInfo, faExclamationTriangle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import type { NotificationCard } from '/@api/notification';

import Markdown from '../markdown/Markdown.svelte';

export let notification: NotificationCard;

async function removeNotification(id: number): Promise<void> {
  await window.removeNotification(id);
}

const notificationStyleMap = {
  info: {
    borderColor: 'border-[var(--pd-state-info)]',
    iconColor: 'text-[var(--pd-state-info)]',
    icon: faCircleInfo,
  },
  warn: {
    borderColor: 'border-[var(--pd-state-warning)]',
    iconColor: 'text-[var(--pd-state-warning)]',
    icon: faExclamationTriangle,
  },
  error: {
    borderColor: 'border-[var(--pd-state-error)]',
    iconColor: 'text-[var(--pd-state-error)]',
    icon: faCircleExclamation,
  },
};

const notificationStyle = notificationStyleMap[notification.type];
</script>

<div
  class="bg-[var(--pd-content-card-bg)] text-[var(--pd-content-card-text)] p-4 w-full {notificationStyle.borderColor} border-t-[3px]"
  role="region"
  aria-label="id: {notification.id}">
  <div class="flex flex-row space-x-3">
    <div class="flex">
        <Icon size="1.5x" icon={notificationStyle.icon} class={notificationStyle.iconColor} />
    </div>
    <div class="flex flex-col space-y-2 flex-1">
      <div class="flex flex-row items-center justify-between">
        <span class="font-medium" aria-label="Notification title">
          {notification.title}
        </span>
      </div>
      {#if notification.body}
        <span aria-label="Notification description">
          <Markdown markdown={notification.body} />
        </span>
      {/if}
    </div>
    {#if notification.markdownActions}
      <div class="flex mt-2 self-center">
        <Markdown markdown={notification.markdownActions} />
      </div>
    {/if}
    <div class="text-[var(--pd-content-card-carousel-card-header-text)]">
      <button
        class="p-1 hover:bg-[var(--pd-button-close-hover-bg)] hover:bg-opacity-10 transition-all rounded-[4px]"
        on:click={(): Promise<void> => removeNotification(notification.id)}
        aria-label={`Delete notification ${notification.id}`}>
        <Icon icon={faXmark} />
      </button>
    </div>
  </div>
</div>
