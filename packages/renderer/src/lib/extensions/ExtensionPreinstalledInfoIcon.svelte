<script lang="ts">
import { Tooltip } from '@podman-desktop/ui-svelte';
</script>

<Tooltip right tip="Pre-installed with Podman Desktop">
  <span class="inline-flex cursor-help text-[var(--pd-content-text)]" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" stroke-width="1.5" />
      <path
        d="M8 7.25v3.5M8 5.25h.01"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round" />
    </svg>
  </span>
</Tooltip>
