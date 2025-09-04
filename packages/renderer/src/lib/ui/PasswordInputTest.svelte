<script lang="ts">
import PasswordInput from './PasswordInput.svelte';

interface Props {
  onSubmit: (event: Event) => void;
}
const { onSubmit }: Props = $props();
</script>

<form on:submit={onSubmit}>
  <PasswordInput id="foo" password="secret" readonly={false} />
  <button type="submit">Submit</button>
</form>
