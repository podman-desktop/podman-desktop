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

const hasSearchTerm = $derived(!!searchTerm?.trim());
const filter = $derived(!hasSearchTerm || searchTerm.length > 20 ? 'filter' : `'${searchTerm}'`);
const message = $derived(hasSearchTerm ? 'Not what you expected? Double-check your spelling.' : '');
</script>

<EmptyScreen
  icon={icon}
  title="No {kind} matching {filter} found"
  {message}
  detail="Just want to view all {kind}?">
  <Button on:click={doResetFilter}>Clear filter</Button>
</EmptyScreen>
