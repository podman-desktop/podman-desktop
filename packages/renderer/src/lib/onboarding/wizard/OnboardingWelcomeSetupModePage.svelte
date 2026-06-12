<script lang="ts">
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { Button, Link } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import OnboardingWelcomeSetupMode from './OnboardingWelcomeSetupMode.svelte';
import { DEFAULT_SETUP_SELECTION, type SetupSelection } from './OnboardingWelcomeSetupMode.types';
import OnboardingWelcomeTelemetry from './OnboardingWelcomeTelemetry.svelte';
import OnboardingWizardShell from './OnboardingWizardShell.svelte';
import { ONBOARDING_WIZARD_DEFAULT_STEPS } from './OnboardingWizardSteps.constants';
import OnboardingWizardSteps from './OnboardingWizardSteps.svelte';

let setupSelection: SetupSelection = $state({
  ...DEFAULT_SETUP_SELECTION,
});

function updateSetupSelection(selection: SetupSelection): void {
  setupSelection = selection;
}
</script>

<div class="h-full w-full">
  <OnboardingWizardShell>
    {#snippet leftSidebar()}
      <OnboardingWizardSteps steps={ONBOARDING_WIZARD_DEFAULT_STEPS} markerStyle="numbered" />
    {/snippet}

    {#snippet leftSidebarFooter()}
      <div class="rounded-lg border border-(--pd-content-card-border) bg-(--pd-content-card-inset-bg) p-4">
        <OnboardingWelcomeTelemetry />
      </div>
    {/snippet}

    {#snippet rightContent()}
      <OnboardingWelcomeSetupMode onSelectionChange={updateSetupSelection} />
    {/snippet}

    {#snippet footer()}
      <div class="flex w-full items-center justify-end gap-4">
        <Link>Skip entire setup</Link>
        <Button>
          <span class="inline-flex items-center gap-2">
            <Icon icon={faArrowRightLong} />
            Start setup
            <span class="sr-only">
              Selected setup: {setupSelection.setupMode}, engine: {setupSelection.selectedEngine}, kubectl: {setupSelection.installKubectl
                ? 'enabled'
                : 'disabled'}, compose: {setupSelection.installCompose ? 'enabled' : 'disabled'}
            </span>
          </span>
        </Button>
      </div>
    {/snippet}
  </OnboardingWizardShell>
</div>
