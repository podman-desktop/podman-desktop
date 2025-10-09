/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { Terminal } from '@xterm/xterm';
import { tick } from 'svelte';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import type { ImageInspectInfo } from '/@api/image-inspect-info';

import type { ImageInfoUI } from './ImageInfoUI';
import PushImageModal from './PushImageModal.svelte';

vi.mock('@xterm/xterm', () => {
  const Terminal = vi.fn();
  Terminal.prototype = {
    loadAddon: vi.fn(),
    open: vi.fn(),
    write: vi.fn(),
    clear: vi.fn(),
    reset: vi.fn(),
    dispose: vi.fn(),
  };
  return { Terminal };
});

const getConfigurationValueMock = vi.fn();
const hasAuthMock = vi.fn();
const pushImageMock = vi.fn();

beforeAll(() => {
  (window.events as unknown) = {
    receive: (_channel: string, func: () => void): void => {
      func();
    },
  };
  Object.defineProperty(window, 'ResizeObserver', {
    value: vi.fn().mockReturnValue({ observe: vi.fn(), unobserve: vi.fn() }),
  });
  Object.defineProperty(window, 'getImageInspect', { value: vi.fn().mockImplementation(() => Promise.resolve({})) });
  Object.defineProperty(window, 'logsContainer', { value: vi.fn().mockResolvedValue(undefined) });
  Object.defineProperty(window, 'refreshTerminal', { value: vi.fn() });
  Object.defineProperty(window, 'getConfigurationValue', { value: getConfigurationValueMock });
  Object.defineProperty(window, 'hasAuthconfigForImage', { value: hasAuthMock });
  Object.defineProperty(window, 'showMessageBox', { value: vi.fn() });
  Object.defineProperty(window, 'pushImage', { value: pushImageMock });
});

// fake ImageInfoUI
const fakedImage: ImageInfoUI = {
  id: 'id',
  shortId: 'shortId',
  name: 'name',
  engineId: 'engineId',
  engineName: 'engineName',
  tag: 'tag',
  createdAt: 0,
  age: 'age',
  arch: '',
  size: 0,
  humanSize: 'humanSize',
  base64RepoTag: 'base64RepoTag',
  selected: false,
  status: 'UNUSED',
  icon: {},
  badges: [],
  digest: 'sha256:1234567890',
};
const fakedImageInspect: ImageInspectInfo = {
  Architecture: '',
  Author: '',
  Comment: '',
  Config: {
    ArgsEscaped: false,
    AttachStderr: false,
    AttachStdin: false,
    AttachStdout: false,
    Cmd: [],
    Domainname: '',
    Entrypoint: [],
    Env: [],
    ExposedPorts: {},
    Hostname: '',
    Image: '',
    Labels: {},
    OnBuild: [],
    OpenStdin: false,
    StdinOnce: false,
    Tty: false,
    User: '',
    Volumes: {},
    WorkingDir: '',
  },
  Container: '',
  ContainerConfig: {
    ArgsEscaped: false,
    AttachStderr: false,
    AttachStdin: false,
    AttachStdout: false,
    Cmd: [],
    Domainname: '',
    Env: [],
    ExposedPorts: {},
    Hostname: '',
    Image: '',
    Labels: {},
    OpenStdin: false,
    StdinOnce: false,
    Tty: false,
    User: '',
    Volumes: {},
    WorkingDir: '',
  },
  Created: '',
  DockerVersion: '',
  GraphDriver: { Data: { DeviceId: '', DeviceName: '', DeviceSize: '' }, Name: '' },
  Id: '',
  Os: '',
  Parent: '',
  RepoDigests: [],
  RepoTags: [],
  RootFS: {
    Type: '',
  },
  Size: 0,
  VirtualSize: 0,
  engineId: 'engineid',
  engineName: 'engineName',
};

async function waitRender(customProperties: object): Promise<void> {
  render(PushImageModal, { ...customProperties });
  await tick();
}

type CallbackType = (name: string, data?: string) => void;

describe('Expect Push Image dialog', () => {
  let callback: CallbackType | undefined;
  const closeCallback = vi.fn();
  function button(name: 'Cancel' | 'Push image' | 'Done'): HTMLElement | null {
    return screen.queryByRole('button', { name });
  }

  function terminal(): HTMLElement | null {
    return screen.queryByRole('term');
  }

  async function runTo(
    step:
      | 'DialogOpened'
      | 'PushPressed'
      | 'FirstMessage'
      | 'DataMessage'
      | 'DataErrorMessage'
      | 'EndAfterError'
      | 'End',
    authConfig = true,
  ): Promise<void> {
    hasAuthMock.mockResolvedValue(authConfig);
    vi.mocked(window.getImageInspect).mockResolvedValue(fakedImageInspect);
    pushImageMock.mockImplementation((_imageId, _imageTag, cb) => {
      callback = cb;
    });

    await waitRender({
      imageInfoToPush: fakedImage,
      closeCallback,
    });

    if (step === 'DialogOpened') return;

    const pushButton = screen.getByRole('button', { name: 'Push image' });
    await fireEvent.click(pushButton);

    if (step === 'PushPressed') return;

    callback?.('first-message');

    if (step === 'FirstMessage') return;

    callback?.('data', '{ "status": "DataMessage" }');
    await tick();

    if (step === 'DataMessage') return;

    if (step === 'EndAfterError' || step === 'DataErrorMessage') {
      callback?.('error', 'DataErrorMessage');
    }

    if (step === 'DataErrorMessage') return;

    callback?.('end');
  }

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('have "Cancel" and "Push Image" buttons disabled after open when auth configuration is missing', async () => {
    await runTo('DialogOpened', false);
    expect(button('Push image')).toBeDisabled();
    expect(button('Cancel')).toBeEnabled();
    expect(terminal()).toBeNull();
  });

  test('have "Cancel" and "Push Image" buttons enable after open when auth configuration is present', async () => {
    await runTo('DialogOpened');
    expect(button('Push image')).toBeEnabled();
    expect(button('Cancel')).toBeEnabled();
    expect(terminal()).toBeNull();
  });

  test('to close when "Cancel" button pressed', async () => {
    await runTo('DialogOpened');
    const cancelButton = button('Cancel');
    expect(cancelButton).toBeEnabled();
    if (cancelButton) {
      await fireEvent.click(cancelButton);
    }
    expect(closeCallback).toHaveBeenCalledOnce();
  });

  test('to have no "Cancel" button and "Push Image" button disabled after "Push Image" button pressed', async () => {
    await runTo('PushPressed');
    // the click on 'Push Image' button should set callback
    expect(callback).not.toBe(undefined);
    // window.pushImage() called, `Cancel` and `Push Image` buttons are
    // disabled and waiting for callback being called with first-message/data/end events
    expect(button('Push image')).toBeDisabled();
    expect(button('Cancel')).toBe(null);
    expect(screen.queryByRole('term')).toBeVisible();
  });

  test('to clean terminal when "first-message" event received', async () => {
    const terminalClearSpy = vi.spyOn(Terminal.prototype, 'clear');
    await runTo('FirstMessage');
    expect(terminalClearSpy).toHaveBeenCalledOnce();
  });

  test('to write "status" property to terminal received in "data" even', async () => {
    const terminalWriteSpy = vi.spyOn(Terminal.prototype, 'write');
    await runTo('DataMessage');
    expect(terminalWriteSpy).toBeCalledWith('DataMessage\n\r');
    expect(button('Push image')).toBeDisabled();
    expect(button('Cancel')).toBe(null);
  });

  test('to write error message to terminal from "data" event and reset buttons to initial state', async () => {
    const terminalWriteSpy = vi.spyOn(Terminal.prototype, 'write');
    await runTo('DataErrorMessage');
    expect(terminalWriteSpy).toBeCalledWith('DataErrorMessage\n\r');
    expect(button('Push image')).toBeDisabled();
    expect(button('Cancel')).toBe(null);
  });

  test('to show "Cancel" and "Push image" buttons after push call finished with error', async () => {
    await runTo('EndAfterError');
    expect(button('Push image')).toBeEnabled();
    expect(button('Cancel')).toBeEnabled();
    expect(terminal()).toBeVisible();
  });

  test('to show "Done" button after successful push', async () => {
    await runTo('End');
    expect(button('Push image')).toBe(null);
    expect(button('Cancel')).toBe(null);
    expect(button('Done')).toBeEnabled();
    expect(terminal()).toBeVisible();
  });

  test('to close when "Done" button pressed', async () => {
    await runTo('End');
    const doneButton = button('Done');
    expect(doneButton).toBeEnabled();
    if (doneButton) {
      await fireEvent.click(doneButton);
    }
    expect(closeCallback).toHaveBeenCalledOnce();
  });
});
