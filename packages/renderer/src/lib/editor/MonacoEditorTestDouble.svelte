<script lang="ts">
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher<{ contentChange: string }>();
</script>

<button aria-label="fireContentChange" onclick={():boolean => dispatch('contentChange','content')} ></button>
