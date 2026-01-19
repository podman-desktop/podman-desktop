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

import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import type { Terminal } from '@xterm/xterm';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import KubernetesTerminalBrowser from './KubernetesTerminalBrowser.svelte';
import type { PodUI } from './PodUI';
import { terminalService } from './terminal/KubernetesTerminalService';

/**
 * Here we cannot rely on `vi.mock(import('@xterm/xterm'))` alone as our test is using {@link import('@xterm/xterm').Terminal#onData}
 * The vitest framework spy on functions, but omit class properties, therefore onData would be undefined otherwise
 */
vi.mock(import('@xterm/xterm'), () => {
  return {
    Terminal: class {
      loadAddon = vi.fn();
      open = vi.fn();
      write = vi.fn();
      dispose = vi.fn();
      onData = vi.fn();
    } as unknown as typeof Terminal,
  };
});
vi.mock(import('@xterm/addon-serialize'));

// dummy event emitter
const eventEmitter = {
  receive: (): void => {},
};

beforeAll(() => {
  Object.defineProperty(global, 'window', {
    value: {
      events: {
        receive: eventEmitter.receive,
      },
      navigator: {
        clipboard: {
          writeText: vi.fn(),
        },
      },
      getConfigurationValue: vi.fn(),
      kubernetesExec: vi.fn(),
      kubernetesExecResize: vi.fn(),
      getComputedStyle: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });
});

const podName = 'My Pod';

// create a pod with 2 containers
const pod: PodUI = {
  name: podName,
  selected: true,
  containers: [
    {
      Id: '1234',
      Names: 'container1',
      Status: 'running',
    },
    {
      Id: '5678',
      Names: 'container2',
      Status: 'running',
    },
  ],
} as unknown as PodUI;

beforeEach(() => {
  vi.resetAllMocks();
  vi.resetModules();

  vi.mocked(window.getComputedStyle).mockReturnValue({
    getPropertyValue: vi.fn().mockReturnValue(''),
  } as unknown as CSSStyleDeclaration);
});

test('Expect switch of terminal clicking on the item', async () => {
  render(KubernetesTerminalBrowser, { pod: pod });

  // get the dropdown button
  const dropdown = screen.getByRole('button', { name: 'Connected to:' });
  expect(dropdown).toBeInTheDocument();

  // assert we see only container1 which is the default being selected
  expect(screen.getByText('container1')).toBeInTheDocument();
  expect(screen.queryByText('container2')).not.toBeInTheDocument();

  // click on the dropdown
  await userEvent.click(dropdown);

  // select the button with container2
  const container2 = screen.getByText('container2');
  expect(container2).toBeInTheDocument();
  await userEvent.click(container2);

  // now expect that the we did the switch to container 2
  // and container1 is no longer present
  expect(screen.getByText('container2')).toBeInTheDocument();
  expect(screen.queryByText('container1')).not.toBeInTheDocument();
});

test('Expect switch of terminal using keyboard switch with arrow keys', async () => {
  // spyon terminal Service
  const spyOnTerminalServiceSpy = vi.spyOn(terminalService, 'ensureTerminalExists');

  render(KubernetesTerminalBrowser, { pod: pod });

  // get the dropdown button
  const dropdown = screen.getByRole('button', { name: 'Connected to:' });
  expect(dropdown).toBeInTheDocument();

  // assert we see only container1 which is the default being selected
  expect(screen.getByText('container1')).toBeInTheDocument();
  expect(screen.queryByText('container2')).not.toBeInTheDocument();

  // click on the dropdown
  await userEvent.click(dropdown);

  // clear the mock of the spy
  spyOnTerminalServiceSpy.mockClear();
  // send the arrow down key
  await userEvent.keyboard('{arrowdown}');
  // send the enter key
  await userEvent.keyboard('{enter}');

  // check that the terminal service was called with the right arguments
  await vi.waitFor(() => expect(spyOnTerminalServiceSpy).toHaveBeenCalledWith('My Pod', 'container2'));

  // should have container2
  const container2 = screen.getByText('container2');
  expect(container2).toBeInTheDocument();
});
