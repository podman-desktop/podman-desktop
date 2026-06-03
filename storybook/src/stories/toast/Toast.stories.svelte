<script context="module" lang="ts">
/* eslint-disable sonarjs/no-use-of-empty-return-value -- {@render} is valid Svelte 5 syntax */
import { faCheckCircle, faCircleExclamation, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { CloseButton, Spinner } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { defineMeta } from '@storybook/addon-svelte-csf';

/**
 * Toast notifications appear in the bottom-right corner of the Podman Desktop window.
 *
 * ## Message toasts
 *
 * Triggered by the main process via the `toast:handler` IPC event (e.g. when a container
 * operation completes). Each variant maps to a distinct set of `--pd-toast-*` CSS variables
 * from the color registry:
 *
 * | Variant | Background              | Text color                 | Progress bar               |
 * |---------|-------------------------|----------------------------|----------------------------|
 * | success | `--pd-toast-success-bg` | `--pd-toast-success-color` | `--pd-toast-success-bar-bg`|
 * | error   | `--pd-toast-error-bg`   | `--pd-toast-error-color`   | `--pd-toast-error-bar-bg`  |
 * | warning | `--pd-toast-warning-bg` | `--pd-toast-warning-color` | `--pd-toast-warning-bar-bg`|
 * | info    | `--pd-toast-info-bg`    | `--pd-toast-info-color`    | `--pd-toast-info-bar-bg`   |
 *
 * ## Task toasts
 *
 * Shown by `ToastTaskNotifications` + `ToastCustomUi` when a background task is created.
 * They use `--pd-modal-bg` as the card background and `--pd-state-*` variables for
 * status icons. Task toasts cycle through four lifecycle states:
 *
 * - **In progress** — spinner while the task runs
 * - **Success** — green check icon on completion
 * - **Failure** — red exclamation icon with an error message
 * - **Canceled** — amber warning icon
 *
 * ## Theme support
 *
 * Use the **Themes** toolbar to switch between `light`, `dark`, `hc-light`, and `hc-dark`
 * and verify that all toast variants update correctly.
 */
// biome-ignore lint/correctness/noUnusedVariables: used in markup
const { Story } = defineMeta({
  title: 'Toast',
  tags: ['autodocs'],
});
</script>

<!-- #region Snippets -->

{#snippet messageToast(type: 'success' | 'error' | 'warning' | 'info', label: string, message: string)}
  <div class="flex flex-col gap-1">
    <span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">{label}</span>
    <div
      style="background: var(--pd-toast-{type}-bg); color: var(--pd-toast-{type}-color);"
      class="relative flex flex-row items-center w-64 min-h-[2rem] rounded-[0.2rem] overflow-hidden text-[0.8rem] select-none shadow-md">
      <div class="flex-1">
        {#if type === 'error' || type === 'warning'}
          <div class="flex flex-row items-start gap-1.5 -ml-0.5 px-3 pt-2 pb-2.5">
            <Icon icon={type === 'error' ? faCircleExclamation : faTriangleExclamation} class="shrink-0 mt-1" />
            <span>{message}</span>
          </div>
        {:else}
          <div class="px-3 pt-2 pb-2.5">{message}</div>
        {/if}
      </div>
      <div class="w-8 self-stretch flex items-center justify-center cursor-pointer opacity-60 text-[1rem]">✕</div>
      <div
        style="background: var(--pd-toast-{type}-bar-bg);"
        class="absolute bottom-0.5 left-0.5 h-[3px] w-3/5 rounded-[2px]">
      </div>
    </div>
  </div>
{/snippet}

{#snippet taskToastInProgress(taskName: string)}
  <div class="flex flex-col gap-1">
    <span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">In progress</span>
    <div
      class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md">
      <div class="flex flex-row gap-1 items-start">
        <div class="mr-1 text-(--pd-state-info)" role="status" aria-label="in-progress">
          <Spinner size="1.5em" />
        </div>
        <span class="text-(--pd-card-text) wrap-break-word max-w-46">{taskName}</span>
      </div>
      <CloseButton class="text-(--pd-modal-text) flex-none self-start" />
    </div>
  </div>
{/snippet}

{#snippet taskToastSuccess(taskName: string)}
  <div class="flex flex-col gap-1">
    <span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Success</span>
    <div
      class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md">
      <div class="flex flex-row gap-1 items-start">
        <div class="mr-1 text-(--pd-state-info)" role="status" aria-label="success">
          <Icon icon={faCheckCircle} class="text-(--pd-state-success) fa-xl" />
        </div>
        <span class="text-(--pd-card-text) wrap-break-word max-w-46">{taskName}</span>
      </div>
      <CloseButton class="text-(--pd-modal-text) flex-none self-start" />
    </div>
  </div>
{/snippet}

{#snippet taskToastFailure(taskName: string, error: string)}
  <div class="flex flex-col gap-1">
    <span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Failure</span>
    <div
      class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md">
      <div class="flex flex-row gap-1 items-start">
        <div class="mr-1 text-(--pd-state-info)" role="status" aria-label="failure">
          <Icon icon={faCircleExclamation} class="text-(--pd-state-error) fa-xl" />
        </div>
        <div class="flex flex-col text-(--pd-card-text) wrap-break-word max-w-46">
          <span>Error {taskName}</span>
          <p class="text-(--pd-content-text)">{error}</p>
        </div>
      </div>
      <CloseButton class="text-(--pd-modal-text) flex-none self-start" />
    </div>
  </div>
{/snippet}

{#snippet taskToastCanceled(taskName: string)}
  <div class="flex flex-col gap-1">
    <span class="text-xs font-medium text-(--pd-content-text) uppercase tracking-wide">Canceled</span>
    <div
      class="flex flex-row gap-2 items-start justify-between max-w-64 max-h-50 rounded border border-(--pd-content-divider) bg-(--pd-modal-bg) p-2 text-base shadow-md">
      <div class="flex flex-row gap-1 items-start">
        <div class="mr-1 text-(--pd-state-info)" role="status" aria-label="canceled">
          <Icon icon={faTriangleExclamation} class="text-(--pd-state-warning) fa-xl" />
        </div>
        <span class="text-(--pd-card-text) wrap-break-word max-w-46">Canceled {taskName}</span>
      </div>
      <CloseButton class="text-(--pd-modal-text) flex-none self-start" />
    </div>
  </div>
{/snippet}

<!-- #endregion -->

<!-- All message types in one view -->
<Story name="Message Types">
  <div class="bg-(--pd-content-bg) p-8">
    <div class="flex flex-col gap-6">
      <p class="text-sm text-(--pd-content-text)">
        Message toasts use colored backgrounds from the <code>--pd-toast-*</code> color registry
        variables. Switch themes to verify all variants update correctly.
      </p>
      <div class="flex flex-wrap gap-6">
        {@render messageToast('success', 'Success', 'Container started successfully')}
        {@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
        {@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
        {@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
      </div>
    </div>
  </div>
</Story>

<!-- Individual message type stories -->
<Story name="Message: Success">
  <div class="bg-(--pd-content-bg) p-8">
    {@render messageToast('success', 'Success', 'Container started successfully')}
  </div>
</Story>

<Story name="Message: Error">
  <div class="bg-(--pd-content-bg) p-8">
    {@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
  </div>
</Story>

<Story name="Message: Warning">
  <div class="bg-(--pd-content-bg) p-8">
    {@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
  </div>
</Story>

<Story name="Message: Info">
  <div class="bg-(--pd-content-bg) p-8">
    {@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
  </div>
</Story>

<!-- All task notification states in one view -->
<Story name="Task Notifications">
  <div class="bg-(--pd-content-bg) p-8">
    <div class="flex flex-col gap-6">
      <p class="text-sm text-(--pd-content-text)">
        Task toasts track long-running operations such as pulling images or starting providers.
        They use <code>--pd-modal-bg</code> as background and <code>--pd-state-*</code> variables
        for the status icons, independent of the message toast palette.
      </p>
      <div class="flex flex-wrap gap-6">
        {@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
        {@render taskToastSuccess('Container started successfully')}
        {@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
        {@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
      </div>
    </div>
  </div>
</Story>

<!-- Individual task state stories -->
<Story name="Task: In Progress">
  <div class="bg-(--pd-content-bg) p-8">
    {@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
  </div>
</Story>

<Story name="Task: Success">
  <div class="bg-(--pd-content-bg) p-8">
    {@render taskToastSuccess('Container started successfully')}
  </div>
</Story>

<Story name="Task: Failure">
  <div class="bg-(--pd-content-bg) p-8">
    {@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
  </div>
</Story>

<Story name="Task: Canceled">
  <div class="bg-(--pd-content-bg) p-8">
    {@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
  </div>
</Story>

<!-- Combined overview -->
<Story name="All Types">
  <div class="bg-(--pd-content-bg) p-8">
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <h3 class="text-sm font-semibold text-(--pd-content-text)">Message toasts</h3>
        <div class="flex flex-wrap gap-4">
          {@render messageToast('success', 'Success', 'Container started successfully')}
          {@render messageToast('error', 'Error', 'Failed to start container: permission denied')}
          {@render messageToast('warning', 'Warning', 'Container exited with non-zero status code')}
          {@render messageToast('info', 'Info', 'Pulling image podman-desktop/ubuntu:latest')}
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <h3 class="text-sm font-semibold text-(--pd-content-text)">Task toasts</h3>
        <div class="flex flex-wrap gap-4">
          {@render taskToastInProgress('Pulling image podman-desktop/ubuntu:latest')}
          {@render taskToastSuccess('Container started successfully')}
          {@render taskToastFailure('Build podman-desktop/myapp', 'Dockerfile parse error on line 12')}
          {@render taskToastCanceled('Pull podman-desktop/ubuntu:latest')}
        </div>
      </div>
    </div>
  </div>
</Story>
