<script lang="ts">
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { Input } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import type { ComponentProps } from 'svelte';
import { createEventDispatcher } from 'svelte';

type Props = Omit<ComponentProps<Input>, 'value'> & {
  password?: string;
  passwordHidden?: boolean;
};

let {
  id,
  name,
  password = $bindable(),
  passwordHidden = $bindable(true),
  readonly = false,
  ...restProps
}: Props = $props();

let type: 'text' | 'password' = $derived(passwordHidden ? 'password' : 'text');
const dispatch = createEventDispatcher();

// show/hide if the parent doesn't override
async function onShowHide(event: MouseEvent): Promise<void> {
  // avoid to propagate event
  event.preventDefault();
  if (dispatch('toggleShowHide', { cancelable: true })) {
    passwordHidden = !passwordHidden;
  }
}
</script>

<Input
  id="password-{id}"
  name={name ?? `password-${id}`}
  placeholder="password"
  bind:value={password}
  aria-label="password {id}"
  bind:readonly={readonly}
  type={type}
  {...restProps}
>
  {#snippet right()}
    <button
      class="px-1 cursor-pointer text-[var(--pd-input-field-stroke)] group-hover:text-[var(--pd-input-field-hover-stroke)] group-focus-within:text-[var(--pd-input-field-hover-stroke)]"
      class:hidden={!password || readonly}
      aria-label="show/hide"
      onclick={onShowHide}
      >{#if passwordHidden}
        <Icon icon={faEye} />
      {:else}
        <Icon icon={faEyeSlash} />
      {/if}
    </button>
  {/snippet}
</Input>
