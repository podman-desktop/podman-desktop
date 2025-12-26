<script lang="ts">
import {
  faCheckCircle,
  faExclamationTriangle,
  faQuestionCircle,
  faSync,
  faTimesCircle,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import Fa from 'svelte-fa';

import type { JobCondition } from '/@/lib/job/JobUI';
import Label from '/@/lib/ui/Label.svelte';

import type { Props } from './props';

let { object }: Props = $props();

// Determine both the icon and color based on the job condition
function getConditionAttributes(condition: JobCondition): { name: string; color: string; icon: IconDefinition } {
  const defaults = {
    name: condition,
    color: 'text-[var(--pd-status-unknown)]',
    icon: faQuestionCircle,
  };

  // Condition map for easier lookup
  const conditionMap: { [key: string]: { name: string; color: string; icon: IconDefinition } } = {
    completed: {
      color: 'text-[var(--pd-status-running)]',
      name: 'Completed',
      icon: faCheckCircle,
    },
    failed: {
      color: 'text-[var(--pd-status-dead)]',
      name: 'Failed',
      icon: faTimesCircle,
    },
    running: {
      color: 'text-[var(--pd-status-running)]',
      name: 'Running',
      icon: faSync,
    },
    pending: {
      color: 'text-[var(--pd-status-starting)]',
      name: 'Pending',
      icon: faSync,
    },
    unknown: {
      color: 'text-[var(--pd-status-degraded)]',
      name: 'Unknown',
      icon: faExclamationTriangle,
    },
  };

  // Return the corresponding attributes or default if not found
  return conditionMap[condition] ?? defaults;
}
</script>
    
    <div class="flex flex-row gap-1">
      {#if object.condition}
        <Label tip={object.status} name={getConditionAttributes(object.condition).name}>
          <Fa size="1x" icon={getConditionAttributes(object.condition).icon} class={getConditionAttributes(object.condition).color} />
        </Label>
      {/if}
    </div>