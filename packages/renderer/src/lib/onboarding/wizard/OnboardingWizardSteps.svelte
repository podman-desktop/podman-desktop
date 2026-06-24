<script lang="ts">
import { ONBOARDING_WIZARD_DEFAULT_STEPS, type OnboardingWizardStep } from './OnboardingWizardSteps.constants';

interface Props {
  steps?: OnboardingWizardStep[];
  class?: string;
  markerStyle?: 'default' | 'numbered';
}

let { steps = ONBOARDING_WIZARD_DEFAULT_STEPS, class: className = '', markerStyle = 'default' }: Props = $props();
</script>

<ol class={`space-y-4 pl-1 text-base leading-snug ${className}`}>
  {#each steps as step, index (step.label)}
    <li
      aria-current={step.status === 'active' ? 'step' : undefined}
      class={`flex items-center gap-3 text-(--pd-content-header) ${
        markerStyle === 'numbered'
          ? step.status === 'upcoming'
            ? 'opacity-70'
            : step.status === 'active'
              ? 'font-semibold'
              : ''
          : step.status === 'active'
            ? 'font-semibold'
            : 'opacity-70'
      }`}>
      {#if step.status === 'completed'}
        <span
          class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--pd-button-primary-bg) text-xs font-semibold text-(--pd-button-primary-text)">
          ✓
        </span>
        <span class="whitespace-nowrap">{step.label}</span>
      {:else if markerStyle === 'numbered'}
        <span
          class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-(--pd-content-card-border) text-xs font-semibold text-(--pd-content-card-text)">
          {index + 1}
        </span>
        <span class="whitespace-nowrap">{step.label}</span>
      {:else}
        <span aria-hidden="true" class="inline-flex h-5 w-5 shrink-0"></span>
        <span class="whitespace-nowrap">{step.label}</span>
      {/if}
    </li>
  {/each}
</ol>
