/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars, sonarjs/no-nested-template-literals */
/**
 * Mock preload for static (non-Electron) builds.
 * Replaces the Electron contextBridge preload by stubbing all window.* APIs
 * with no-ops and providing fixture data for volume-related pages.
 *
 * Loaded before main.ts via index-static.html.
 */

// ─── EventEmitter for window.events ─────────────────────────────────────────

type Listener = (...args: unknown[]) => void;

const eventListeners = new Map<string, Set<Listener>>();

(window as any).events = {
  send(channel: string, ...args: unknown[]): void {
    const listeners = eventListeners.get(channel);
    if (listeners) {
      listeners.forEach(fn => {
        try {
          fn(...args);
        } catch (_) {
          /* noop */
        }
      });
    }
  },
  receive(channel: string, func: Listener): { dispose(): void } {
    if (!eventListeners.has(channel)) {
      eventListeners.set(channel, new Set());
    }
    eventListeners.get(channel)!.add(func);
    return {
      dispose(): void {
        eventListeners.get(channel)?.delete(func);
      },
    };
  },
};

// ─── All window method names from exposedInMainWorld.d.ts ────────────────────

const ALL_METHODS = [
  'addNotification',
  'attachContainer',
  'attachContainerSend',
  'auditConnectionParameters',
  'buildImage',
  'cancelToken',
  'checkImageCredentials',
  'checkImageUpdateStatus',
  'cleanupProviders',
  'cleanupWebviewDevTools',
  'clearNotificationsQueue',
  'clearTask',
  'clearTasks',
  'clipboardWriteText',
  'closeCustomPick',
  'closeFeatureCard',
  'containerfileGetInfo',
  'contextCollectAllValues',
  'createAndStartContainer',
  'createContainerProviderConnection',
  'createHash',
  'createImageRegistry',
  'createKubernetesPortForward',
  'createKubernetesProviderConnection',
  'createManifest',
  'createNetwork',
  'createPod',
  'createTempFile',
  'createVmProviderConnection',
  'createVolume',
  'ddExtensionDelete',
  'ddExtensionInstall',
  'deleteContainer',
  'deleteContainersByLabel',
  'deleteImage',
  'deleteKubernetesPortForward',
  'deleteProviderConnectionLifecycle',
  'disableExperimentalConfiguration',
  'editProviderConnectionLifecycle',
  'enableExperimentalConfiguration',
  'ensureExtensionIsEnabled',
  'executeCommand',
  'executeStatusBarEntryCommand',
  'executeTask',
  'exportContainer',
  'extensionInstallFromImage',
  'extensionSystemIsExtensionsStarted',
  'extensionSystemIsReady',
  'fetchExtensionViewsContributions',
  'generateKube',
  'generatePodmanKube',
  'getAuthenticationProvidersInfo',
  'getCancellableTokenSource',
  'getCatalogExtensions',
  'getCliToolInfos',
  'getCommandPaletteCommands',
  'getCommandPaletteSearchOptions',
  'getConfigurationProperties',
  'getConfigurationValue',
  'getContainerInspect',
  'getContainerStats',
  'getContext',
  'getContributedMenus',
  'getDDPreloadPath',
  'getDashboardSystemOverviewStatus',
  'getDevtoolsConsoleLogs',
  'getDocumentationItems',
  'getExtensionBanners',
  'getFeaturedExtensions',
  'getFeedbackLinks',
  'getFeedbackMessages',
  'getFreePort',
  'getFreePortRange',
  'getGitHubFeedbackLinks',
  'getImageCheckerProviders',
  'getImageFilesProviders',
  'getImageHistory',
  'getImageInspect',
  'getImageRegistries',
  'getImageRegistryProviderNames',
  'getImageSuggestedRegistries',
  'getKubeGeneratorsInfos',
  'getKubernetesPortForwards',
  'getNetworkDrivers',
  'getOnboarding',
  'getOsArch',
  'getOsCpu',
  'getOsFreeDiskSize',
  'getOsHostname',
  'getOsMemory',
  'getOsPlatform',
  'getPodInspect',
  'getPodmanDesktopVersion',
  'getProviderDetectionChecks',
  'getProviderInfos',
  'getProxySettings',
  'getProxyState',
  'getRecommendedRegistries',
  'getRegisteredFeatures',
  'getStatusBarEntries',
  'getStatusBarPinOptions',
  'getSystemDockerSocketMappingStatus',
  'getTelemetryMessages',
  'getTitleBarText',
  'getUrlProtocol',
  'getVolumeInspect',
  'getWebviewPreloadPath',
  'getWebviewRegistryHttpPort',
  'getWelcomeMessages',
  'hasAuthconfigForImage',
  'helpMenuGetItems',
  'imageCheck',
  'imageGetFilesystemLayers',
  'importContainer',
  'initializeProvider',
  'inspectManifest',
  'inspectNetwork',
  'installCliTool',
  'installProvider',
  'isExperimentalConfigurationEnabled',
  'isFreePort',
  'kubernetesApplyResourcesFromFile',
  'kubernetesApplyResourcesFromYAML',
  'kubernetesCreateIngress',
  'kubernetesCreatePod',
  'kubernetesCreateResourcesFromFile',
  'kubernetesCreateService',
  'kubernetesDeleteConfigMap',
  'kubernetesDeleteContext',
  'kubernetesDeleteCronJob',
  'kubernetesDeleteDeployment',
  'kubernetesDeleteIngress',
  'kubernetesDeleteJob',
  'kubernetesDeletePersistentVolumeClaim',
  'kubernetesDeletePod',
  'kubernetesDeleteRoute',
  'kubernetesDeleteSecret',
  'kubernetesDeleteService',
  'kubernetesDuplicateContext',
  'kubernetesExec',
  'kubernetesExecResize',
  'kubernetesExecSend',
  'kubernetesGetActiveResourcesCount',
  'kubernetesGetClusters',
  'kubernetesGetContexts',
  'kubernetesGetContextsGeneralState',
  'kubernetesGetContextsHealths',
  'kubernetesGetContextsPermissions',
  'kubernetesGetCurrentContextGeneralState',
  'kubernetesGetCurrentContextName',
  'kubernetesGetCurrentNamespace',
  'kubernetesGetDetailedContexts',
  'kubernetesGetResources',
  'kubernetesGetResourcesCount',
  'kubernetesGetTroubleshootingInformation',
  'kubernetesGetUsers',
  'kubernetesIsAPIGroupSupported',
  'kubernetesListNamespacedPod',
  'kubernetesListNamespaces',
  'kubernetesListRoutes',
  'kubernetesReadNamespacedConfigMap',
  'kubernetesReadNamespacedCronJob',
  'kubernetesReadNamespacedDeployment',
  'kubernetesReadNamespacedIngress',
  'kubernetesReadNamespacedJob',
  'kubernetesReadNamespacedPersistentVolumeClaim',
  'kubernetesReadNamespacedPod',
  'kubernetesReadNamespacedRoute',
  'kubernetesReadNamespacedSecret',
  'kubernetesReadNamespacedService',
  'kubernetesReadNode',
  'kubernetesReadPodLog',
  'kubernetesRefreshContextState',
  'kubernetesRegisterGetCurrentContextResources',
  'kubernetesSetContext',
  'kubernetesSetCurrentNamespace',
  'kubernetesUnregisterGetCurrentContextResources',
  'kubernetesUpdateContext',
  'listColors',
  'listContainers',
  'listContainersFromEngine',
  'listContexts',
  'listContributions',
  'listExtensionDevelopmentFolders',
  'listExtensions',
  'listFeatures',
  'listGuides',
  'listIcons',
  'listImageTagsInRegistry',
  'listImages',
  'listNetworks',
  'listNotifications',
  'listOnboarding',
  'listPods',
  'listSimpleContainersByLabel',
  'listViewsContributions',
  'listVolumes',
  'listWebviews',
  'loadImages',
  'loadListConfig',
  'logsContainer',
  'makeDefaultWebviewVisible',
  'navigateToRoute',
  'onDidUpdateProviderStatus',
  'openDialog',
  'openExternal',
  'openshiftCreateRoute',
  'pathRelative',
  'pinStatusBar',
  'pingContainerEngine',
  'playKube',
  'podmanDesktopGetReleaseNotes',
  'podmanDesktopUpdateAvailable',
  'previewOnGitHub',
  'pruneContainers',
  'pruneImages',
  'prunePods',
  'pruneVolumes',
  'pullImage',
  'pushImage',
  'pushManifest',
  'reconnectContainerProviders',
  'refreshCatalogExtensions',
  'refreshDocumentationItems',
  'registerWebviewDevTools',
  'removeExtension',
  'removeManifest',
  'removeNetwork',
  'removeNotification',
  'removePod',
  'removeTempFile',
  'removeVolume',
  'replicatePodmanContainer',
  'requestAuthenticationProviderSignIn',
  'requestAuthenticationProviderSignOut',
  'resetListConfig',
  'resetOnboarding',
  'resolveShortnameImage',
  'restartContainer',
  'restartContainersByLabel',
  'restartKubernetesPod',
  'restartPod',
  'runInstallPreflightChecks',
  'runUpdatePreflightChecks',
  'saveDialog',
  'saveImages',
  'saveListConfig',
  'searchImageInRegistry',
  'selectCliToolVersionToInstall',
  'selectCliToolVersionToUpdate',
  'sendCustomPickItemsOnConfirmation',
  'sendFeedback',
  'sendNavigationItems',
  'sendShowInputBoxValidate',
  'sendShowInputBoxValue',
  'sendShowMessageBoxOnSelect',
  'sendShowQuickPickOnSelect',
  'sendShowQuickPickValues',
  'setProxyState',
  'shellInContainer',
  'shellInContainerResize',
  'shellInContainerSend',
  'shellInProviderConnection',
  'shellInProviderConnectionClose',
  'shellInProviderConnectionResize',
  'shellInProviderConnectionSend',
  'showAccountsMenu',
  'showMessageBox',
  'startContainer',
  'startContainersByLabel',
  'startExtension',
  'startPod',
  'startProvider',
  'startProviderConnectionLifecycle',
  'startProviderLifecycle',
  'startReceiveLogs',
  'stopContainer',
  'stopContainerStats',
  'stopContainersByLabel',
  'stopExtension',
  'stopPod',
  'stopProviderConnectionLifecycle',
  'stopProviderLifecycle',
  'stopReceiveLogs',
  'tagImage',
  'telemetryConfigure',
  'telemetryPage',
  'telemetryTrack',
  'trackExtensionFolder',
  'troubleshootingSaveLogs',
  'uninstallCliTool',
  'unpinStatusBar',
  'unregisterImageRegistry',
  'untrackExtensionFolder',
  'updateCliTool',
  'updateConfigurationValue',
  'updateExperimentalConfigurationValue',
  'updateExtension',
  'updateImageRegistry',
  'updateNetwork',
  'updatePodmanDesktop',
  'updateProvider',
  'updateProxySettings',
  'updateStepState',
  'windowClose',
  'windowMaximize',
  'windowMinimize',
];

// Stub all methods as async no-ops first
for (const name of ALL_METHODS) {
  if (!(name in window)) {
    Object.defineProperty(window, name, {
      value: async (..._args: unknown[]) => undefined,
      configurable: true,
      writable: true,
    });
  }
}

// ─── Mock fixture data ───────────────────────────────────────────────────────

const MOCK_PROVIDER = {
  id: 'podman',
  internalId: 'podman.podman',
  name: 'Podman',
  status: 'started' as const,
  containerConnections: [
    {
      name: 'Podman Machine',
      status: 'started' as const,
      endpoint: { socketPath: '/mock/podman.sock' },
      type: 'podman' as const,
    },
  ],
  kubernetesConnections: [],
  lifecycleMethods: [],
  detectionChecks: [],
  images: {},
  version: '5.4.0',
  links: [],
  warnings: [],
  installationSupport: false,
  containerProviderConnectionCreation: false,
  kubernetesProviderConnectionCreation: false,
  vmProviderConnectionCreation: false,
  cleanupSupport: false,
  emptyConnectionMarkdownDescription: '',
};

const MOCK_VOLUMES = [
  {
    engineName: 'Podman',
    engineId: 'podman.podman',
    Volumes: [
      {
        Name: 'my-app-data',
        Driver: 'local',
        Mountpoint: '/var/lib/containers/storage/volumes/my-app-data/_data',
        CreatedAt: '2026-05-20T10:00:00Z',
        Labels: {},
        Scope: 'local',
        Options: {},
        engineName: 'Podman',
        engineId: 'podman.podman',
        UsageData: { Size: 52428800, RefCount: 0 },
        containersUsage: [],
      },
      {
        Name: 'postgres-data',
        Driver: 'local',
        Mountpoint: '/var/lib/containers/storage/volumes/postgres-data/_data',
        CreatedAt: '2026-05-18T14:30:00Z',
        Labels: { 'com.example.app': 'database' },
        Scope: 'local',
        Options: {},
        engineName: 'Podman',
        engineId: 'podman.podman',
        UsageData: { Size: 209715200, RefCount: 0 },
        containersUsage: [],
      },
      {
        Name: 'redis-cache',
        Driver: 'local',
        Mountpoint: '/var/lib/containers/storage/volumes/redis-cache/_data',
        CreatedAt: '2026-05-22T09:15:00Z',
        Labels: {},
        Scope: 'local',
        Options: {},
        engineName: 'Podman',
        engineId: 'podman.podman',
        UsageData: { Size: 10485760, RefCount: 0 },
        containersUsage: [],
      },
      {
        Name: 'nginx-config',
        Driver: 'local',
        Mountpoint: '/var/lib/containers/storage/volumes/nginx-config/_data',
        CreatedAt: '2026-05-15T08:00:00Z',
        Labels: { 'com.example.app': 'webserver' },
        Scope: 'local',
        Options: {},
        engineName: 'Podman',
        engineId: 'podman.podman',
        UsageData: { Size: 1048576, RefCount: 0 },
        containersUsage: [],
      },
    ],
  },
];

type ColorEntry = { id: string; cssVar: string; value: string };

const MOCK_COLORS_DARK: ColorEntry[] = [
  { id: 'pd-titlebar-bg', cssVar: '--pd-titlebar-bg', value: '#1b1b1b' },
  { id: 'pd-titlebar-text', cssVar: '--pd-titlebar-text', value: '#e7e7e7' },
  { id: 'pd-content-bg', cssVar: '--pd-content-bg', value: '#1b1b1b' },
  { id: 'pd-content-card-bg', cssVar: '--pd-content-card-bg', value: '#292929' },
  { id: 'pd-content-card-header-text', cssVar: '--pd-content-card-header-text', value: '#e7e7e7' },
  { id: 'pd-content-card-text', cssVar: '--pd-content-card-text', value: '#b3b3b3' },
  { id: 'pd-content-header', cssVar: '--pd-content-header', value: '#e7e7e7' },
  { id: 'pd-content-text', cssVar: '--pd-content-text', value: '#b3b3b3' },
  { id: 'pd-default-text', cssVar: '--pd-default-text', value: '#e7e7e7' },
  { id: 'pd-invert-content-bg', cssVar: '--pd-invert-content-bg', value: '#e7e7e7' },
  { id: 'pd-invert-content-card-bg', cssVar: '--pd-invert-content-card-bg', value: '#f5f5f5' },
  { id: 'pd-invert-content-header-text', cssVar: '--pd-invert-content-header-text', value: '#1b1b1b' },
  { id: 'pd-global-nav-bg', cssVar: '--pd-global-nav-bg', value: '#292929' },
  { id: 'pd-global-nav-bg-border', cssVar: '--pd-global-nav-bg-border', value: '#3f3f46' },
  { id: 'pd-global-nav-icon', cssVar: '--pd-global-nav-icon', value: '#b3b3b3' },
  { id: 'pd-global-nav-icon-hover', cssVar: '--pd-global-nav-icon-hover', value: '#ffffff' },
  { id: 'pd-global-nav-icon-selected', cssVar: '--pd-global-nav-icon-selected', value: '#ffffff' },
  { id: 'pd-global-nav-icon-selected-bg', cssVar: '--pd-global-nav-icon-selected-bg', value: '#3f3f46' },
  { id: 'pd-global-nav-icon-selected-highlight', cssVar: '--pd-global-nav-icon-selected-highlight', value: '#a855f7' },
  { id: 'pd-secondary-nav-bg', cssVar: '--pd-secondary-nav-bg', value: '#1b1b1b' },
  { id: 'pd-secondary-nav-text', cssVar: '--pd-secondary-nav-text', value: '#b3b3b3' },
  { id: 'pd-secondary-nav-text-hover', cssVar: '--pd-secondary-nav-text-hover', value: '#e7e7e7' },
  { id: 'pd-secondary-nav-text-selected', cssVar: '--pd-secondary-nav-text-selected', value: '#ffffff' },
  { id: 'pd-secondary-nav-header-text', cssVar: '--pd-secondary-nav-header-text', value: '#e7e7e7' },
  { id: 'pd-secondary-nav-selected-highlight', cssVar: '--pd-secondary-nav-selected-highlight', value: '#a855f7' },
  { id: 'pd-button-primary-bg', cssVar: '--pd-button-primary-bg', value: '#a855f7' },
  { id: 'pd-button-primary-hover-bg', cssVar: '--pd-button-primary-hover-bg', value: '#c084fc' },
  { id: 'pd-button-primary-border', cssVar: '--pd-button-primary-border', value: 'rgba(216,180,254,0.4)' },
  { id: 'pd-button-primary-text', cssVar: '--pd-button-primary-text', value: '#ffffff' },
  { id: 'pd-button-text', cssVar: '--pd-button-text', value: '#ffffff' },
  { id: 'pd-button-secondary', cssVar: '--pd-button-secondary', value: '#44403c' },
  { id: 'pd-button-secondary-bg', cssVar: '--pd-button-secondary-bg', value: '#44403c' },
  { id: 'pd-button-secondary-hover', cssVar: '--pd-button-secondary-hover', value: '#475569' },
  { id: 'pd-button-secondary-hover-bg', cssVar: '--pd-button-secondary-hover-bg', value: '#475569' },
  { id: 'pd-button-secondary-border', cssVar: '--pd-button-secondary-border', value: 'rgba(156,163,175,0.4)' },
  { id: 'pd-button-secondary-text', cssVar: '--pd-button-secondary-text', value: '#e5e7eb' },
  { id: 'pd-button-disabled', cssVar: '--pd-button-disabled', value: '#44403c' },
  { id: 'pd-button-disabled-bg', cssVar: '--pd-button-disabled-bg', value: '#44403c' },
  { id: 'pd-button-disabled-text', cssVar: '--pd-button-disabled-text', value: '#71717a' },
  { id: 'pd-button-danger-bg', cssVar: '--pd-button-danger-bg', value: '#b91c1c' },
  { id: 'pd-button-danger-border', cssVar: '--pd-button-danger-border', value: '#ef4444' },
  { id: 'pd-button-danger-text', cssVar: '--pd-button-danger-text', value: '#ffffff' },
  { id: 'pd-button-danger-hover-bg', cssVar: '--pd-button-danger-hover-bg', value: '#dc2626' },
  { id: 'pd-button-link-bg', cssVar: '--pd-button-link-bg', value: 'transparent' },
  { id: 'pd-button-link-text', cssVar: '--pd-button-link-text', value: '#c084fc' },
  { id: 'pd-button-link-hover-bg', cssVar: '--pd-button-link-hover-bg', value: 'rgba(192,132,252,0.1)' },
  { id: 'pd-button-focus-ring', cssVar: '--pd-button-focus-ring', value: '#c084fc' },
  { id: 'pd-button-tab-border', cssVar: '--pd-button-tab-border', value: 'transparent' },
  { id: 'pd-button-tab-border-selected', cssVar: '--pd-button-tab-border-selected', value: '#c084fc' },
  { id: 'pd-button-tab-text', cssVar: '--pd-button-tab-text', value: '#c084fc' },
  { id: 'pd-button-tab-text-selected', cssVar: '--pd-button-tab-text-selected', value: '#c084fc' },
  { id: 'pd-input-field-bg', cssVar: '--pd-input-field-bg', value: '#18181b' },
  { id: 'pd-input-field-focused-bg', cssVar: '--pd-input-field-focused-bg', value: '#18181b' },
  { id: 'pd-input-field-focused-text', cssVar: '--pd-input-field-focused-text', value: '#e7e7e7' },
  { id: 'pd-input-field-stroke', cssVar: '--pd-input-field-stroke', value: '#52525b' },
  { id: 'pd-input-field-stroke-focused', cssVar: '--pd-input-field-stroke-focused', value: '#a855f7' },
  { id: 'pd-input-field-stroke-error', cssVar: '--pd-input-field-stroke-error', value: '#ef4444' },
  { id: 'pd-input-field-hover-stroke', cssVar: '--pd-input-field-hover-stroke', value: '#a1a1aa' },
  { id: 'pd-table-header-bg', cssVar: '--pd-table-header-bg', value: '#27272a' },
  { id: 'pd-table-header-text', cssVar: '--pd-table-header-text', value: '#a1a1aa' },
  { id: 'pd-table-body-text', cssVar: '--pd-table-body-text', value: '#e7e7e7' },
  { id: 'pd-table-body-text-sub-secondary', cssVar: '--pd-table-body-text-sub-secondary', value: '#a1a1aa' },
  { id: 'pd-table-body-text-highlight', cssVar: '--pd-table-body-text-highlight', value: '#a855f7' },
  { id: 'pd-table-row-hover', cssVar: '--pd-table-row-hover', value: '#3f3f46' },
  { id: 'pd-status-running', cssVar: '--pd-status-running', value: '#16a34a' },
  { id: 'pd-status-stopped', cssVar: '--pd-status-stopped', value: '#737373' },
  { id: 'pd-status-not-running', cssVar: '--pd-status-not-running', value: '#737373' },
  { id: 'pd-status-starting', cssVar: '--pd-status-starting', value: '#e5e7eb' },
  { id: 'pd-status-waiting', cssVar: '--pd-status-waiting', value: '#e5e7eb' },
  { id: 'pd-status-exited', cssVar: '--pd-status-exited', value: '#ef4444' },
  { id: 'pd-status-degraded', cssVar: '--pd-status-degraded', value: '#f59e0b' },
  { id: 'pd-status-paused', cssVar: '--pd-status-paused', value: '#3b82f6' },
  { id: 'pd-label-text', cssVar: '--pd-label-text', value: '#a1a1aa' },
  { id: 'pd-modal-bg', cssVar: '--pd-modal-bg', value: '#27272a' },
  { id: 'pd-modal-header-text', cssVar: '--pd-modal-header-text', value: '#e7e7e7' },
  { id: 'pd-modal-text', cssVar: '--pd-modal-text', value: '#b3b3b3' },
  { id: 'pd-dropdown-bg', cssVar: '--pd-dropdown-bg', value: '#27272a' },
  { id: 'pd-dropdown-ring', cssVar: '--pd-dropdown-ring', value: '#52525b' },
  { id: 'pd-action-button-text', cssVar: '--pd-action-button-text', value: '#ffffff' },
  { id: 'pd-action-button-bg', cssVar: '--pd-action-button-bg', value: '#a855f7' },
  { id: 'pd-action-button-details-text', cssVar: '--pd-action-button-details-text', value: '#b3b3b3' },
  { id: 'pd-action-button-disabled-text', cssVar: '--pd-action-button-disabled-text', value: '#71717a' },
];

const MOCK_COLORS_LIGHT: ColorEntry[] = [
  { id: 'pd-titlebar-bg', cssVar: '--pd-titlebar-bg', value: '#f9fafb' },
  { id: 'pd-titlebar-text', cssVar: '--pd-titlebar-text', value: '#7c3aed' },
  { id: 'pd-content-bg', cssVar: '--pd-content-bg', value: '#f9fafb' },
  { id: 'pd-content-card-bg', cssVar: '--pd-content-card-bg', value: '#ffffff' },
  { id: 'pd-content-card-header-text', cssVar: '--pd-content-card-header-text', value: '#1b1b1b' },
  { id: 'pd-content-card-text', cssVar: '--pd-content-card-text', value: '#525252' },
  { id: 'pd-content-header', cssVar: '--pd-content-header', value: '#1b1b1b' },
  { id: 'pd-content-text', cssVar: '--pd-content-text', value: '#525252' },
  { id: 'pd-default-text', cssVar: '--pd-default-text', value: '#1b1b1b' },
  { id: 'pd-invert-content-bg', cssVar: '--pd-invert-content-bg', value: '#1b1b1b' },
  { id: 'pd-invert-content-card-bg', cssVar: '--pd-invert-content-card-bg', value: '#292929' },
  { id: 'pd-invert-content-header-text', cssVar: '--pd-invert-content-header-text', value: '#e7e7e7' },
  { id: 'pd-global-nav-bg', cssVar: '--pd-global-nav-bg', value: '#f3f4f6' },
  { id: 'pd-global-nav-bg-border', cssVar: '--pd-global-nav-bg-border', value: '#d1d5db' },
  { id: 'pd-global-nav-icon', cssVar: '--pd-global-nav-icon', value: '#525252' },
  { id: 'pd-global-nav-icon-hover', cssVar: '--pd-global-nav-icon-hover', value: '#525252' },
  { id: 'pd-global-nav-icon-selected', cssVar: '--pd-global-nav-icon-selected', value: '#7c3aed' },
  { id: 'pd-global-nav-icon-selected-bg', cssVar: '--pd-global-nav-icon-selected-bg', value: '#e5e7eb' },
  { id: 'pd-global-nav-icon-selected-highlight', cssVar: '--pd-global-nav-icon-selected-highlight', value: '#7c3aed' },
  { id: 'pd-secondary-nav-bg', cssVar: '--pd-secondary-nav-bg', value: '#f9fafb' },
  { id: 'pd-secondary-nav-text', cssVar: '--pd-secondary-nav-text', value: '#525252' },
  { id: 'pd-secondary-nav-text-hover', cssVar: '--pd-secondary-nav-text-hover', value: '#1b1b1b' },
  { id: 'pd-secondary-nav-text-selected', cssVar: '--pd-secondary-nav-text-selected', value: '#1b1b1b' },
  { id: 'pd-secondary-nav-header-text', cssVar: '--pd-secondary-nav-header-text', value: '#1b1b1b' },
  { id: 'pd-secondary-nav-selected-highlight', cssVar: '--pd-secondary-nav-selected-highlight', value: '#7c3aed' },
  { id: 'pd-button-primary-bg', cssVar: '--pd-button-primary-bg', value: '#a855f7' },
  { id: 'pd-button-primary-hover-bg', cssVar: '--pd-button-primary-hover-bg', value: '#c084fc' },
  { id: 'pd-button-primary-border', cssVar: '--pd-button-primary-border', value: 'transparent' },
  { id: 'pd-button-primary-text', cssVar: '--pd-button-primary-text', value: '#ffffff' },
  { id: 'pd-button-text', cssVar: '--pd-button-text', value: '#ffffff' },
  { id: 'pd-button-secondary', cssVar: '--pd-button-secondary', value: '#ede9fe' },
  { id: 'pd-button-secondary-bg', cssVar: '--pd-button-secondary-bg', value: '#ede9fe' },
  { id: 'pd-button-secondary-hover', cssVar: '--pd-button-secondary-hover', value: '#f5f3ff' },
  { id: 'pd-button-secondary-hover-bg', cssVar: '--pd-button-secondary-hover-bg', value: '#f5f3ff' },
  { id: 'pd-button-secondary-border', cssVar: '--pd-button-secondary-border', value: '#a855f7' },
  { id: 'pd-button-secondary-text', cssVar: '--pd-button-secondary-text', value: '#a855f7' },
  { id: 'pd-button-disabled', cssVar: '--pd-button-disabled', value: '#d6d3d1' },
  { id: 'pd-button-disabled-bg', cssVar: '--pd-button-disabled-bg', value: '#d6d3d1' },
  { id: 'pd-button-disabled-text', cssVar: '--pd-button-disabled-text', value: '#a1a1aa' },
  { id: 'pd-button-danger-bg', cssVar: '--pd-button-danger-bg', value: '#fecaca' },
  { id: 'pd-button-danger-border', cssVar: '--pd-button-danger-border', value: '#991b1b' },
  { id: 'pd-button-danger-text', cssVar: '--pd-button-danger-text', value: '#991b1b' },
  { id: 'pd-button-danger-hover-bg', cssVar: '--pd-button-danger-hover-bg', value: '#fee2e2' },
  { id: 'pd-button-link-bg', cssVar: '--pd-button-link-bg', value: 'transparent' },
  { id: 'pd-button-link-text', cssVar: '--pd-button-link-text', value: '#7c3aed' },
  { id: 'pd-button-link-hover-bg', cssVar: '--pd-button-link-hover-bg', value: 'rgba(124,58,237,0.1)' },
  { id: 'pd-button-focus-ring', cssVar: '--pd-button-focus-ring', value: '#7c3aed' },
  { id: 'pd-button-tab-border', cssVar: '--pd-button-tab-border', value: 'transparent' },
  { id: 'pd-button-tab-border-selected', cssVar: '--pd-button-tab-border-selected', value: '#7c3aed' },
  { id: 'pd-button-tab-text', cssVar: '--pd-button-tab-text', value: '#7c3aed' },
  { id: 'pd-button-tab-text-selected', cssVar: '--pd-button-tab-text-selected', value: '#7c3aed' },
  { id: 'pd-input-field-bg', cssVar: '--pd-input-field-bg', value: '#ffffff' },
  { id: 'pd-input-field-focused-bg', cssVar: '--pd-input-field-focused-bg', value: '#ffffff' },
  { id: 'pd-input-field-focused-text', cssVar: '--pd-input-field-focused-text', value: '#1b1b1b' },
  { id: 'pd-input-field-stroke', cssVar: '--pd-input-field-stroke', value: '#d1d5db' },
  { id: 'pd-input-field-stroke-focused', cssVar: '--pd-input-field-stroke-focused', value: '#7c3aed' },
  { id: 'pd-input-field-stroke-error', cssVar: '--pd-input-field-stroke-error', value: '#dc2626' },
  { id: 'pd-input-field-hover-stroke', cssVar: '--pd-input-field-hover-stroke', value: '#9ca3af' },
  { id: 'pd-table-header-bg', cssVar: '--pd-table-header-bg', value: '#f3f4f6' },
  { id: 'pd-table-header-text', cssVar: '--pd-table-header-text', value: '#6b7280' },
  { id: 'pd-table-body-text', cssVar: '--pd-table-body-text', value: '#1b1b1b' },
  { id: 'pd-table-body-text-sub-secondary', cssVar: '--pd-table-body-text-sub-secondary', value: '#6b7280' },
  { id: 'pd-table-body-text-highlight', cssVar: '--pd-table-body-text-highlight', value: '#7c3aed' },
  { id: 'pd-table-row-hover', cssVar: '--pd-table-row-hover', value: '#f3f4f6' },
  { id: 'pd-status-running', cssVar: '--pd-status-running', value: '#16a34a' },
  { id: 'pd-status-stopped', cssVar: '--pd-status-stopped', value: '#9ca3af' },
  { id: 'pd-status-not-running', cssVar: '--pd-status-not-running', value: '#9ca3af' },
  { id: 'pd-status-starting', cssVar: '--pd-status-starting', value: '#6b7280' },
  { id: 'pd-status-waiting', cssVar: '--pd-status-waiting', value: '#6b7280' },
  { id: 'pd-status-exited', cssVar: '--pd-status-exited', value: '#dc2626' },
  { id: 'pd-status-degraded', cssVar: '--pd-status-degraded', value: '#d97706' },
  { id: 'pd-status-paused', cssVar: '--pd-status-paused', value: '#2563eb' },
  { id: 'pd-label-text', cssVar: '--pd-label-text', value: '#6b7280' },
  { id: 'pd-modal-bg', cssVar: '--pd-modal-bg', value: '#ffffff' },
  { id: 'pd-modal-header-text', cssVar: '--pd-modal-header-text', value: '#1b1b1b' },
  { id: 'pd-modal-text', cssVar: '--pd-modal-text', value: '#525252' },
  { id: 'pd-dropdown-bg', cssVar: '--pd-dropdown-bg', value: '#ffffff' },
  { id: 'pd-dropdown-ring', cssVar: '--pd-dropdown-ring', value: '#d1d5db' },
  { id: 'pd-action-button-text', cssVar: '--pd-action-button-text', value: '#ffffff' },
  { id: 'pd-action-button-bg', cssVar: '--pd-action-button-bg', value: '#7c3aed' },
  { id: 'pd-action-button-details-text', cssVar: '--pd-action-button-details-text', value: '#525252' },
  { id: 'pd-action-button-disabled-text', cssVar: '--pd-action-button-disabled-text', value: '#a1a1aa' },
];

let currentTheme: 'dark' | 'light' = 'dark';
const MOCK_COLORS = MOCK_COLORS_DARK;

// ─── Implement specific methods with mock data ───────────────────────────────

// Boot lifecycle
(window as any).extensionSystemIsReady = async () => true;
(window as any).extensionSystemIsExtensionsStarted = async () => true;

// Provider info
(window as any).getProviderInfos = async () => [MOCK_PROVIDER];

// Volumes
(window as any).listVolumes = async () => MOCK_VOLUMES;
(window as any).getVolumeInspect = async (_engine: string, volumeName: string) => {
  const vol = MOCK_VOLUMES[0].Volumes.find(v => v.Name === volumeName);
  return vol ?? {};
};
(window as any).createVolume = async () => {};
(window as any).removeVolume = async () => {};
(window as any).pruneVolumes = async () => '';

// Volume export/import (new APIs — not in upstream yet)
(window as any).exportVolume = async () => {
  await new Promise(r => setTimeout(r, 1500));
};
(window as any).importVolume = async () => {
  await new Promise(r => setTimeout(r, 1500));
};

// File dialogs — return mock paths
(window as any).openDialog = async () => ['/home/user/backups/my-app-data.tar'];
(window as any).saveDialog = async () => ({
  scheme: 'file',
  path: '/home/user/backups/my-app-data.tar',
  fsPath: '/home/user/backups/my-app-data.tar',
  authority: '',
  query: '',
  fragment: '',
});

// Confirmation dialog — always confirm
(window as any).showMessageBox = async () => ({ result: 0 });

// Theme / appearance
(window as any).listColors = async () => (currentTheme === 'dark' ? MOCK_COLORS_DARK : MOCK_COLORS_LIGHT);
(window as any).getConfigurationValue = async (key: string) => {
  if (key === 'preferences.appearance') return currentTheme;
  if (key === 'preferences.ShowBadgeOnDashboard') return false;
  if (key === 'preferences.navigationBarLayout') return 'icon + title';
  if (key === 'welcome.version') return 'already-seen';
  if (key === 'telemetry.check') return true;
  if (key === 'telemetry.enabled') return false;
  return undefined;
};
(window as any).getConfigurationProperties = async () => ({});

// Empty lists for other sections
(window as any).listContainers = async () => [];
(window as any).listImages = async () => [];
(window as any).listPods = async () => [];
(window as any).listNetworks = async () => [];
(window as any).listExtensions = async () => [];
(window as any).listContributions = async () => [];
(window as any).listIcons = async () => [];
(window as any).listOnboarding = async () => [];
(window as any).listNotifications = async () => [];
(window as any).listWebviews = async () => [];
(window as any).listViewsContributions = async () => [];
(window as any).listContexts = async () => [];
(window as any).listFeatures = async () => [];
(window as any).listGuides = async () => [];
(window as any).listExtensionDevelopmentFolders = async () => [];
(window as any).getDocumentationItems = async () => [];
(window as any).getCatalogExtensions = async () => [];
(window as any).getFeaturedExtensions = async () => [];
(window as any).getExtensionBanners = async () => [];
(window as any).getRecommendedRegistries = async () => [];
(window as any).getStatusBarEntries = async () => [];
(window as any).getStatusBarPinOptions = async () => [];
(window as any).getCliToolInfos = async () => [];
(window as any).getImageRegistries = async () => [];
(window as any).getImageSuggestedRegistries = async () => [];
(window as any).getImageRegistryProviderNames = async () => [];
(window as any).getCommandPaletteCommands = async () => [];
(window as any).getCommandPaletteSearchOptions = async () => [];
(window as any).getAuthenticationProvidersInfo = async () => [];
(window as any).getImageCheckerProviders = async () => [];
(window as any).getImageFilesProviders = async () => [];
(window as any).getKubeGeneratorsInfos = async () => [];
(window as any).getKubernetesPortForwards = async () => [];
(window as any).helpMenuGetItems = async () => [];
(window as any).getRegisteredFeatures = async () => [];
(window as any).getContributedMenus = async () => [];
(window as any).getWelcomeMessages = async () => ({ messages: [] });
(window as any).getFeedbackMessages = async () => ({});
(window as any).getTelemetryMessages = async () => ({});
(window as any).getDevtoolsConsoleLogs = async () => [];
(window as any).contextCollectAllValues = async () => ({});

// Kubernetes stubs
(window as any).kubernetesGetCurrentContextName = async () => undefined;
(window as any).kubernetesGetContexts = async () => [];
(window as any).kubernetesGetDetailedContexts = async () => [];
(window as any).kubernetesGetContextsGeneralState = async () => new Map();
(window as any).kubernetesGetCurrentContextGeneralState = async () => ({});
(window as any).kubernetesGetContextsHealths = async () => [];
(window as any).kubernetesGetContextsPermissions = async () => [];
(window as any).kubernetesGetResourcesCount = async () => [];
(window as any).kubernetesGetActiveResourcesCount = async () => [];
(window as any).kubernetesGetClusters = async () => [];
(window as any).kubernetesGetUsers = async () => [];
(window as any).kubernetesGetCurrentNamespace = async () => undefined;
(window as any).kubernetesListNamespaces = async () => ({ items: [] });
(window as any).kubernetesRegisterGetCurrentContextResources = async () => [];
(window as any).kubernetesUnregisterGetCurrentContextResources = async () => [];

// OS info
(window as any).getOsPlatform = async () => 'linux';
(window as any).getOsArch = async () => 'x64';
(window as any).getOsHostname = async () => 'prototype';
(window as any).getOsFreeDiskSize = async () => '100 GB';
(window as any).getOsMemory = async () => '16 GB';
(window as any).getOsCpu = async () => '8 cores';

// Misc
(window as any).getPodmanDesktopVersion = async () => '1.28.0';
(window as any).getTitleBarText = async () => 'Podman Desktop';
(window as any).podmanDesktopUpdateAvailable = async () => false;
(window as any).podmanDesktopGetReleaseNotes = async () => ({ notes: '' });
(window as any).getUrlProtocol = async () => 'podman-desktop';
(window as any).getDashboardSystemOverviewStatus = async () => ({
  containerEngineStatuses: [{ name: 'Podman', status: 'started' }],
  kubernetesStatuses: [],
});
(window as any).getSystemDockerSocketMappingStatus = async () => ({});

// Telemetry — no-op
(window as any).telemetryTrack = async () => {};
(window as any).telemetryPage = async () => {};
(window as any).telemetryConfigure = async () => {};

// Window controls — no-op (hidden via CSS)
(window as any).windowMinimize = async () => {};
(window as any).windowMaximize = async () => {};
(window as any).windowClose = async () => {};

// Column config
(window as any).loadListConfig = async (_kind: string, availableColumns: string[]) => {
  return availableColumns.map((col: string, i: number) => ({
    id: col,
    label: col,
    enabled: true,
    originalOrder: i,
  }));
};
(window as any).saveListConfig = async () => {};
(window as any).resetListConfig = async (_kind: string, availableColumns: string[]) => {
  return availableColumns.map((col: string, i: number) => ({
    id: col,
    label: col,
    enabled: true,
    originalOrder: i,
  }));
};

// ─── Trigger boot lifecycle after a tick ──────────────────────────────────────

setTimeout(() => {
  (window as any).events.send('starting-extensions', 'true');
  window.dispatchEvent(new CustomEvent('system-ready', {}));
  window.dispatchEvent(new CustomEvent('extensions-already-started', {}));
}, 50);

// ─── Inject CSS color variables directly (bypasses ColorsStyle event store) ──

function applyThemeColors(colors: ColorEntry[]): void {
  let el = document.getElementById('mock-preload-colors');
  if (!el) {
    el = document.createElement('style');
    el.id = 'mock-preload-colors';
    document.head.appendChild(el);
  }
  el.textContent = `:root {\n${colors.map(c => `  ${c.cssVar}: ${c.value};`).join('\n')}\n}`;
}

applyThemeColors(MOCK_COLORS_DARK);

// ─── Hide Electron-only UI ───────────────────────────────────────────────────

const staticStyles = document.createElement('style');
staticStyles.textContent = `
  /* Hide Electron window drag region */
  [style*="-webkit-app-region: drag"] {
    -webkit-app-region: no-drag !important;
  }
  /* Hide window control buttons (minimize/maximize/close) */
  .window-controls,
  [class*="WindowControls"],
  [aria-label="Window controls"] {
    display: none !important;
  }
`;
document.head.appendChild(staticStyles);

// ─── Theme toggle button ─────────────────────────────────────────────────────

const toggleBtn = document.createElement('button');
toggleBtn.id = 'theme-toggle';
toggleBtn.textContent = '☀️ Light';
toggleBtn.setAttribute(
  'style',
  [
    'position:fixed',
    'bottom:12px',
    'right:12px',
    'z-index:9999',
    'padding:6px 14px',
    'border-radius:20px',
    'border:1px solid #52525b',
    'background:#27272a',
    'color:#e7e7e7',
    'font-size:13px',
    'font-family:system-ui',
    'cursor:pointer',
    'box-shadow:0 2px 8px rgba(0,0,0,0.3)',
    'transition:all 0.2s',
  ].join(';'),
);

toggleBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const colors = currentTheme === 'dark' ? MOCK_COLORS_DARK : MOCK_COLORS_LIGHT;
  applyThemeColors(colors);
  window.dispatchEvent(new CustomEvent('appearance-changed', {}));
  if (currentTheme === 'dark') {
    toggleBtn.textContent = '☀️ Light';
    toggleBtn.style.background = '#27272a';
    toggleBtn.style.color = '#e7e7e7';
    toggleBtn.style.borderColor = '#52525b';
  } else {
    toggleBtn.textContent = '🌙 Dark';
    toggleBtn.style.background = '#ffffff';
    toggleBtn.style.color = '#1b1b1b';
    toggleBtn.style.borderColor = '#d1d5db';
  }
});

document.addEventListener('DOMContentLoaded', () => document.body.appendChild(toggleBtn));

console.log('[mock-preload] Static prototype mode initialized with mock data.');
