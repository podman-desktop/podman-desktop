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

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { Terminal } from '@xterm/xterm';
import { tick } from 'svelte';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { providerInfos } from '/@/stores/providers';
import type { ImageInfo } from '/@api/image-info';
import type { ImageInspectInfo } from '/@api/image-inspect-info';
import type { ProviderInfo } from '/@api/provider-info';

import { imagesInfos } from '../../stores/images';
import { ImageUtils } from './image-utils';
import type { ImageInfoUI } from './ImageInfoUI';
import PushImage from './PushImage.svelte';

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
vi.mock('./image-utils', () => {
  const ImageUtils = vi.fn();
  ImageUtils.prototype = {
    getImageInfoUI: vi.fn(),
  };
  return {
    ImageUtils,
  };
});

const getConfigurationValueMock = vi.fn();
const hasAuthMock = vi.fn();
const pushImageMock = vi.fn();

const engineId = 'engineId';
const base64RepoTag = btoa('base64RepoTag');
const imageId = 'imageId';
const taskId = 0;

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
  RepoTags: ['base64RepoTag'],
  RootFS: {
    Type: '',
  },
  Size: 0,
  VirtualSize: 0,
  engineId: 'engineid',
  engineName: 'engineName',
};

beforeAll(() => {
  (window.events as unknown) = {
    receive: (_channel: string, func: () => void): void => {
      func();
    },
  };
  Object.defineProperty(window, 'ResizeObserver', {
    value: vi.fn().mockReturnValue({ observe: vi.fn(), unobserve: vi.fn() }),
  });
  Object.defineProperty(window, 'getImageInspect', {
    value: vi.fn().mockImplementation(() => Promise.resolve(fakedImageInspect)),
  });
  Object.defineProperty(window, 'logsContainer', { value: vi.fn().mockResolvedValue(undefined) });
  Object.defineProperty(window, 'refreshTerminal', { value: vi.fn() });
  Object.defineProperty(window, 'getConfigurationValue', { value: getConfigurationValueMock });
  Object.defineProperty(window, 'hasAuthconfigForImage', { value: hasAuthMock });
  Object.defineProperty(window, 'showMessageBox', { value: vi.fn() });
  Object.defineProperty(window, 'pushImage', { value: pushImageMock });
  imagesInfos.set([{} as unknown as ImageInfo]);
  providerInfos.set([{ containerConnections: [{ status: 'started' }] } as unknown as ProviderInfo]);
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(ImageUtils.prototype.getImageInfoUI).mockReturnValue({} as unknown as ImageInfoUI);
});

async function waitRender(customProperties: object): Promise<void> {
  render(PushImage, { ...customProperties });
  await tick();
}

type CallbackType = (name: string, data?: string) => void;

describe('Expect Push Image dialog', () => {
  let callback: CallbackType | undefined;
  function button(name: 'Push image' | 'Done'): HTMLElement | null {
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
    pushImageMock.mockImplementation((_engineId, _imageTag, _imageID, _base64RepoTag, cb) => {
      callback = cb;
    });

    await waitRender({
      engineId,
      imageId,
      base64RepoTag,
      taskId,
    });

    if (step === 'DialogOpened') return;

    const pushButton = screen.getByRole('button', { name: 'Push image' });
    await waitFor(() => {
      expect(button('Push image')).toBeEnabled();
    });
    await fireEvent.click(pushButton);

    if (step === 'PushPressed') return;

    callback?.('first-message');

    if (step === 'FirstMessage') return;

    callback?.('data', '{ "status": "DataMessage" }');
    await tick();

    if (step === 'DataMessage') return;

    if (step === 'EndAfterError' || step === 'DataErrorMessage') {
      callback?.('error', 'DataErrorMessage');
      callback?.('end');
    }

    if (step === 'DataErrorMessage') return;

    callback?.('end');
  }

  test('have "Push Image" button disabled after open when auth configuration is missing', async () => {
    await runTo('DialogOpened', false);
    expect(button('Push image')).toBeDisabled();
    expect(terminal()).toBeNull();
  });

  test('have "Push Image" buttons enable after open when auth configuration is present', async () => {
    await runTo('DialogOpened');
    await waitFor(() => {
      expect(button('Push image')).toBeEnabled();
    });
    expect(terminal()).toBeNull();
  });

  test('to have "Push Image" button disabled after it has been pressed', async () => {
    await runTo('PushPressed');
    // the click on 'Push Image' button should set callback
    expect(callback).toBeDefined();
    expect(button('Push image')).toBeDisabled();
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
  });

  test('to write error message to terminal from "data" event and reset buttons to initial state', async () => {
    const terminalWriteSpy = vi.spyOn(Terminal.prototype, 'write');
    await runTo('DataErrorMessage');
    expect(terminalWriteSpy).toBeCalledWith('DataErrorMessage\n\r');
    expect(button('Push image')).toBeEnabled();
  });

  test('to have "Push image" button enabled after push call finished with error', async () => {
    await runTo('EndAfterError');
    await waitFor(() => {
      expect(button('Push image')).toBeEnabled();
    });

    expect(terminal()).toBeVisible();
  });

  test('to enable "Push image" button after successful push', async () => {
    await runTo('End');
    expect(button('Push image')).toBeEnabled();
    expect(button('Done')).toBeEnabled();
    expect(terminal()).toBeVisible();
  });
});
