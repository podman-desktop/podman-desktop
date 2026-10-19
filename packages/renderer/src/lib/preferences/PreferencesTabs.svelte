<script lang="ts">
import SlideToggle from '/@/lib/ui/SlideToggle.svelte';
import { setTabsEnabled, tabPreferences } from '/@/stores/layout/tab-preferences.svelte';

function changeTabs(event: CustomEvent<boolean>): void {
  setTabsEnabled(event.detail);
}
</script>

<section aria-label="Tabs">
  <h2 class="text-lg font-medium">Tabs</h2>
  <div class="bg-[var(--pd-invert-content-card-bg)] rounded-md mt-2 ml-2 p-3 text-[var(--pd-invert-content-card-text)]">
    <div class="flex items-center justify-between gap-4">
      <div>
        <div class="font-semibold">Enable tabs</div>
        <p class="pt-1 text-sm">Open resources in separate tabs, each with its own back and forward history. Turn off to use standard page navigation.</p>
      </div>
      <SlideToggle id="tabs-enabled" aria-label="Enable tabs" checked={tabPreferences.tabsEnabled} on:checked={changeTabs} />
    </div>
  </div>
</section>
