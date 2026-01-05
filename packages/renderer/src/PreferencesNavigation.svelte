<script lang="ts">
import { SettingsNavItem } from '@podman-desktop/ui-svelte';
import type { Component } from 'svelte';
import { onMount } from 'svelte';
import type { TinroRouteMeta } from 'tinro';

import AuthenticationIcon from '/@/lib/images/AuthenticationIcon.svelte';
import CLIToolsIcon from '/@/lib/images/CLIToolsIcon.svelte';
import ExperimentalIcon from '/@/lib/images/ExperimentalIcon.svelte';
import KubernetesIcon from '/@/lib/images/KubernetesIcon.svelte';
import PreferencesIcon from '/@/lib/images/PreferencesIcon.svelte';
import ProxyIcon from '/@/lib/images/ProxyIcon.svelte';
import RegistriesIcon from '/@/lib/images/RegistriesIcon.svelte';
import ResourcesIcon from '/@/lib/images/ResourcesIcon.svelte';
import { CONFIGURATION_DEFAULT_SCOPE } from '/@api/configuration/constants.js';
import { DockerCompatibilitySettings } from '/@api/docker-compatibility-info';

import { configurationProperties } from './stores/configurationProperties';

interface Props {
  meta: TinroRouteMeta;
}

interface NavItem {
  id: string;
  title: string;
}

interface SettingsNavItemConfig {
  title: string;
  href: string;
  visible?: boolean;
  icon?: Component;
}

let { meta }: Props = $props();

let dockerCompatibilityEnabled = $state(false);
let configProperties: Map<string, NavItem[]> = $state(new Map<string, NavItem[]>());
let sectionExpanded: { [key: string]: boolean } = $state({});

let experimentalSection: boolean = $state(false);

let settingsNavigationItems = $derived<SettingsNavItemConfig[]>([
  { title: 'Resources', href: '/preferences/resources', visible: true, icon: ResourcesIcon },
  { title: 'Proxy', href: '/preferences/proxies', visible: true, icon: ProxyIcon },
  {
    title: 'Docker Compatibility',
    href: '/preferences/docker-compatibility',
    visible: dockerCompatibilityEnabled,
  },
  { title: 'Registries', href: '/preferences/registries', visible: true, icon: RegistriesIcon },
  { title: 'Authentication', href: '/preferences/authentication-providers', visible: true, icon: AuthenticationIcon },
  { title: 'CLI Tools', href: '/preferences/cli-tools', visible: true, icon: CLIToolsIcon },
  { title: 'Kubernetes', href: '/preferences/kubernetes-contexts', visible: true, icon: KubernetesIcon },
]);

function updateDockerCompatibility(): void {
  window
    .getConfigurationValue<boolean>(`${DockerCompatibilitySettings.SectionName}.${DockerCompatibilitySettings.Enabled}`)
    .then(result => {
      if (result !== undefined) {
        dockerCompatibilityEnabled = result;
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

    {#if experimentalSection}
      <SettingsNavItem
        icon={ExperimentalIcon}
        title="Experimental"
        href="/preferences/experimental"
        selected={meta.url === '/preferences/experimental'}
      />
    {/if}

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
  </div>
</nav>
