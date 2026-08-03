<script lang="ts">
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { Button, CloseButton, Modal } from '@podman-desktop/ui-svelte';

interface Props {
  onskip: () => void;
  onclose: () => void;
}

let { onskip, onclose }: Props = $props();
</script>

<Modal name="Skip setup confirmation" onclose={onclose}>
  <div class="flex flex-col gap-4 p-6">
    <div class="flex items-start justify-between">
      <span class="text-xl font-semibold text-(--pd-content-header)">Skip setup?</span>
      <CloseButton onclick={onclose} />
    </div>

    <p class="text-sm text-(--pd-content-card-text)">
      Taking a moment to configure these settings now ensures a smooth experience. Without them, your environment won't
      be ready to run containers. You can also configure these later in Settings.
    </p>

    <div class="flex items-center gap-4 pt-2">
      <Button type="link" onclick={onskip}>Skip anyway</Button>
      <Button icon={faCirclePlay} onclick={onclose}>Continue setup</Button>
    </div>
  </div>
</Modal>
