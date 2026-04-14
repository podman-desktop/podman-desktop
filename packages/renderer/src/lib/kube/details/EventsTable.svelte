<script lang="ts">
import humanizeDuration from 'humanize-duration';
import moment from 'moment';

import type { EventUI } from '/@/lib/events/EventUI';

interface EventWithAge extends EventUI {
  age: string;
}

interface Props {
  events: EventUI[];
}

let { events }: Props = $props();

let sortedEvents: EventWithAge[] = $derived(
  events
    .toSorted((ev1, ev2) => ((ev1.lastTimestamp ?? Date.now()) < (ev2.lastTimestamp ?? Date.now()) ? -1 : 1))
    .map(event => {
      let age = `${humanizeDuration(moment().diff(event.lastTimestamp), { round: true, largest: 1 })}`;
      if ((event.count ?? 0) > 1) {
        age += ` (${event.count}x over ${humanizeDuration(moment().diff(event.firstTimestamp), { round: true, largest: 1 })})`;
      }
      return { ...event, age };
    }),
);
</script>

<tr>
  <td colspan="2">
    <table class="w-full ml-2.5" aria-label="events">
      <tbody>
        <tr>
          <th align="left">Type</th><th align="left">Reason</th><th align="left">Age</th><th align="left">From</th><th align="left">Message</th>
        </tr>
        {#each sortedEvents as event, index (index)}
          <tr>
            <td>{event.type}</td>
            <td>{event.reason}</td>
            <td>{event.age}</td>
            <td>{event.reportingComponent}</td>
            <td>{event.message}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </td>
</tr>
