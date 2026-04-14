<script lang="ts">
import SettingsPage from '/@/lib/preferences/SettingsPage.svelte';

import PreferencesDockerCompatibilityContributions from './PreferencesDockerCompatibilityContributions.svelte';
import PreferencesDockerCompatibilitySocketMappingStatus from './PreferencesDockerCompatibilitySocketMappingStatus.svelte';
</script>

<SettingsPage title="Docker compatibility">
  {#snippet subtitle()}
  
      Podman Desktop provides compatibility with Docker, allowing you to use your existing Docker commands, images and
      workflows.
    
  {/snippet}
  <div class="flex flex-col space-y-2">
    <div class="container" role="list">
      <div class="text-lg font-medium first-letter:uppercase">Docker Preferences</div>
      <PreferencesDockerCompatibilitySocketMappingStatus />
    </div>

    <PreferencesDockerCompatibilityContributions />

  </div>

</SettingsPage>
