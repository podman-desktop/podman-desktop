<script lang="ts">
import humanizeDuration from 'humanize-duration';
import moment from 'moment';
import type { HTMLAttributes } from 'svelte/elements';

import { t } from '/@/lib/i18n/translations.svelte';

interface Props extends HTMLAttributes<HTMLTableRowElement> {
  conditions: {
    type: string;
    status: string;
    lastTransitionTime?: Date;
    reason?: string;
    message?: string;
  }[];
}

let { conditions, ...restProps }: Props = $props();
</script>

<tr {...restProps}>
  <td colspan="2">
    <table class="w-full ml-2.5">
      <tbody>
        <tr>
          <th align="left">{t('workloads.type') ?? 'Type'}</th><th align="left">{t('workloads.status') ?? 'Status'}</th><th align="left">{t('workloads.updated') ?? 'Updated'}</th><th align="left">{t('workloads.reason') ?? 'Reason'}</th><th align="left">{t('workloads.message') ?? 'Message'}</th>
        </tr>
        {#each conditions as condition, index (index)}
          <tr>
            <td>{condition.type}</td>
            <td>{condition.status}</td>
            <td>{humanizeDuration(moment().diff(condition.lastTransitionTime), { round: true, largest: 1 })}</td>
            <td>{condition.reason}</td>
            <td>{condition.message}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </td>
</tr>
