<script lang="ts">
import { SettingsNavItem } from '@podman-desktop/ui-svelte';
import { onMount } from 'svelte';
import type { TinroRouteMeta } from 'tinro';

import PreferencesIcon from '/@/lib/images/PreferencesIcon.svelte';
import TroubleshootingArrowIcon from '/@/lib/images/TroubleshootingArrowIcon.svelte';
import TroubleshootingIcon from '/@/lib/images/TroubleshootingIcon.svelte';
import { type NavItem, settingsNavigationEntries, type SettingsNavItemConfig } from '/@/PreferencesNavigation';
import { CONFIGURATION_DEFAULT_SCOPE } from '/@api/configuration/constants';
import { DockerCompatibilitySettings } from '/@api/docker-compatibility-info';

import { configurationProperties } from './stores/configurationProperties';

interface Props {
  meta: TinroRouteMeta;
}

let { meta }: Props = $props();

let configProperties: Map<string, NavItem[]> = $state(new Map<string, NavItem[]>());
let sectionExpanded: { [key: string]: boolean } = $state({});

let experimentalSection: boolean = $state(false);

let settingsNavigationItems: SettingsNavItemConfig[] = $state(settingsNavigationEntries);

function updateDockerCompatibility(): void {
  window
    .getConfigurationValue<boolean>(`${DockerCompatibilitySettings.SectionName}.${DockerCompatibilitySettings.Enabled}`)
    .then(result => {
      if (result !== undefined) {
        const index = settingsNavigationEntries.findIndex(entry => entry.title === 'Docker Compatibility');
        if (index !== -1) {
          settingsNavigationItems[index].visible = result;
        }
      }
    })
    .catch((err: unknown) =>
      console.error(
        `Error getting configuration value ${DockerCompatibilitySettings.SectionName}.${DockerCompatibilitySettings.Enabled}`,
        err,
      ),
    );
}

function sortItems(items: NavItem[]): NavItem[] {
  return items.toSorted((a, b) => a.title.localeCompare(b.title));
}

onMount(() => {
  return configurationProperties.subscribe(value => {
    // update compatibility
    updateDockerCompatibility();

    // check for experimental configuration
    experimentalSection = value.some(configuration => !!configuration.experimental);

    const experimentalIndex = settingsNavigationEntries.findIndex(entry => entry.title === 'Experimental');
    if (experimentalIndex !== -1) {
      settingsNavigationItems[experimentalIndex].visible = experimentalSection;
    }

    // update config properties
    configProperties = value.reduce((map, current) => {
      // filter on default scope
      if (current.scope !== CONFIGURATION_DEFAULT_SCOPE) return map;

      // do not include hidden property
      if (current.hidden) return map;

      let [parentLeftId] = current.parentId.split('.');
      const array: NavItem[] = map.get(parentLeftId) ?? [];

      let children = array.find((item: NavItem) => item.id === current.parentId);
      if (children === undefined) {
        map.set(parentLeftId, [...array, { id: current.parentId, title: current.title }]);
      }
      return map;
    }, new Map<string, NavItem[]>());
  });
});
</script>

<nav
  class="z-1 w-leftsidebar min-w-leftsidebar flex-col justify-between flex transition-all duration-500 ease-in-out bg-[var(--pd-secondary-nav-bg)] border-[var(--pd-global-nav-bg-border)] border-r-[1px]"
  aria-label="PreferencesNavigation">
  <div class="flex items-center">
    <div class="pt-4 px-3 mb-5">
      <p
        class="text-xl font-semibold text-[color:var(--pd-secondary-nav-header-text)] border-l-[4px] border-transparent">
        Settings
      </p>
    </div>
  </div>
  <div class="h-full overflow-y-auto" style="margin-bottom:auto">
    {#each settingsNavigationItems as navItem, index (index)}
      {#if navItem.visible}
        <SettingsNavItem 
          title={navItem.title} 
          href={navItem.href} 
          icon={navItem.icon}
          selected={meta.url === navItem.href} 
        />
      {/if}
    {/each}

    <!-- Default configuration properties start -->
    {#each configProperties as [configSection, configItems] (configSection)}
      <SettingsNavItem
        title={configSection}
        href="/preferences/default/{configSection}"
        icon={PreferencesIcon}
        section={configItems.length > 0}
        selected={meta.url === `/preferences/default/${configSection}`}
        bind:expanded={sectionExpanded[configSection]} />
      {#if sectionExpanded[configSection]}
        {#each sortItems(configItems) as configItem (configItem.id)}
          <SettingsNavItem
            title={configItem.title}
            href="/preferences/default/{configItem.id}"
            child={true}
            selected={meta.url === `/preferences/default/${configItem.id}`} />
        {/each}
      {/if}
    {/each}
    <!-- Default configuration properties end -->

    <!-- Troubleshooting separator and item -->
    <div class="mx-3 my-2 border-t border-[var(--pd-global-nav-bg-border)]"></div>
    <SettingsNavItem
      icon={TroubleshootingIcon}
      iconRight={TroubleshootingArrowIcon}
      iconRightAlign="end"
      iconRightClass="inline-flex items-center justify-center min-w-[14px] min-h-[14px]"
      title="Troubleshooting"
      href="/troubleshooting/repair-connections"
      selected={meta.url === '/troubleshooting/repair-connections'}
    />
  </div>
</nav>
