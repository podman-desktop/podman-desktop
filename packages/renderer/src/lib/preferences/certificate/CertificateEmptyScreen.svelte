<script lang="ts">
import { EmptyScreen } from '@podman-desktop/ui-svelte';

import CertificateIcon from './CertificateIcon.svelte';
</script>

<EmptyScreen
  icon={CertificateIcon}
  title="No certificates found"
  message="System certificates will be loaded automatically when the application starts." />

