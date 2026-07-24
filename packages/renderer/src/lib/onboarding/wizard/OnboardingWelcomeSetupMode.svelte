<script lang="ts">
import { Checkbox, Dropdown } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';

import { CONTAINER_ENGINES, DEFAULT_SETUP_SELECTION, isContainerEngine } from './OnboardingWelcomeSetupMode.types';

type SetupSelection = typeof DEFAULT_SETUP_SELECTION;
type SetupMode = SetupSelection['setupMode'];
type ContainerEngine = (typeof CONTAINER_ENGINES)[number];

interface Props {
  onSelectionChange: (selection: SetupSelection) => void;
}

const engineOptions = CONTAINER_ENGINES.map(engine => ({ label: engine, value: engine }));
let { onSelectionChange }: Props = $props();

let setupMode: SetupMode = $state(DEFAULT_SETUP_SELECTION.setupMode);
let selectedEngine: ContainerEngine = $state(DEFAULT_SETUP_SELECTION.selectedEngine);
let installKubectl = $state(DEFAULT_SETUP_SELECTION.installKubectl);
let installCompose = $state(DEFAULT_SETUP_SELECTION.installCompose);
let podmanDesktopVersion = $derived(await window.getPodmanDesktopVersion());

function emitSelectionChange(): void {
  onSelectionChange({
    setupMode,
    selectedEngine,
    installKubectl,
    installCompose,
  });
}

function setSetupMode(mode: SetupMode): void {
  setupMode = mode;
  emitSelectionChange();
}

function setSelectedEngine(value: string): void {
  if (isContainerEngine(value)) {
    selectedEngine = value;
    emitSelectionChange();
  }
}

function setInstallKubectl(checked: boolean): void {
  installKubectl = checked;
  emitSelectionChange();
}

function setInstallCompose(checked: boolean): void {
  installCompose = checked;
  emitSelectionChange();
}

onMount(() => {
  emitSelectionChange();
});
</script>

<div class="mx-auto w-full max-w-3xl space-y-6" aria-label="Welcome setup mode selection">
  <div class="space-y-2">
    <h1 class="text-3xl font-semibold text-(--pd-content-header)">Welcome to Podman Desktop v{podmanDesktopVersion}!</h1>
    <p class="text-sm text-(--pd-content-card-text)">
      Setup everything you need for seamless experience with containers and Kubernetes.
    </p>
    <p class="text-sm text-(--pd-content-card-text)">These configuration selections can be changed later in Settings.</p>
  </div>

  <div class="space-y-3">
    <label class="flex cursor-pointer items-start gap-3">
      <input
        type="radio"
        name="setup-mode"
        checked={setupMode === 'recommended'}
        onchange={(): void => setSetupMode('recommended')}
        aria-label="Use recommended setup" />
      <div class="space-y-1">
        <div class="text-sm font-semibold text-(--pd-content-header)">
          Use recommended setup.
          <span class="font-normal">
            Works for most users. This will install podman, create a podman machine and ensure Podman Desktop is
            ready to use.
          </span>
        </div>
      </div>
    </label>

    <label class="flex cursor-pointer items-start gap-3">
      <input
        type="radio"
        name="setup-mode"
        checked={setupMode === 'advanced'}
        onchange={(): void => setSetupMode('advanced')}
        aria-label="Use advanced setup" />
      <div class="space-y-1">
        <div class="text-sm font-semibold text-(--pd-content-header)">
          Use advanced setup.
          <span class="font-normal">Choose your own configurations, container engine and extensions.</span>
        </div>
      </div>
    </label>
  </div>

  {#if setupMode === 'advanced'}
    <div class="space-y-4">
      <div class="flex items-center gap-8">
        <div class="w-32 text-sm font-semibold text-(--pd-content-header)">Container engine</div>
        <div class="w-full max-w-xs">
          <Dropdown
            ariaLabel="Container engine"
            value={selectedEngine}
            onChange={setSelectedEngine}
            options={engineOptions}>
          </Dropdown>
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-sm font-semibold text-(--pd-content-header)">Tools</div>
        <div class="space-y-3">
          <Checkbox bind:checked={installKubectl} title="kubectl" onclick={setInstallKubectl}>
            <div class="space-y-1">
              <div class="text-sm text-(--pd-content-header)">kubectl</div>
              <div class="text-xs text-(--pd-content-card-text)">
                Command-line interface (CLI) tool used to interact with Kubernetes clusters.
              </div>
            </div>
          </Checkbox>
          <Checkbox bind:checked={installCompose} title="compose" onclick={setInstallCompose}>
            <div class="space-y-1">
              <div class="text-sm text-(--pd-content-header)">compose</div>
              <div class="text-xs text-(--pd-content-card-text)">Define and run multi-container applications.</div>
            </div>
          </Checkbox>
        </div>
      </div>
    </div>
  {/if}
</div>
