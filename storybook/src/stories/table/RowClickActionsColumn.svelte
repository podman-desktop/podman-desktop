<script lang="ts">
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';
import { fn } from 'storybook/test';

interface Props {
  object: {
    name: string;
  };
}

let { object }: Props = $props();

const deleteFn = fn().mockName('delete');
</script>

<Button
  type="danger"
  icon={faTrash}
  title="Delete {object.name}"
  aria-label="Delete {object.name}"
  onclick={(): void => deleteFn(object.name)} />
