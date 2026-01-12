<script lang="ts">
import { onMount } from 'svelte';
import { router } from 'tinro';

import { lastSubmenuPages } from '/@/stores/breadcrumb';

onMount(() => {
  const value = $lastSubmenuPages['Kubernetes'];
  //  Redirect /kubernetes to dashboard if we end up on /kubernetes without a context error
  //  we use router.goto to preserve the navbar remembering the navigation location.
  if (value && value !== '/kubernetes') {
    router.goto(value);
  } else {
    router.goto('/kubernetes/dashboard');
  }
});
</script>
