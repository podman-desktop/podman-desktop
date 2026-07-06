<script lang="ts">
import type { SecretInfoUI } from '/@/lib/secrets/SecretInfoUI';

interface Props {
  object: SecretInfoUI;
}

let { object }: Props = $props();
</script>

<span>{object.Name}</span>
