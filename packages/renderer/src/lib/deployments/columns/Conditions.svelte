<script lang="ts">
import {
  faArrowDown,
  faArrowUp,
  faCheckCircle,
  faExclamationTriangle,
  faQuestionCircle,
  faSync,
  faTimesCircle,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import type { DeploymentCondition } from '/@/lib/deployments/DeploymentUI';
import Label from '/@/lib/ui/Label.svelte';

import type { Props } from './props';

let { object }: Props = $props();

// Determine both the icon and color based on the deployment condition
function getConditionAttributes(condition: DeploymentCondition): { name: string; color: string; icon: IconDefinition } {
  const defaults = {
    name: condition.type,
    color: 'text-[var(--pd-status-unknown)]',
    icon: faQuestionCircle,
  };

  // Condition map for easier lookup
  const conditionMap: { [key: string]: { name: string; color: string; icon: IconDefinition } } = {
    'Available:MinimumReplicasAvailable': {
      color: 'text-[var(--pd-status-running)]',
      name: 'Available',
      icon: faCheckCircle,
    },
    'Available:MinimumReplicasUnavailable': {
      color: 'text-[var(--pd-status-degraded)]',
      name: 'Unavailable',
      icon: faTimesCircle,
    },
    'Progressing:ReplicaSetUpdated': {
      color: 'text-[var(--pd-status-updated)]',
      name: 'Updated',
      icon: faSync,
    },
    'Progressing:NewReplicaSetCreated': {
      color: 'text-[var(--pd-status-updated)]',
      name: 'New Replica Set',
      icon: faSync,
    },
    'Progressing:NewReplicaSetAvailable': {
      color: 'text-[var(--pd-status-running)]',
      name: 'Progressed',
      icon: faSync,
    },
    'Progressing:ReplicaSetScaledUp': {
      color: 'text-[var(--pd-status-updated)]',
      name: 'Scaled Up',
      icon: faArrowUp,
    },
    'Progressing:ReplicaSetScaledDown': {
      color: 'text-[var(--pd-status-updated)]',
      name: 'Scaled Down',
      icon: faArrowDown,
    },
    'Progressing:ProgressDeadlineExceeded': {
      color: 'text-[var(--pd-status-dead)]',
      name: 'Deadline Exceeded',
      icon: faTimesCircle,
    },
    'ReplicaFailure:ReplicaFailure': {
      color: 'text-[var(--pd-status-dead)]',
      name: 'Replica Failure',
      icon: faExclamationTriangle,
    },
  };

  // Construct the key from type and reason
  const key = `${condition.type}:${condition.reason}`;

  // Return the corresponding attributes or default if not found
  return conditionMap[key] ?? defaults;
}
</script>

<div class="flex flex-row gap-1">
  {#each object.conditions as condition, index (index)}
    <Label tip={condition.message} name={getConditionAttributes(condition).name}>
      <Icon size="1x" icon={getConditionAttributes(condition).icon} class={getConditionAttributes(condition).color} />
    </Label>
  {/each}
</div>
