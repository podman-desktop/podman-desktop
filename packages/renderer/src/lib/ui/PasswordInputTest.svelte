<script lang="ts">
import PasswordInput from './PasswordInput.svelte';

export let onSubmit: (event: Event) => void;
</script>

<form on:submit={onSubmit}>
  <PasswordInput id="foo" password="secret" readonly={false} />
  <button type="submit">Submit</button>
</form>
