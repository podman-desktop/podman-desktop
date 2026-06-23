<script lang="ts">
import { onMount } from 'svelte';
import { router } from 'tinro';

import { lastSubmenuPages } from '/@/stores/breadcrumb';

onMount(() => {
  const value = $lastSubmenuPages['Kubernetes'];
  // Redirect /kubernetes to a sub-page. Using replace mode (second arg = true)
  // so the /kubernetes entry is replaced rather than kept in browser history.
  if (value && value !== '/kubernetes') {
    router.goto(value, true);
  } else {
    router.goto('/kubernetes/dashboard', true);
  }
});
</script>
