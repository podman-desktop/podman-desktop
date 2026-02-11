/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import '@testing-library/jest-dom/vitest';

import type { ProviderConnectionStatus } from '@podman-desktop/api';
import type { Menu, OnboardingInfo, ProviderInfo } from '@podman-desktop/core-api';
import { CONFIGURATION_DEFAULT_SCOPE } from '@podman-desktop/core-api/configuration';
import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { router } from 'tinro';
import { assert, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { configurationProperties } from '/@/stores/configurationProperties';
import { onboardingList } from '/@/stores/onboarding';
import { providerInfos } from '/@/stores/providers';

import PreferencesResourcesRendering from './PreferencesResourcesRendering.svelte';

const defaultContainerConnectionName = 'machine-default';
const secondaryContainerConnectionName = 'podman-machine-secondary';

const defaultKubernetesConnectionName = 'kluster-default';
const secondaryKubernetesConnectionName = 'kluster-secondary';

const defaultVmConnectionName = 'vm-default';
const secondaryVmConnectionName = 'vm-secondary';

const providerInfo: ProviderInfo = {
  id: 'podman',
  name: 'podman',
  extensionId: 'id',
  images: {
    icon: 'img',
  },
  status: 'started',
  warnings: [],
  containerProviderConnectionCreation: true,
  detectionChecks: [],
  containerConnections: [
    {
      connectionType: 'container',
      name: defaultContainerConnectionName,
      displayName: defaultContainerConnectionName,
      status: 'started',
      endpoint: {
        socketPath: 'socket',
      },
      lifecycleMethods: ['start', 'stop', 'delete'],
      type: 'podman',
      vmType: {
        id: 'libkrun',
        name: 'libkrun',
      },
    },
    {
      connectionType: 'container',
      name: secondaryContainerConnectionName,
      displayName: 'Dummy Secondary Connection',
      status: 'stopped',
      endpoint: {
        socketPath: 'socket',
      },
      lifecycleMethods: ['start', 'stop', 'delete'],
      type: 'podman',
      vmType: {
        id: 'wsl',
        name: 'wsl',
      },
    },
  ],
  installationSupport: false,
  internalId: '0',
  kubernetesConnections: [],
  kubernetesProviderConnectionCreation: true,
  vmConnections: [],
  vmProviderConnectionCreation: false,
  vmProviderConnectionInitialization: false,
  links: [],
  containerProviderConnectionInitialization: false,
  containerProviderConnectionCreationDisplayName: 'Podman machine',
  kubernetesProviderConnectionInitialization: false,
  cleanupSupport: false,
};

// mock the router
vi.mock('tinro', () => {
  return {
    router: {
      goto: vi.fn(),
    },
  };
});

// getOsPlatformMock is needed when using PreferencesResourcesRenderingCopyButton
const getOsPlatformMock = vi.fn().mockResolvedValue('linux');

beforeAll(() => {
  (window.events as unknown) = {
    receive: vi.fn(),
  };
  Object.defineProperty(window, 'telemetryTrack', { value: vi.fn().mockResolvedValue(undefined) });
  Object.defineProperty(window, 'telemetryPage', { value: vi.fn().mockResolvedValue(undefined) });
  Object.defineProperty(window, 'getOsPlatform', { value: getOsPlatformMock });
});

beforeEach(() => {
  onboardingList.set([]);
});

describe.each<{
  label: string;
  providerInfo: ProviderInfo;
  setDisplayName: (info: ProviderInfo, displayName?: string) => void;
  setButtonTitle: (info: ProviderInfo, buttonTitle?: string) => void;
  setConnectionStatus: (info: ProviderInfo, n: number, status: ProviderConnectionStatus) => void;
  defaultName: string;
  startFailedImplemented: boolean;
}>([
  {
    label: 'container connections',
    setDisplayName: (info: ProviderInfo, displayName?: string): void => {
      info.containerProviderConnectionCreationDisplayName = displayName;
    },
    setButtonTitle: (info: ProviderInfo, buttonTitle?: string): void => {
      info.containerProviderConnectionCreationButtonTitle = buttonTitle;
    },
    setConnectionStatus: (info: ProviderInfo, n: number, status: ProviderConnectionStatus): void => {
      info.containerConnections[n].status = status;
    },
    defaultName: defaultContainerConnectionName,
    providerInfo: {
      id: 'podman',
      name: 'podman',
      extensionId: 'id',
      images: {
        icon: 'img',
      },
      status: 'started',
      warnings: [],
      containerProviderConnectionCreation: true,
      detectionChecks: [],
      containerConnections: [
        {
          connectionType: 'container',
          name: defaultContainerConnectionName,
          displayName: defaultContainerConnectionName,
          status: 'started',
          endpoint: {
            socketPath: 'socket',
          },
          lifecycleMethods: ['start', 'stop', 'delete'],
          type: 'podman',
          vmType: {
            id: 'libkrun',
            name: 'libkrun',
          },
        },
        {
          connectionType: 'container',
          name: secondaryContainerConnectionName,
          displayName: 'Dummy Secondary Connection',
          status: 'stopped',
          endpoint: {
            socketPath: 'socket',
          },
          lifecycleMethods: ['start', 'stop', 'delete'],
          type: 'podman',
          vmType: {
            id: 'wsl',
            name: 'wsl',
          },
        },
      ],
      installationSupport: false,
      internalId: '0',
      kubernetesConnections: [],
      kubernetesProviderConnectionCreation: false,
      vmConnections: [],
      vmProviderConnectionCreation: false,
      vmProviderConnectionInitialization: false,
      links: [],
      containerProviderConnectionInitialization: false,
      containerProviderConnectionCreationDisplayName: 'Podman machine',
      kubernetesProviderConnectionInitialization: false,
      cleanupSupport: false,
    },
    startFailedImplemented: true,
  },
  {
    label: 'kubernetes connections',
    setDisplayName: (info: ProviderInfo, displayName?: string): void => {
      info.kubernetesProviderConnectionCreationDisplayName = displayName;
    },
    setButtonTitle: (info: ProviderInfo, buttonTitle?: string): void => {
      info.kubernetesProviderConnectionCreationButtonTitle = buttonTitle;
    },
    setConnectionStatus: (info: ProviderInfo, n: number, status: ProviderConnectionStatus): void => {
      info.kubernetesConnections[n].status = status;
    },
    defaultName: defaultKubernetesConnectionName,
    providerInfo: {
      id: 'kube',
      name: 'kube-provider',
      extensionId: 'id',
      images: {
        icon: 'img',
      },
      status: 'started',
      warnings: [],
      containerProviderConnectionCreation: false,
      detectionChecks: [],
      kubernetesConnections: [
        {
          connectionType: 'kubernetes',
          name: defaultKubernetesConnectionName,
          status: 'started',
          endpoint: {
            apiURL: 'url',
          },
          lifecycleMethods: ['start', 'stop', 'delete'],
        },
        {
          connectionType: 'kubernetes',
          name: secondaryKubernetesConnectionName,
          status: 'stopped',
          endpoint: {
            apiURL: 'url',
          },
          lifecycleMethods: ['start', 'stop', 'delete'],
        },
      ],
      installationSupport: false,
      internalId: '0',
      containerConnections: [],
      kubernetesProviderConnectionCreation: true,
      vmConnections: [],
      vmProviderConnectionCreation: false,
      vmProviderConnectionInitialization: false,
      links: [],
      containerProviderConnectionInitialization: false,
      kubernetesProviderConnectionCreationDisplayName: 'Kluster',
      kubernetesProviderConnectionInitialization: false,
      cleanupSupport: false,
    },
    startFailedImplemented: false,
  },
  {
    label: 'VM connections',
    setDisplayName: (info: ProviderInfo, displayName?: string): void => {
      info.vmProviderConnectionCreationDisplayName = displayName;
    },
    setButtonTitle: (info: ProviderInfo, buttonTitle?: string): void => {
      info.vmProviderConnectionCreationButtonTitle = buttonTitle;
    },
    setConnectionStatus: (info: ProviderInfo, n: number, status: ProviderConnectionStatus): void => {
      info.vmConnections[n].status = status;
    },
    defaultName: defaultVmConnectionName,
    providerInfo: {
      id: 'vm',
      name: 'vm-provider',
      extensionId: 'id',
      images: {
        icon: 'img',
      },
      status: 'started',
      warnings: [],
      containerProviderConnectionCreation: false,
      detectionChecks: [],
      vmConnections: [
        {
          connectionType: 'vm',
          name: defaultVmConnectionName,
          status: 'started',
          lifecycleMethods: ['start', 'stop', 'delete'],
        },
        {
          connectionType: 'vm',
          name: secondaryVmConnectionName,
          status: 'stopped',
          lifecycleMethods: ['start', 'stop', 'delete'],
        },
      ],
      installationSupport: false,
      internalId: '0',
      containerConnections: [],
      kubernetesProviderConnectionCreation: false,
      kubernetesConnections: [],
      vmProviderConnectionCreation: true,
      vmProviderConnectionInitialization: false,
      links: [],
      containerProviderConnectionInitialization: false,
      kubernetesProviderConnectionInitialization: false,
      cleanupSupport: false,
    },
    startFailedImplemented: true,
  },
])(`$label`, ({
  label: _label,
  setDisplayName,
  setButtonTitle,
  setConnectionStatus,
  providerInfo,
  defaultName,
  startFailedImplemented,
}) => {
  test('Expect to see elements regarding default provider name', async () => {
    // clone providerInfo and change id to foo
    const customProviderInfo: ProviderInfo = { ...providerInfo };
    // remove display name
    setDisplayName(customProviderInfo, undefined);
    // change name of the provider
    customProviderInfo.name = 'foo-provider';
    providerInfos.set([customProviderInfo]);
    render(PreferencesResourcesRendering, {});
    const button = screen.getByRole('button', { name: 'Create new foo-provider' });
    expect(button).toBeInTheDocument();
    // expect default create title
    expect(button).toHaveTextContent('Create new ...');
  });

  test('Expect to see elements regarding foo provider', async () => {
    // clone providerInfo and change id to foo
    const customProviderInfo: ProviderInfo = { ...providerInfo };
    setDisplayName(customProviderInfo, 'foo');
    setButtonTitle(customProviderInfo, 'Connect');
    providerInfos.set([customProviderInfo]);
    render(PreferencesResourcesRendering, {});
    const button = screen.getByRole('button', { name: 'Create new foo' });
    expect(button).toBeInTheDocument();
    // expect custom create title
    expect(button).toHaveTextContent('Connect ...');
  });

  test('Expect to scroll to the focused element if focus prop is provided', async () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    const customProviderInfo: ProviderInfo = {
      ...providerInfo,
      id: 'test-provider',
      name: 'Test Provider',
    };
    providerInfos.set([customProviderInfo]);
    render(PreferencesResourcesRendering, { focus: 'test-provider' });
    await vi.waitFor(() => {
      // Check if scrollIntoView was called
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
    });
  });

  describe('provider connections', () => {
    test('Expect to have two container connection region', () => {
      providerInfos.set([providerInfo]);
      const { getAllByLabelText } = render(PreferencesResourcesRendering, {});

      const statuses = getAllByLabelText('Connection Status');
      expect(statuses.length).toBe(2);
    });

    test('Expect to be start, delete actions enabled and stop, restart disabled when container stopped', async () => {
      const customProviderInfo: ProviderInfo = { ...providerInfo };
      setConnectionStatus(customProviderInfo, 0, 'stopped');
      providerInfos.set([customProviderInfo]);
      const { getByRole } = render(PreferencesResourcesRendering, {});

      // get the region containing the content for the default connection
      const region = getByRole('region', { name: defaultName });

      const startButton = within(region).getByRole('button', { name: 'Start' });
      expect(startButton).toBeInTheDocument();
      expect(!startButton.classList.contains('cursor-not-allowed')).toBeTruthy();
      const stopButton = within(region).getByRole('button', { name: 'Stop' });
      expect(stopButton).toBeInTheDocument();
      expect(stopButton.classList.contains('cursor-not-allowed')).toBeTruthy();
      const restartButton = within(region).getByRole('button', { name: 'Restart' });
      expect(restartButton).toBeInTheDocument();
      expect(restartButton.classList.contains('cursor-not-allowed')).toBeTruthy();
      const deleteButton = within(region).getByRole('button', { name: 'Delete' });
      expect(deleteButton).toBeInTheDocument();
      expect(!deleteButton.classList.contains('cursor-not-allowed')).toBeTruthy();
    });

    test('Expect to be start, delete actions disabled and stop, restart enabled when container running', async () => {
      const customProviderInfo: ProviderInfo = { ...providerInfo };
      setConnectionStatus(customProviderInfo, 0, 'started');
      providerInfos.set([customProviderInfo]);
      const { getByRole } = render(PreferencesResourcesRendering, {});

      // get the region containing the content for the default connection
      const region = getByRole('region', { name: defaultName });

      const startButton = within(region).getByRole('button', { name: 'Start' });
      expect(startButton).toBeInTheDocument();
      expect(startButton.classList.contains('cursor-not-allowed')).toBeTruthy();
      const stopButton = within(region).getByRole('button', { name: 'Stop' });
      expect(stopButton).toBeInTheDocument();
      expect(!stopButton.classList.contains('cursor-not-allowed')).toBeTruthy();
      const restartButton = within(region).getByRole('button', { name: 'Restart' });
      expect(restartButton).toBeInTheDocument();
      expect(!restartButton.classList.contains('cursor-not-allowed')).toBeTruthy();
      const deleteButton = within(region).getByRole('button', { name: 'Delete' });
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton.classList.contains('cursor-not-allowed')).toBeTruthy();
    });

    test('click restart when connection is running', async () => {
      const customProviderInfo: ProviderInfo = { ...providerInfo };
      setConnectionStatus(customProviderInfo, 0, 'started');
      providerInfos.set([customProviderInfo]);
      const { getByRole } = render(PreferencesResourcesRendering, {});

      // get the region containing the content for the default connection
      const region = getByRole('region', { name: defaultName });

      const restartButton = within(region).getByRole('button', { name: 'Restart' });
      expect(restartButton).toBeInTheDocument();
      expect(!restartButton.classList.contains('cursor-not-allowed')).toBeTruthy();
      await userEvent.click(restartButton);
      setConnectionStatus(customProviderInfo, 0, 'stopped');
      providerInfos.set([customProviderInfo]);
      expect(vi.mocked(window.startProviderConnectionLifecycle)).toHaveBeenCalled();
    });

    test(
      'click start and make it fail',
      {
        skip: !startFailedImplemented,
      },
      async () => {
        const customProviderInfo: ProviderInfo = { ...providerInfo };
        setConnectionStatus(customProviderInfo, 0, 'stopped');
        providerInfos.set([customProviderInfo]);
        const { getByRole, getByLabelText } = render(PreferencesResourcesRendering, {});

        // get the region containing the content for the default connection
        const region = getByRole('region', { name: defaultName });

        const startButton = within(region).getByRole('button', { name: 'Start' });
        expect(startButton).toBeInTheDocument();
        expect(!startButton.classList.contains('cursor-not-allowed')).toBeTruthy();
        vi.mocked(window.startProviderConnectionLifecycle).mockClear();
        await userEvent.click(startButton);
        expect(window.startProviderConnectionLifecycle).toHaveBeenCalledOnce();
        const call = vi.mocked(window.startProviderConnectionLifecycle).mock.calls[0];
        const key = call[2];
        const logger = call[3];
        assert(!!logger);
        logger(key, 'error', ['an error']);
        await vi.waitFor(() => {
          getByLabelText(/failed/);
        });
      },
    );
  });

  test('Expect to redirect to create New page if provider is installed', async () => {
    // clone providerInfo and change id and status
    const customProviderInfo: ProviderInfo = { ...providerInfo };
    // remove display name
    setDisplayName(customProviderInfo, undefined);
    // change name of the provider
    customProviderInfo.name = 'foo-provider';
    providerInfos.set([customProviderInfo]);
    render(PreferencesResourcesRendering, {});
    const button = screen.getByRole('button', { name: 'Create new foo-provider' });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    // telemetry sent
    expect(window.telemetryTrack).toBeCalledWith('createNewProviderConnectionPageRequested', {
      providerId: customProviderInfo.id,
      name: customProviderInfo.name,
    });
    // redirect to create new page
    expect(router.goto).toHaveBeenCalledWith(`/preferences/provider/${customProviderInfo.internalId}`);
  });

  test('Expect to display the dialog if missing requirements for installation', async () => {
    const installPreflightMock = vi.fn().mockResolvedValue(false);
    const installProviderMock = vi.fn().mockResolvedValue(undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).runInstallPreflightChecks = installPreflightMock;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).installProvider = installProviderMock;
    // clone providerInfo and change id and status
    const customProviderInfo: ProviderInfo = { ...providerInfo };
    // remove display name
    setDisplayName(customProviderInfo, undefined);
    // change name of the provider
    customProviderInfo.status = 'not-installed';
    customProviderInfo.name = 'foo-provider';
    providerInfos.set([customProviderInfo]);
    render(PreferencesResourcesRendering, {});
    const button = screen.getByRole('button', { name: 'Create new foo-provider' });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    // provider is not installed, it checks the requirements, something fails and the dialog about missing reqs is shown
    expect(installPreflightMock).toBeCalled();
    expect(installProviderMock).not.toHaveBeenCalled();
    const modal = screen.getByLabelText('install provider');
    expect(modal).toBeInTheDocument();
  });

  test('Expect to directly install the provider if requirements are met', async () => {
    const installPreflightMock = vi.fn().mockResolvedValue(true);
    const installProviderMock = vi.fn().mockResolvedValue(undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).runInstallPreflightChecks = installPreflightMock;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).installProvider = installProviderMock;
    // clone providerInfo and change id and status
    const customProviderInfo: ProviderInfo = { ...providerInfo };
    // remove display name
    setDisplayName(customProviderInfo, undefined);
    // change name of the provider
    customProviderInfo.status = 'not-installed';
    customProviderInfo.name = 'foo-provider';
    providerInfos.set([customProviderInfo]);
    render(PreferencesResourcesRendering, {});
    const button = screen.getByRole('button', { name: 'Create new foo-provider' });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    // all requirements are met so the installProvider function is called
    expect(installPreflightMock).toBeCalled();
    expect(installProviderMock).toBeCalled();
  });

  test('Expect to redirect to onboarding page if setup button is clicked', async () => {
    // clone providerInfo and change id and status
    const customProviderInfo: ProviderInfo = { ...providerInfo };
    // remove display name
    setDisplayName(customProviderInfo, undefined);
    customProviderInfo.status = 'not-installed';
    // change name of the provider
    customProviderInfo.name = 'foo-provider';
    providerInfos.set([customProviderInfo]);

    const onboarding: OnboardingInfo = {
      extension: 'id',
      removable: true,
      steps: [],
      title: 'onboarding',
      enablement: 'true',
      name: 'foobar',
      displayName: 'FooBar',
      icon: 'data:image/png;base64,foobar',
    };
    onboardingList.set([onboarding]);
    render(PreferencesResourcesRendering, {});
    const button = screen.getByRole('button', { name: 'Setup foo-provider' });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    // redirect to create new page
    expect(router.goto).toHaveBeenCalledWith(`/preferences/onboarding/id`);
  });

  test('Expect setup button to appear even if provider status is set to unknown and enablement is true', async () => {
    const customProviderInfo: ProviderInfo = { ...providerInfo };
    setDisplayName(customProviderInfo, undefined);
    customProviderInfo.status = 'unknown';
    customProviderInfo.name = 'foobar';
    providerInfos.set([customProviderInfo]);

    // Onboarding is enabled
    const onboarding: OnboardingInfo = {
      extension: 'id',
      removable: true,
      steps: [],
      title: 'onboarding',
      enablement: 'true',
      name: 'foobar',
      displayName: 'FooBar',
      icon: 'data:image/png;base64,foobar',
    };
    onboardingList.set([onboarding]);
    render(PreferencesResourcesRendering, {});

    // Expect the setup button to appear
    const button = screen.getByRole('button', { name: 'Setup foobar' });
    expect(button).toBeInTheDocument();
  });

  test('Expect to redirect to extension preferences page if onboarding is disabled and the cog button is clicked', async () => {
    // clone providerInfo and change id and status
    const customProviderInfo: ProviderInfo = { ...providerInfo };
    // remove display name
    setDisplayName(customProviderInfo, undefined);
    customProviderInfo.status = 'installed';
    // change name of the provider
    customProviderInfo.name = 'foo-provider';
    providerInfos.set([customProviderInfo]);

    configurationProperties.set([
      {
        parentId: 'preferences.id',
        title: 'record',
        placeholder: 'Example: text',
        description: 'record-description',
        extension: {
          id: 'extension',
        },
        hidden: false,
        id: 'extension.format.prop',
        type: 'string',
        format: 'file',
        scope: CONFIGURATION_DEFAULT_SCOPE,
      },
    ]);

    const onboarding: OnboardingInfo = {
      extension: 'id',
      removable: true,
      steps: [],
      title: 'onboarding',
      enablement: 'false',
      name: 'foobar',
      displayName: 'FooBar',
      icon: 'data:image/png;base64,foobar',
    };
    onboardingList.set([onboarding]);
    render(PreferencesResourcesRendering, {});
    const button = screen.getByRole('button', { name: 'Setup foo-provider' });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    // redirect to create new page
    expect(router.goto).toHaveBeenCalledWith('/preferences/default/preferences.id');
  });

  test('Expect to not have cog icon button if provider has no active onboarding nor configurations', async () => {
    // clone providerInfo and change id and status
    const customProviderInfo: ProviderInfo = { ...providerInfo };
    // remove display name
    setDisplayName(customProviderInfo, undefined);
    customProviderInfo.status = 'installed';
    // change name of the provider
    customProviderInfo.name = 'foo-provider';
    providerInfos.set([customProviderInfo]);
    configurationProperties.set([]);

    const onboarding: OnboardingInfo = {
      extension: 'id',
      removable: true,
      steps: [],
      title: 'onboarding',
      enablement: 'false',
      name: 'foobar',
      displayName: 'FooBar',
      icon: 'data:image/png;base64,foobar',
    };
    onboardingList.set([onboarding]);
    render(PreferencesResourcesRendering, {});
    const button = screen.queryByRole('button', { name: 'Setup foo-provider' });
    expect(button).not.toBeInTheDocument();
  });

  test('Expect to not have cog icon button if provider has no onboarding nor configurations', async () => {
    // clone providerInfo and change id and status
    const customProviderInfo: ProviderInfo = { ...providerInfo };
    // remove display name
    setDisplayName(customProviderInfo, undefined);
    customProviderInfo.status = 'installed';
    // change name of the provider
    customProviderInfo.name = 'foo-provider';
    providerInfos.set([customProviderInfo]);
    configurationProperties.set([]);

    onboardingList.set([]);
    render(PreferencesResourcesRendering, {});
    const button = screen.queryByRole('button', { name: 'Setup foo-provider' });
    expect(button).not.toBeInTheDocument();
  });

  test('Expect to redirect to extension onboarding page if onboarding is enabled and the cog button is clicked', async () => {
    // clone providerInfo and change id and status
    const customProviderInfo: ProviderInfo = { ...providerInfo };
    // remove display name
    setDisplayName(customProviderInfo, undefined);
    customProviderInfo.status = 'installed';
    // change name of the provider
    customProviderInfo.name = 'foo-provider';
    providerInfos.set([customProviderInfo]);

    const onboarding: OnboardingInfo = {
      extension: 'id',
      removable: true,
      steps: [],
      title: 'onboarding',
      enablement: 'true',
      name: 'foobar',
      displayName: 'FooBar',
      icon: 'data:image/png;base64,foobar',
    };
    onboardingList.set([onboarding]);
    render(PreferencesResourcesRendering, {});
    const button = screen.getByRole('button', { name: 'Setup foo-provider' });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    // redirect to create new page
    expect(router.goto).toHaveBeenCalledWith('/preferences/onboarding/id');
  });
});

test('Expect to see elements regarding podman provider', async () => {
  providerInfos.set([providerInfo]);
  render(PreferencesResourcesRendering, {});
  const button = screen.getByRole('button', { name: 'Create new Podman machine' });
  expect(button).toBeInTheDocument();
});

describe('container provider connections', () => {
  test('Expect custom action to be there', async () => {
    //provide a single connection provider
    const singleProvider: ProviderInfo = structuredClone(providerInfo);
    singleProvider.containerConnections = [providerInfo.containerConnections[0]];
    singleProvider.containerConnections[0].status = 'started';
    providerInfos.set([singleProvider]);
    const menus: Menu[] = [
      { command: 'contributed-command.1', title: 'My Contributed Command 1' },
      {
        command: 'contributed-command.2',
        title: 'My Contributed Command 2',
        when: 'selectedProviderConnectionStatus.status === "stopped"',
      },
    ];
    vi.mocked(window.getContributedMenus).mockResolvedValue(menus);
    render(PreferencesResourcesRendering, {});

    const kebabMenuButton = screen.getByRole('button', { name: 'kebab menu' });
    // click on the kebab menu
    await userEvent.click(kebabMenuButton);

    // get the menu items
    const command1 = await vi.waitFor(() => screen.getByText(/my contributed command 1/i));
    expect(command1).toBeInTheDocument();

    // This command should be hidden to the when clause
    const command2 = screen.queryByText(/my contributed command 2/i);
    expect(command2).not.toBeInTheDocument();

    // click on it
    await userEvent.click(command1);

    // expect that command has been called
    expect(window.executeCommand).toBeCalledWith('contributed-command.1', expect.anything());
  });

  test('Expect type to be reported for Podman engines', async () => {
    providerInfos.set([providerInfo]);

    const { getByRole } = render(PreferencesResourcesRendering, {});

    // get the region containing the content for the default connection
    const region = getByRole('region', { name: defaultContainerConnectionName });

    const typeDiv = within(region).getByLabelText(`${defaultContainerConnectionName} type`);
    expect(typeDiv.textContent).toBe('Podman endpoint');
    const endpointSpan = await vi.waitFor(() => within(region).getByTitle('unix://socket'));
    expect(endpointSpan.textContent).toBe('unix://socket');
    const connectionType = within(region).getByLabelText('Connection Type');
    expect(connectionType.textContent).equal('Libkrun');
  });

  test('Expect type to be reported for Docker engines', async () => {
    providerInfo.containerConnections[0].type = 'docker';
    providerInfos.set([providerInfo]);

    const { getByRole } = render(PreferencesResourcesRendering, {});

    // get the region containing the content for the default connection
    const region = getByRole('region', { name: defaultContainerConnectionName });

    const typeDiv = within(region).getByLabelText(`${defaultContainerConnectionName} type`);
    expect(typeDiv.textContent).toBe('Docker endpoint');
    const endpointSpan = await vi.waitFor(() => within(region).getByTitle('unix://socket'));
    expect(endpointSpan.textContent).toBe('unix://socket');
  });

  test('Expect display name to be used in favor of name when available', async () => {
    providerInfos.set([providerInfo]);

    const { getByRole } = render(PreferencesResourcesRendering, {});

    // get the region containing the content for the default connection
    const region = getByRole('region', { name: secondaryContainerConnectionName });

    const text = within(region).getByText('Dummy Secondary Connection');
    expect(text).toBeDefined();
  });
});

test('Expect to see the no resource message when there is no providers', async () => {
  providerInfos.set([]);
  render(PreferencesResourcesRendering, {});
  const panel = screen.getByLabelText('no-resource-panel');
  expect(panel).toBeInTheDocument();
});

test('Expect update button to show up when an update is available to a new version', async () => {
  vi.mocked(window.runUpdatePreflightChecks).mockResolvedValue(true);
  vi.mocked(window.updateProvider).mockResolvedValue([{ name: 'podman', status: true }]);
  providerInfos.set([providerInfo]);
  const component = render(PreferencesResourcesRendering, {});
  let updateButton = screen.queryByText('Update to');
  expect(updateButton).not.toBeInTheDocument();

  providerInfos.set([{ ...providerInfo, version: '0.0.1', updateInfo: { version: '0.0.2' } }]);
  await component.rerender({});
  updateButton = screen.getByText('Update to 0.0.2');
  expect(updateButton).toBeInTheDocument();

  await userEvent.click(updateButton);
  expect(window.runUpdatePreflightChecks).toHaveBeenCalled();
  expect(window.updateProvider).toHaveBeenCalled();
});
