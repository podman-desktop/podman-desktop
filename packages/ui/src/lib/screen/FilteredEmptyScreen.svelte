<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { type Component, createEventDispatcher } from 'svelte';

import Button from '../button/Button.svelte';
import EmptyScreen from './EmptyScreen.svelte';

const dispatch = createEventDispatcher();

const defaultOnResetFilter = (): void => {
  if (dispatch('resetFilter', searchTerm, { cancelable: true })) {
    searchTerm = '';
  }
};
interface Props {
  icon?: IconDefinition | Component | string;
  kind: string;
  searchTerm: string;
  onResetFilter?: () => void;
}

let { icon, kind, searchTerm = $bindable(), onResetFilter = defaultOnResetFilter }: Props = $props();

function doResetFilter(): void {
  // reset only if onResetFilter is provided
  if (onResetFilter !== defaultOnResetFilter) {
    searchTerm = '';
  }
  onResetFilter();
}

let filter = $derived(searchTerm && searchTerm.length > 20 ? 'filter' : `'${searchTerm}'`);
</script>

<EmptyScreen
  icon={icon}
  title="No {kind} matching {filter} found"
  message="Not what you expected? Double-check your spelling."
  detail="Just want to view all of your {kind}?">
  <Button on:click={doResetFilter}>Clear filter</Button>
</EmptyScreen>
