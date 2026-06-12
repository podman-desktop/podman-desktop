<script lang="ts">
import { Checkbox, Link } from '@podman-desktop/ui-svelte';

import { WelcomeUtils } from '/@/lib/welcome/welcome-utils';

let telemetryEnabled = $state(true);
let telemetryMessages = $derived(await window.getTelemetryMessages());
const welcomeUtils = new WelcomeUtils();

async function persistTelemetryChoice(checked: boolean): Promise<void> {
  telemetryEnabled = checked;
  await welcomeUtils.setTelemetry(checked);
}

function openTelemetryPrivacyLink(): Promise<void> | undefined {
  if (telemetryMessages.privacy) {
    return window.openExternal(telemetryMessages.privacy.url);
  }
}
</script>

<Checkbox
  bind:checked={telemetryEnabled}
  title="Enable telemetry"
  class="items-start"
  onclick={persistTelemetryChoice}>
  <div class="space-y-1">
    <div class="text-md font-medium text-(--pd-content-header)">Telemetry</div>
    <div class="text-xs text-(--pd-content-card-text)">
      {telemetryMessages.acceptMessage}
      {#if telemetryMessages.privacy}
        <span> </span>
        <Link on:click={openTelemetryPrivacyLink}>
          {telemetryMessages.privacy.link}
        </Link>
      {/if}
    </div>
  </div>
</Checkbox>
