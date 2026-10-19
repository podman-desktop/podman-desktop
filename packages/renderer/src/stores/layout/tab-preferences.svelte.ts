const KEY = 'podman-desktop.workspace.tabs-enabled';

export const tabPreferences = $state({ tabsEnabled: localStorage.getItem(KEY) === 'true' });

export function setTabsEnabled(enabled: boolean): void {
  tabPreferences.tabsEnabled = enabled;
  localStorage.setItem(KEY, String(enabled));
}
