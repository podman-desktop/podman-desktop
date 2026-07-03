<script lang="ts">
import { type SecretInfo } from '@podman-desktop/core-api';

import MonacoEditor from '/@/lib/editor/MonacoEditor.svelte';
import type { SecretInfoUI } from '/@/lib/secrets/SecretInfoUI';

interface Props {
  secret: SecretInfoUI;
}

let { secret }: Props = $props();

let inspect: SecretInfo = $derived(await window.inspectSecret(secret.engineId, secret.Id));
let stringify: string = $derived(JSON.stringify(inspect, null, 2));
</script>

{#if stringify}
  <MonacoEditor content={stringify} language="json" />
{/if}
