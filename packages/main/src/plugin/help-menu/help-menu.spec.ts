/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
import { expect, test, vi } from 'vitest';

import type { IPCHandle } from '/@/plugin/api.js';
import type { ConfigurationRegistry } from '/@/plugin/configuration-registry.js';

import { HelpMenu } from './help-menu.js';

const ipcHandle: IPCHandle = vi.fn();

const registerConfigurationsMock = vi.fn();
const configurationRegistryMock = {
  registerConfigurations: registerConfigurationsMock,
} as unknown as ConfigurationRegistry;

const productConfigPropertyName = 'helpMenu.useProductConfig';
test('should register a configuration', async () => {
  vi.stubEnv('DEV', true);
  const helpMenu = new HelpMenu(configurationRegistryMock, ipcHandle);
  helpMenu.init();

  expect(configurationRegistryMock.registerConfigurations).toBeCalled();
  const configurationNode = vi.mocked(configurationRegistryMock.registerConfigurations).mock.calls[0]?.[0][0];
  expect(configurationNode?.id).toBe('preferences.experimental.helpMenu');
  expect(configurationNode?.title).toBe('Experimental (Help menu)');
  expect(configurationNode?.properties).toBeDefined();
  expect(Object.keys(configurationNode?.properties ?? {}).length).toBe(1);
  expect(configurationNode?.properties?.[productConfigPropertyName]).toBeDefined();
  expect(configurationNode?.properties?.[productConfigPropertyName]?.type).toBe('object');
  expect(configurationNode?.properties?.[productConfigPropertyName]?.description).toBe(
    'Replace help menu with the one defined in the product',
  );

  expect(configurationNode?.properties?.[productConfigPropertyName]?.experimental).toStrictEqual({});
});

test('Undefined should be default if not in dev env', () => {
  vi.resetAllMocks();
  vi.stubEnv('DEV', false);
  const helpMenu = new HelpMenu(configurationRegistryMock, ipcHandle);
  helpMenu.init();

  expect(configurationRegistryMock.registerConfigurations).toBeCalled();
  const configurationNode = vi.mocked(configurationRegistryMock.registerConfigurations).mock.calls[0]?.[0][0];

  expect(configurationNode?.properties?.[productConfigPropertyName]?.default).toBe(undefined);
});

test('should get the items', async () => {
  const helpMenu = new HelpMenu(configurationRegistryMock, ipcHandle);
  helpMenu.init();

  expect(helpMenu.getItems()).toStrictEqual([
    {
      action: {
        kind: 'Link',
        parameter: 'https://www.podman-desktop.io/docs/intro',
      },
      enabled: true,
      icon: 'fas fa-external-link-alt',
      title: 'Getting Started',
    },
    {
      action: {
        kind: 'Command',
        parameter: 'troubleshooting',
      },
      enabled: true,
      icon: 'fas fa-lightbulb',
      title: 'Troubleshooting',
    },
    {
      action: {
        kind: 'Link',
        parameter: 'https://github.com/podman-desktop/podman-desktop/issues/new/choose',
      },
      enabled: true,
      icon: 'fas fa-exclamation-triangle',
      title: 'Report a Bug',
    },
    {
      action: {
        kind: 'Command',
        parameter: 'feedback',
      },
      enabled: true,
      icon: 'far fa-comment',
      title: 'Share Your Feedback',
    },
    {
      enabled: false,
      icon: 'fas fa-list-ul',
      title: 'Community',
    },
    {
      action: {
        kind: 'Link',
        parameter: 'https://discord.com/invite/x5GzFF6QH4',
      },
      enabled: true,
      icon: 'fab fa-discord',
      title: '#podman-desktop',
      tooltip: 'Join Discord #podman-desktop channel',
    },
    {
      action: {
        kind: 'Link',
        parameter: 'https://slack.k8s.io',
      },
      enabled: true,
      icon: 'fab fa-slack',
      title: '#podman-desktop',
      tooltip: 'Join Slack #podman-desktop channel',
    },
  ]);
});
