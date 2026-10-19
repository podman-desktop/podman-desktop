<script lang="ts">
import SlideToggle from '/@/lib/ui/SlideToggle.svelte';
import { setTabsEnabled, tabPreferences } from '/@/stores/layout/tab-preferences.svelte';

function changeTabs(event: CustomEvent<boolean>): void {
  setTabsEnabled(event.detail);
}
</script>

<section aria-label="Tabbed navigation">
  <div class="bg-[var(--pd-invert-content-card-bg)] rounded-md mt-2 ml-2 p-3 text-[var(--pd-invert-content-card-text)]">
    <div class="flex items-center justify-between gap-4">
      <div>
        <div class="font-semibold">Tabbed navigation</div>
        <p class="pt-1 text-sm">Open resources in separate tabs instead of the current page.</p>
      </div>
      <SlideToggle id="tabs-enabled" aria-label="Tabbed navigation" checked={tabPreferences.tabsEnabled} on:checked={changeTabs} />
    </div>
  </div>
</section>
