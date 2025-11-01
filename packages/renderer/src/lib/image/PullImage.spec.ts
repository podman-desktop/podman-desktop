/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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
import { tick } from 'svelte';
import { get } from 'svelte/store';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { providerInfos } from '/@/stores/providers';
import { recommendedRegistries } from '/@/stores/recommendedRegistries';
import type { ProviderContainerConnectionInfo, ProviderInfo } from '/@api/provider-info';

import PullImage from './PullImage.svelte';

const getConfigurationValueMock = vi.fn();
const resolveShortnameImageMock = vi.fn();
const pullImageMock = vi.fn();
const listImageTagsInRegistryMock = vi.fn();

beforeAll(() => {
  vi.stubGlobal('getConfigurationValue', getConfigurationValueMock);
  vi.stubGlobal('resolveShortnameImage', resolveShortnameImageMock);
  vi.stubGlobal('pullImage', pullImageMock);
  vi.stubGlobal('listImageTagsInRegistry', listImageTagsInRegistryMock);

  (window.events as unknown) = {
    receive: (_channel: string, func: () => void): void => {
      func();
    },
  };

  Object.defineProperty(window, 'matchMedia', {
    value: () => {
      return {
        matches: false,
        addListener: (): void => {},
        removeListener: (): void => {},
      };
    },
  });
});

const CONTAINER_CONNECTION_MOCK: ProviderContainerConnectionInfo = {
  name: 'test',
  displayName: 'test',
  status: 'started',
  endpoint: {
    socketPath: 'dummy/socket',
  },
  type: 'podman',
};

const PROVIDER_INFO_MOCK: ProviderInfo = {
  id: 'test',
  internalId: 'id',
  name: '',
  containerConnections: [CONTAINER_CONNECTION_MOCK],
  kubernetesConnections: [],
  status: 'started',
  containerProviderConnectionCreation: false,
  containerProviderConnectionInitialization: false,
  kubernetesProviderConnectionCreation: false,
  kubernetesProviderConnectionInitialization: false,
} as unknown as ProviderInfo;

beforeEach(() => {
  vi.resetAllMocks();
  getConfigurationValueMock.mockImplementation((key: string) => {
    if (key === 'terminal.integrated.scrollback') {
      return 1000;
    }
    return undefined;
  });
  resolveShortnameImageMock.mockResolvedValue(['docker.io/test1']);
  pullImageMock.mockResolvedValue(undefined);
  listImageTagsInRegistryMock.mockResolvedValue(['latest', 'other']);

  providerInfos.set([PROVIDER_INFO_MOCK]);
});

const buttonText = 'Pull image';

describe('PullImage', () => {
  test('Expect that textbox is available and button is displayed', async () => {
    render(PullImage);

    const entry = screen.getByPlaceholderText('Image name');
    expect(entry).toBeInTheDocument();
    const button = screen.getByRole('button', { name: buttonText });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test('Expect that whitespace does not enable button', async () => {
    render(PullImage, { imageToPull: '   ' });

    const button = screen.getByRole('button', { name: buttonText });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test('Expect that valid entry enables button', async () => {
    render(PullImage, { imageToPull: 'some-valid-image' });

    const button = screen.getByRole('button', { name: buttonText });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  test('Expect that valid entry enables button after user input', async () => {
    render(PullImage);

    const button = screen.getByRole('button', { name: buttonText });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    const textbox = screen.getByRole('textbox', { name: 'Image to Pull' });
    await userEvent.click(textbox);
    await userEvent.paste('some-valid-image');

    expect(button).toBeEnabled();
  });

  test('Expect that action is displayed', async () => {
    render(PullImage);

    const regButton = 'Manage registries';
    const button = screen.getByRole('button', { name: regButton });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  test('Expect that pull image is reporting an error', async () => {
    render(PullImage, { imageToPull: 'image-does-not-exist' });

    // first call to pull image throw an error
    vi.mocked(window.pullImage).mockRejectedValueOnce(new Error('Image does not exists'));

    const pullImagebutton = screen.getByRole('button', { name: 'Pull image' });
    await userEvent.click(pullImagebutton);

    // expect that the error message is displayed
    const errorMesssage = screen.getByRole('alert', { name: 'Error Message Content' });
    expect(errorMesssage).toBeInTheDocument();
    expect(errorMesssage).toHaveTextContent('Image does not exists');
  });

  test('Expect that focus is in `Image to Pull` field after page is opened', async () => {
    render(PullImage);

    const pullImageInput = screen.getByRole('textbox', { name: 'Image to Pull' });
    expect(pullImageInput.matches(':focus')).toBe(true);
  });

  test('Expect that you can type an image name and hit Enter', async () => {
    render(PullImage);

    // first call to pull image throw an error
    vi.mocked(window.pullImage).mockRejectedValueOnce(new Error('Image does not exists'));

    await userEvent.keyboard('image-does-not-exist[Enter]');

    // expect that the error message is displayed
    const errorMesssage = screen.getByRole('alert', { name: 'Error Message Content' });
    expect(errorMesssage).toBeInTheDocument();
    expect(errorMesssage).toHaveTextContent('Image does not exists');
  });

  // pull image with error and then pull image with success
  // error message should not be displayed anymore
  test('Expect that pull image is reporting an error only if invalid', async () => {
    const renderResult = render(PullImage, { imageToPull: 'image-does-not-exist' });

    // first call to pull image throw an error
    vi.mocked(window.pullImage).mockRejectedValueOnce(new Error('Image does not exists'));

    // next one are ok
    vi.mocked(window.pullImage).mockResolvedValueOnce();

    const pullImagebutton = screen.getByRole('button', { name: 'Pull image' });
    await userEvent.click(pullImagebutton);

    // expect that the error message is displayed
    const errorMesssage = screen.getByRole('alert', { name: 'Error Message Content' });
    expect(errorMesssage).toBeInTheDocument();
    expect(errorMesssage).toHaveTextContent('Image does not exists');

    // ok, now choose a valid image name
    await renderResult.rerender({ imageToPull: 'some-valid-image' });

    // pull image again
    const pullImagebutton2 = screen.getByRole('button', { name: 'Pull image' });
    await userEvent.click(pullImagebutton2);

    // expect that the error message is not displayed
    expect(errorMesssage).not.toBeInTheDocument();
  });

  test('Expect that pull image is suggesting an extension in case of matching error', async () => {
    // add registries as recommended
    recommendedRegistries.set([
      {
        id: 'my.registry.com',
        name: 'Hello',
        errors: ['Image does not exists'],
        extensionId: 'myExtension.id',
        isInstalled: false,
        extensionDetails: {
          id: 'myExtension.id',
          fetchable: true,
          displayName: 'My Custom Extension',
          fetchLink: 'myCustomLinkToDownloadExtension',
          fetchVersion: '1.0.0',
        },
      },
    ]);

    render(PullImage, { imageToPull: 'my.registry.com/image-to-pull' });

    // first call to pull image throw an error
    vi.mocked(window.pullImage).mockRejectedValueOnce(new Error('Image does not exists'));

    // next one are ok
    vi.mocked(window.pullImage).mockResolvedValueOnce();

    const pullImagebutton = screen.getByRole('button', { name: 'Pull image' });
    await userEvent.click(pullImagebutton);

    // check to see the proposal to install the extension
    const proposal = screen.getByRole('button', { name: 'Install myExtension.id Extension' });
    expect(proposal).toBeInTheDocument();
    expect(proposal).toBeEnabled();
  });
});

test('Expect if no docker.io shortname to use Podman FQN', async () => {
  vi.mocked(window.resolveShortnameImage).mockResolvedValue(['someregistry/test1']);
  render(PullImage);

  const textbox = screen.getByRole('textbox', { name: 'Image to Pull' });
  await userEvent.click(textbox);
  await userEvent.paste('test1');

  expect(vi.mocked(window.resolveShortnameImage)).toBeCalled();
  await tick();
  const FQNButton = screen.getByRole('checkbox', { name: 'Use Podman FQN' });

  await userEvent.click(FQNButton);
  const pullImagebutton = screen.getByRole('button', { name: 'Pull image' });
  await userEvent.click(pullImagebutton);

  const imageName = vi.mocked(window.pullImage).mock.calls[0][1];
  expect(imageName).toBe('someregistry/test1');
});

test('Expect if no docker.io shortname but checkbox not checked to use docker hub', async () => {
  vi.mocked(window.resolveShortnameImage).mockResolvedValue(['someregistry/test1']);
  render(PullImage);

  const textbox = screen.getByRole('textbox', { name: 'Image to Pull' });
  await userEvent.click(textbox);
  await userEvent.paste('test1');

  expect(vi.mocked(window.resolveShortnameImage)).toBeCalled();
  await tick();

  const pullImagebutton = screen.getByRole('button', { name: 'Pull image' });
  await userEvent.click(pullImagebutton);

  const imageName = vi.mocked(window.pullImage).mock.calls[0][1];
  expect(imageName).toBe('docker.io/test1');
});

test('Expect if docker.io shortname exists to not use Podman FQN', async () => {
  vi.mocked(window.resolveShortnameImage).mockResolvedValue(['someregistry/test1', 'docker.io/test1']);
  render(PullImage);

  const textbox = screen.getByRole('textbox', { name: 'Image to Pull' });
  await userEvent.click(textbox);
  await userEvent.paste('test1');

  expect(vi.mocked(window.resolveShortnameImage)).toBeCalled();
  await tick();
  expect(screen.queryByRole('checkbox', { name: 'Use Podman FQN' })).not.toBeInTheDocument();

  const pullImagebutton = screen.getByRole('button', { name: 'Pull image' });
  await userEvent.click(pullImagebutton);

  const imageName = vi.mocked(window.pullImage).mock.calls[0][1];
  expect(imageName).toBe('test1');
});

test('Expect not to check not shortname images', async () => {
  render(PullImage);

  const textbox = screen.getByRole('textbox', { name: 'Image to Pull' });
  await userEvent.click(textbox);
  await userEvent.paste('test1/');

  expect(vi.mocked(window.resolveShortnameImage)).not.toBeCalled();
});

test('Expect latest tag warning is displayed when the image does not have latest tag', async () => {
  render(PullImage);

  vi.mocked(window.listImageTagsInRegistry).mockResolvedValue(['other']);
  await userEvent.keyboard('my-registry/image-without-latest[Enter]');

  // expect that the warning message is displayed
  const errorMesssage = screen.getByRole('alert', { name: 'Warning Message Content' });
  expect(errorMesssage).toBeInTheDocument();
  expect(errorMesssage).toHaveTextContent('"latest" tag not found');
});

test('Expect latest tag warning is not displayed when the image has latest tag', async () => {
  render(PullImage);

  vi.mocked(window.listImageTagsInRegistry).mockResolvedValue(['latest', 'other']);
  await userEvent.keyboard('my-registry/image-without-latest[Enter]');

  // expect that the warning message is not displayed
  const errorMesssage = screen.queryByRole('alert', { name: 'Warning Message Content' });
  expect(errorMesssage).toBeNull();
});

test('input component should not raise an error when the input is valid', async () => {
  const pullImage = render(PullImage);

  vi.mocked(window.listImageTagsInRegistry).mockResolvedValue(['latest', 'other']);
  await userEvent.keyboard('my-registry/image');

  const cellOutsideInput = pullImage.getAllByRole('textbox');
  const parentInput = cellOutsideInput[0].parentElement;
  expect(parentInput).not.toHaveClass('border-b-[var(--pd-input-field-stroke-error)]');
  expect(parentInput).not.toHaveClass('focus-within:border-[var(--pd-input-field-stroke-error)]');
  expect(parentInput).toHaveClass('hover:border-b-[var(--pd-input-field-hover-stroke)]');
});

test('input component should raise an error when the input is not valid', async () => {
  const pullImage = render(PullImage);

  vi.mocked(window.listImageTagsInRegistry).mockResolvedValue([]);
  await userEvent.keyboard('my-registry/image');

  const cellOutsideInput = pullImage.getAllByRole('textbox');
  const parentInput = cellOutsideInput[0].parentElement;
  expect(parentInput).toHaveClass('border-b-[var(--pd-input-field-stroke-error)]');
  expect(parentInput).toHaveClass('focus-within:border-[var(--pd-input-field-stroke-error)]');
  expect(parentInput).not.toHaveClass('hover:border-b-[var(--pd-input-field-hover-stroke)]');
});

test('input component should raise an error when the input is not valid - error', async () => {
  const pullImage = render(PullImage);

  vi.mocked(window.listImageTagsInRegistry).mockImplementation(() => {
    throw Error('Error msg');
  });
  await userEvent.keyboard('my-registry/image');

  const cellOutsideInput = pullImage.getAllByRole('textbox');
  const parentInput = cellOutsideInput[0].parentElement;
  expect(parentInput).toHaveClass('border-b-[var(--pd-input-field-stroke-error)]');
  expect(parentInput).toHaveClass('focus-within:border-[var(--pd-input-field-stroke-error)]');
  expect(parentInput).not.toHaveClass('hover:border-b-[var(--pd-input-field-hover-stroke)]');
});

describe('container connections', () => {
  // create a dummy multi connection provider
  const MULTI_CONNECTIONS: ProviderInfo = {
    ...PROVIDER_INFO_MOCK,
    containerConnections: Array.from({ length: 5 }).map((_, index) => ({
      ...CONTAINER_CONNECTION_MOCK,
      name: `connection-${index}`,
      displayName: `Connection ${index}`,
      endpoint: {
        socketPath: `socket-${index}`,
      },
    })),
  };

  test('single container connection should not display the container engine dropdown', async () => {
    // ensure we only have one container connections in the store
    const providers = get(providerInfos);
    const containerConnections = providers.map(provider => provider.containerConnections).flat();

    expect(containerConnections).toHaveLength(1);

    const { queryByRole } = render(PullImage);
    const dropdown = queryByRole('button', { name: 'Container Engine' });
    expect(dropdown).toBeNull();
  });

  test('multiple container connection should display a dropdown', async () => {
    providerInfos.set([MULTI_CONNECTIONS]);

    const { getByRole } = render(PullImage);
    const dropdown = getByRole('button', { name: 'Container Engine' });
    expect(dropdown).toBeEnabled();
  });

  test('providerInfos update should be reactive', async () => {
    // default should only have one connection
    const { queryByRole } = render(PullImage);
    const dropdown = queryByRole('button', { name: 'Container Engine' });
    expect(dropdown).toBeNull();

    // let's update to multiple connection
    providerInfos.set([MULTI_CONNECTIONS]);

    // expect dropdown to appear
    await vi.waitFor(() => {
      const dropdown = queryByRole('button', { name: 'Container Engine' });
      expect(dropdown).toBeEnabled();
    });
  });

  test('default provider when multiple should be the first one', async () => {
    providerInfos.set([MULTI_CONNECTIONS]);

    const { getByRole } = render(PullImage);
    const dropdown = getByRole('button', { name: 'Container Engine' });
    expect(dropdown).toBeEnabled();
    // default to the first one
    expect(dropdown).toHaveTextContent(MULTI_CONNECTIONS.containerConnections[0].name);
  });

  test('selecting a provider should update the dropdown button', async () => {
    // set multiple connections
    const connectionTarget = MULTI_CONNECTIONS.containerConnections[3];
    providerInfos.set([MULTI_CONNECTIONS]);

    // render
    const { getByRole } = render(PullImage);
    const dropdown = getByRole('button', { name: 'Container Engine' });
    expect(dropdown).toBeEnabled();

    // open the dropdown
    dropdown.click();

    // get the connection we want
    const connection3 = await vi.waitFor(() => {
      const button = getByRole('button', { name: connectionTarget.name });
      expect(button).toBeDefined();
      return button;
    });

    // select it
    connection3.click();
    await vi.waitFor(() => {
      expect(dropdown).toHaveTextContent(connectionTarget.name);
    });

    // type into the textbox
    const textbox = getByRole('textbox', { name: 'Image to Pull' });
    await userEvent.click(textbox); // focus
    await userEvent.paste('test1'); // paste

    // get the pull button
    const pullImagebutton = getByRole('button', { name: 'Pull image' });
    expect(pullImagebutton).toBeEnabled();
    pullImagebutton.click();

    await vi.waitFor(() => {
      expect(window.pullImage).toHaveBeenCalledWith(connectionTarget, 'test1', expect.any(Function));
    });
  });
});
