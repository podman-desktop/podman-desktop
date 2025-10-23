<script lang="ts">
import { NavPage } from '@podman-desktop/ui-svelte';

import ExtensionBanners from '/@/lib/recommendation/ExtensionBanners.svelte';

import ExploreFeatures from '../explore-features/ExploreFeatures.svelte';
import LearningCenter from '../learning-center/LearningCenter.svelte';
import NotificationsBox from './NotificationsBox.svelte';
import ProvidersSection from './ProvidersSection.svelte';
import ReleaseNotesBox from './ReleaseNotesBox.svelte';
</script>

<NavPage searchEnabled={false} title="Dashboard">
  {#snippet content()}
  <div class="flex flex-col min-w-full h-full bg-[var(--pd-content-bg)] py-5">
    <div class="min-w-full flex-1">
      <NotificationsBox />
      <div class="px-5 space-y-5 h-full">
        <ReleaseNotesBox />
        <ExtensionBanners />
        <ExploreFeatures />
        <LearningCenter />
        <ProvidersSection />
      </div>
    </div>
  </div>
  {/snippet}
</NavPage>
