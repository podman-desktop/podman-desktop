<script lang="ts">
import { Button } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import SolidKubeIcon from '../images/SolidKubeIcon.svelte';
</script>

<Button on:click={(): void => router.goto('/kube/apply')} title="Apply YAML" icon={SolidKubeIcon}>Apply YAML</Button>
