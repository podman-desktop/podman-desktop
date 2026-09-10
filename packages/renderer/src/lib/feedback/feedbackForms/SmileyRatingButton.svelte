<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

interface Props {
  rating: number;
  selectedRating: number;
  icon: IconDefinition;
  ariaLabel: string;
  onSelect: (rating: number) => void;
}

let { rating, selectedRating, icon, ariaLabel, onSelect }: Props = $props();

let selected = $derived(selectedRating === rating);
</script>

<button aria-label={ariaLabel} onclick={(): void => onSelect(rating)}>
  <Icon
    size="1.5x"
    class="cursor-pointer {selected
      ? 'text-(--pd-action-button-primary-text)'
      : 'text-(--pd-button-disabled-text)'}"
    {icon} />
</button>
