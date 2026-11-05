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

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { router } from 'tinro';
import { afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';

import ContributionActions from '/@/lib/actions/ContributionActions.svelte';
import { ContextUI } from '/@/lib/context/context';
import { containersInfos, setContainerActionError, setContainerStatus } from '/@/stores/containers';
import { context } from '/@/stores/context';

import ContainerActions from './ContainerActions.svelte';
import type { ContainerInfoUI } from './ContainerInfoUI';

// ContainerActions reads the container from $containersInfos (to compute the fallback
// state/error when clearing the in-progress flag) and writes through setContainerStatus /
// setContainerActionError. Keep the real store (so the component's lookup works and the
// store advances between the "start" and "end" calls of the same action) but spy on the
// two write helpers so we can assert what the component calls them with.
vi.mock(import('/@/stores/containers'), async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    setContainerStatus: vi.fn(actual.setContainerStatus),
    setContainerActionError: vi.fn(actual.setContainerActionError),
  };
});

class ContainerInfoUIImpl {
  #actionError: string = '';
  constructor(
    public id: string,
    public engineId: string,
  ) {}
  set actionError(error: string) {
    this.#actionError = error;
  }
  get actionError(): string {
    return this.#actionError;
  }
}

const container: ContainerInfoUI = new ContainerInfoUIImpl(
  'container-id',
  'container-engine-id',
) as unknown as ContainerInfoUI;

const getContributedMenusMock = vi.fn();

vi.mock(import('/@/lib/actions/ContributionActions.svelte'));

beforeAll(() => {
  Object.defineProperty(window, 'startContainer', { value: vi.fn() });
  Object.defineProperty(window, 'unpauseContainer', { value: vi.fn() });
  Object.defineProperty(window, 'stopContainer', { value: vi.fn() });
  Object.defineProperty(window, 'restartContainer', { value: vi.fn() });
  Object.defineProperty(window, 'deleteContainer', { value: vi.fn() });
  Object.defineProperty(window, 'openExternal', { value: vi.fn() });

  Object.defineProperty(window, 'getContributedMenus', { value: getContributedMenusMock });
});

beforeEach(() => {
  getContributedMenusMock.mockResolvedValue([]);
  containersInfos.set([
    {
      id: 'container-id',
      engineId: 'container-engine-id',
      state: 'STOPPED',
      actionInProgress: false,
      actionError: '',
    } as ContainerInfoUI,
  ]);
});

afterEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
});

test('Expect no error and status starting container', async () => {
  render(ContainerActions, { container });

  // click on start button
  const startButton = screen.getByRole('button', { name: 'Start Container' });
  await fireEvent.click(startButton);

  expect(setContainerStatus).toHaveBeenNthCalledWith(1, container.engineId, container.id, 'STARTING', true, '');
  // once the action resolves, the in-progress flag is cleared while the state is kept
  await waitFor(() =>
    expect(setContainerStatus).toHaveBeenNthCalledWith(2, container.engineId, container.id, 'STARTING', false, ''),
  );
  expect(setContainerActionError).not.toHaveBeenCalled();
});

test('Expect no error and status stopping container', async () => {
  render(ContainerActions, { container });

  // click on stop button
  const stopButton = screen.getByRole('button', { name: 'Stop Container' });
  await fireEvent.click(stopButton);

  expect(setContainerStatus).toHaveBeenNthCalledWith(1, container.engineId, container.id, 'STOPPING', true, '');
  await waitFor(() =>
    expect(setContainerStatus).toHaveBeenNthCalledWith(2, container.engineId, container.id, 'STOPPING', false, ''),
  );
  expect(setContainerActionError).not.toHaveBeenCalled();
});

test('Expect no error and status starting for paused container', async () => {
  // set container state to paused
  container.state = 'PAUSED';
  render(ContainerActions, { container });

  // click on start button
  const startButton = screen.getByRole('button', { name: 'Start Container' });
  await fireEvent.click(startButton);

  expect(setContainerStatus).toHaveBeenNthCalledWith(1, container.engineId, container.id, 'STARTING', true, '');
  expect(window.unpauseContainer).toHaveBeenCalled();
  expect(window.startContainer).not.toHaveBeenCalled();
  await waitFor(() =>
    expect(setContainerStatus).toHaveBeenNthCalledWith(2, container.engineId, container.id, 'STARTING', false, ''),
  );
  expect(setContainerActionError).not.toHaveBeenCalled();
});

test('Expect error and status error for unpausing container', async () => {
  // set container state to paused
  container.state = 'PAUSED';
  const error = new Error('unpause failed');
  render(ContainerActions, { container });

  vi.mocked(window.unpauseContainer).mockRejectedValue(error);

  // click on start button
  const startButton = screen.getByRole('button', { name: 'Start Container' });
  await fireEvent.click(startButton);

  expect(window.unpauseContainer).toHaveBeenCalled();
  expect(window.startContainer).not.toHaveBeenCalled();
  await waitFor(() =>
    expect(setContainerActionError).toHaveBeenCalledWith(
      container.engineId,
      container.id,
      expect.stringContaining('unpause failed'),
    ),
  );
  // the finally block re-applies the ERROR state set by handleError, without clearing the message
  await waitFor(() =>
    expect(setContainerStatus).toHaveBeenLastCalledWith(
      container.engineId,
      container.id,
      'ERROR',
      false,
      expect.stringContaining('unpause failed'),
    ),
  );
});

test('Expect no error and status restarting container', async () => {
  render(ContainerActions, { container });

  // click on restart button
  const restartButton = screen.getByRole('button', { name: 'Restart Container' });
  await fireEvent.click(restartButton);

  expect(setContainerStatus).toHaveBeenNthCalledWith(1, container.engineId, container.id, 'RESTARTING', true, '');
  await waitFor(() =>
    expect(setContainerStatus).toHaveBeenNthCalledWith(2, container.engineId, container.id, 'RESTARTING', false, ''),
  );
  expect(setContainerActionError).not.toHaveBeenCalled();
});

test('Expect no error and status deleting container', async () => {
  // Mock the showMessageBox to return 'Delete' (confirmed)
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 'Delete' });
  render(ContainerActions, { container });

  // click on delete button
  const deleteButton = screen.getByRole('button', { name: 'Delete Container' });
  await fireEvent.click(deleteButton);

  // Wait for confirmation modal to disappear after clicking on delete
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

  expect(setContainerStatus).toHaveBeenNthCalledWith(1, container.engineId, container.id, 'DELETING', true, '');
  await waitFor(() =>
    expect(setContainerStatus).toHaveBeenNthCalledWith(2, container.engineId, container.id, 'DELETING', false, ''),
  );
  expect(setContainerActionError).not.toHaveBeenCalled();
});

test('Expect exportContainerInfo is filled and user redirected to export container page', async () => {
  const goToMock = vi.spyOn(router, 'goto');

  render(ContainerActions, { container });
  const exportButton = screen.getByRole('button', { name: 'Export Container' });
  await fireEvent.click(exportButton);

  expect(goToMock).toBeCalledWith('/containers/container-id/export');
});

test('Expect Deploy to Kubernetes to redirect to expected page', async () => {
  const goToMock = vi.spyOn(router, 'goto');

  render(ContainerActions, { container });
  const deployButton = screen.getByRole('button', { name: 'Deploy to Kubernetes' });
  await fireEvent.click(deployButton);

  expect(goToMock).toBeCalledWith(`/deploy-to-kube/container-id/container-engine-id`);
});

test('Expect Generate Kube to redirect to expected page', async () => {
  const goToMock = vi.spyOn(router, 'goto');

  render(ContainerActions, { container });
  const deployButton = screen.getByRole('button', { name: 'Generate Kube' });
  await fireEvent.click(deployButton);

  expect(goToMock).toBeCalledWith(`/containers/container-id/kube`);
});

test('Expect ContributionsAction component is created with a contextUI containing containerImageName', async () => {
  const contributionActionsMock = vi.mocked(ContributionActions);
  const containerWithImageName = new ContainerInfoUIImpl(
    'container-id',
    'container-engine-id',
  ) as unknown as ContainerInfoUI;
  containerWithImageName.image = 'quay.io/user/my-image';
  const ctx = new ContextUI();
  ctx.setValue('key1', 'value1');
  context.set(ctx);
  render(ContainerActions, { container: containerWithImageName });
  await vi.waitFor(() => {
    expect(contributionActionsMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        contextUI: {
          _value: {
            containerImageName: 'quay.io/user/my-image',
            key1: 'value1',
          },
        },
      }),
    );
  });
});

function runningContainerWithPorts(ports: { PublicPort: number; PrivatePort: number; IP?: string }[]): ContainerInfoUI {
  return {
    id: 'container-id',
    engineId: 'container-engine-id',
    name: 'my-container',
    state: 'RUNNING',
    hasPublicPort: ports.length > 0,
    openingUrl: ports.length > 0 ? `http://localhost:${ports[0].PublicPort}` : '',
    ports: ports.map(port => ({ IP: '0.0.0.0', Type: 'tcp', ...port })),
    groupInfo: { type: 'standalone' },
  } as unknown as ContainerInfoUI;
}

test('Expect Open Browser to open the only exposed port directly', async () => {
  vi.mocked(window.openExternal).mockResolvedValue(undefined);
  render(ContainerActions, { container: runningContainerWithPorts([{ PublicPort: 8080, PrivatePort: 80 }]) });

  await fireEvent.click(screen.getByRole('button', { name: 'Open Browser' }));

  expect(window.openExternal).toHaveBeenCalledWith('http://localhost:8080');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('Expect Open Browser to open directly when the same port is bound on IPv4 and IPv6', async () => {
  vi.mocked(window.openExternal).mockResolvedValue(undefined);
  render(ContainerActions, {
    container: runningContainerWithPorts([
      { PublicPort: 8080, PrivatePort: 80, IP: '0.0.0.0' },
      { PublicPort: 8080, PrivatePort: 80, IP: '::' },
    ]),
  });

  await fireEvent.click(screen.getByRole('button', { name: 'Open Browser' }));

  expect(window.openExternal).toHaveBeenCalledWith('http://localhost:8080');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('Expect Open Browser submenu in kebab menu to list the exposed ports', async () => {
  vi.mocked(window.openExternal).mockResolvedValue(undefined);
  render(ContainerActions, {
    container: runningContainerWithPorts([
      { PublicPort: 8080, PrivatePort: 80 },
      { PublicPort: 9090, PrivatePort: 90 },
    ]),
    dropdownMenu: true,
  });

  // open the kebab menu
  await fireEvent.click(screen.getByRole('button', { name: 'kebab menu' }));

  const openBrowser = screen.getByRole('button', { name: 'Open Browser' });
  expect(openBrowser).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('menu', { name: 'Exposed ports' })).not.toBeInTheDocument();

  await fireEvent.click(openBrowser);

  expect(openBrowser).toHaveAttribute('aria-expanded', 'true');
  expect(window.openExternal).not.toHaveBeenCalled();
  const submenu = screen.getByRole('menu', { name: 'Exposed ports' });
  // clicking the parent item must not close the kebab menu
  expect(submenu).toBeInTheDocument();

  await fireEvent.click(screen.getByRole('menuitem', { name: 'http://localhost:9090' }));

  expect(window.openExternal).toHaveBeenCalledWith('http://localhost:9090');
});

test('Expect Open Browser submenu in kebab menu to open on hover and close on leave', async () => {
  render(ContainerActions, {
    container: runningContainerWithPorts([
      { PublicPort: 8080, PrivatePort: 80 },
      { PublicPort: 9090, PrivatePort: 90 },
    ]),
    dropdownMenu: true,
  });

  await fireEvent.click(screen.getByRole('button', { name: 'kebab menu' }));
  const wrapper = screen.getByRole('button', { name: 'Open Browser' }).parentElement!;

  await fireEvent.mouseEnter(wrapper);
  expect(screen.getByRole('menu', { name: 'Exposed ports' })).toBeInTheDocument();

  await fireEvent.mouseLeave(wrapper);
  expect(screen.queryByRole('menu', { name: 'Exposed ports' })).not.toBeInTheDocument();
});

test('Expect Open Browser submenu in details header to list the exposed ports', async () => {
  vi.mocked(window.openExternal).mockResolvedValue(undefined);
  render(ContainerActions, {
    container: runningContainerWithPorts([
      { PublicPort: 8080, PrivatePort: 80 },
      { PublicPort: 9090, PrivatePort: 90 },
    ]),
    detailed: true,
  });

  await fireEvent.click(screen.getByRole('button', { name: 'Open Browser' }));
  await fireEvent.click(screen.getByRole('menuitem', { name: 'http://localhost:8080' }));

  expect(window.openExternal).toHaveBeenCalledWith('http://localhost:8080');
});

test('Expect no Open Browser submenu for a single exposed port', async () => {
  vi.mocked(window.openExternal).mockResolvedValue(undefined);
  render(ContainerActions, {
    container: runningContainerWithPorts([{ PublicPort: 8080, PrivatePort: 80 }]),
  });

  await fireEvent.click(screen.getByRole('button', { name: 'Open Browser' }));

  expect(window.openExternal).toHaveBeenCalledWith('http://localhost:8080');
});
