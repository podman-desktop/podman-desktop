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

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import * as jsYaml from 'js-yaml';
import { type ComponentProps, tick } from 'svelte';
import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import { lastPage } from '/@/stores/breadcrumb';

import DeployPodToKube from './DeployPodToKube.svelte';

const generatePodmanKubeMock = vi.fn();
const kubernetesGetCurrentContextNameMock = vi.fn();
const kubernetesGetCurrentNamespaceMock = vi.fn();
const kubernetesListNamespacesMock = vi.fn();
const kubernetesReadNamespacedConfigMapMock = vi.fn();
const telemetryTrackMock = vi.fn();
const kubernetesCreatePodMock = vi.fn();
const kubernetesCreateIngressMock = vi.fn();
const kubernetesCreateServiceMock = vi.fn();
const kubernetesIsAPIGroupSupported = vi.fn();
const listSimpleContainersByLabelMock = vi.fn();
const kubernetesReadNamespacedPodMock = vi.fn();
const queryCommandSupportedMock = vi.fn();
const openshiftCreateRouteMock = vi.fn();
const openExternalMock = vi.fn();

// replace Monaco Editor by a Spinner so we don't need to load tons of stuff
vi.mock('../editor/MonacoEditor.svelte', actual => {
  return vi.importActual('@podman-desktop/ui-svelte/Spinner');
});

// mock the router
vi.mock('tinro', () => {
  return {
    router: {
      goto: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.resetAllMocks();

  Object.defineProperty(window, 'generatePodmanKube', {
    value: generatePodmanKubeMock,
  });
  Object.defineProperty(window, 'kubernetesGetCurrentContextName', {
    value: kubernetesGetCurrentContextNameMock,
  });
  Object.defineProperty(window, 'kubernetesGetCurrentNamespace', {
    value: kubernetesGetCurrentNamespaceMock,
  });
  Object.defineProperty(window, 'kubernetesReadNamespacedPod', {
    value: kubernetesReadNamespacedPodMock,
  });
  Object.defineProperty(window, 'kubernetesListNamespaces', {
    value: kubernetesListNamespacesMock,
  });
  Object.defineProperty(window, 'kubernetesReadNamespacedConfigMap', {
    value: kubernetesReadNamespacedConfigMapMock,
  });
  Object.defineProperty(window, 'kubernetesCreatePod', {
    value: kubernetesCreatePodMock,
  });
  Object.defineProperty(window, 'kubernetesCreateIngress', {
    value: kubernetesCreateIngressMock,
  });
  Object.defineProperty(window, 'kubernetesCreateService', {
    value: kubernetesCreateServiceMock,
  });
  Object.defineProperty(window, 'kubernetesIsAPIGroupSupported', {
    value: kubernetesIsAPIGroupSupported,
  });
  Object.defineProperty(window, 'telemetryTrack', {
    value: telemetryTrackMock,
  });
  Object.defineProperty(window, 'openshiftCreateRoute', {
    value: openshiftCreateRouteMock,
  });
  Object.defineProperty(window, 'listSimpleContainersByLabel', {
    value: listSimpleContainersByLabelMock,
  });
  Object.defineProperty(window, 'openExternal', {
    value: openExternalMock,
  });
  Object.defineProperty(document, 'queryCommandSupported', {
    value: queryCommandSupportedMock,
  });

  // podYaml with volumes
  const podYaml = {
    metadata: {
      labels: {
        app: 'hello',
      },
      name: 'hello',
    },
    spec: {
      containers: [
        {
          name: 'hello',
          image: 'hello-world',
          volumeMounts: [
            // Test that this will be removed by PD
            {
              name: 'hello',
              mountPath: '/hello',
            },
          ],
          ports: [
            {
              hostPort: 8080,
              protocol: 'TCP',
              containerPort: 8080,
            },
          ],
        },
      ],
      volumes: [
        // Test that this will be removed by PD
        {
          name: 'hello',
          emptyDir: {},
        },
      ],
    },
  };
  generatePodmanKubeMock.mockResolvedValue(jsYaml.dump(podYaml));

  // Mock listSimpleContainersByLabel with a SimpleContainerInfo[] array of 1 container
  const simpleContainerInfo = {
    id: '1234',
    name: 'hello',
    image: 'hello-world',
    status: 'running',
    labels: {
      'com.docker.compose.project': 'hello',
    },
  };
  listSimpleContainersByLabelMock.mockResolvedValue([simpleContainerInfo]);
});

async function waitRender(customProperties: Partial<ComponentProps<DeployPodToKube>>): Promise<void> {
  render(DeployPodToKube, { resourceId: 'foo', engineId: 'bar', type: 'unknown', ...customProperties });
  await tick();
  await tick();
  await tick();
  await tick();
  await tick();
}

test('Expect to create routes with OpenShift and open Link', async () => {
  kubernetesReadNamespacedConfigMapMock.mockResolvedValue({
    data: {
      consoleURL: 'https://console-openshift-console.apps.cluster-1.example.com',
    },
  });
  kubernetesGetCurrentContextNameMock.mockResolvedValue('default');
  kubernetesCreatePodMock.mockResolvedValue({
    metadata: { name: 'hello', namespace: 'default' },
  });

  kubernetesReadNamespacedPodMock.mockResolvedValue({
    metadata: { name: 'hello' },
    status: {
      phase: 'Running',
    },
  });

  // say the pod has been created
  kubernetesReadNamespacedPodMock.mockResolvedValue({
    metadata: { name: 'hello' },
    status: {
      phase: 'Running',
    },
  });

  openshiftCreateRouteMock.mockResolvedValue({
    metadata: {
      name: 'hello-8080',
    },
    spec: {
      host: 'my-spec-host',
      port: {
        targetPort: '8080',
      },
    },
  });

  kubernetesIsAPIGroupSupported.mockResolvedValue(true);
  await waitRender({});

  const createButton = screen.getByRole('button', { name: 'Deploy' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeEnabled();
  await fireEvent.click(createButton);

  // wait that openshiftCreateRouteMock is called
  while (openshiftCreateRouteMock.mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  expect(telemetryTrackMock).toBeCalledWith('deployToKube', {
    useRoutes: true,
    useServices: true,
    isOpenshift: true,
    createIngress: false,
  });

  // check tls option is used
  expect(openshiftCreateRouteMock).toBeCalledWith('default', {
    apiVersion: 'route.openshift.io/v1',
    kind: 'Route',
    metadata: {
      name: 'hello-8080',
      namespace: 'default',
    },
    spec: {
      port: {
        targetPort: 8080,
      },
      tls: {
        termination: 'edge',
      },
      to: {
        kind: 'Service',
        name: 'hello-8080',
      },
    },
  });

  await tick();

  // now, grab the link 'openRoute' with name 'hello-8080'
  const openRouteButton = screen.getByRole('link', { name: 'hello-8080' });

  // click the button
  await fireEvent.click(openRouteButton);

  // expect the router to be called with the correct url
  expect(openExternalMock).toBeCalledWith('https://my-spec-host');
});

test('Expect to send telemetry event', async () => {
  await waitRender({});
  const createButton = screen.getByRole('button', { name: 'Deploy' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeEnabled();

  await fireEvent.click(createButton);
  await waitFor(() =>
    expect(telemetryTrackMock).toBeCalledWith('deployToKube', {
      useRoutes: true,
      useServices: true,
      createIngress: false,
    }),
  );
});

test('Expect to send telemetry event with OpenShift', async () => {
  kubernetesReadNamespacedConfigMapMock.mockResolvedValue({
    data: {
      consoleURL: 'https://console-openshift-console.apps.cluster-1.example.com',
    },
  });
  kubernetesIsAPIGroupSupported.mockResolvedValue(true);
  await waitRender({});
  const createButton = screen.getByRole('button', { name: 'Deploy' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeEnabled();

  await fireEvent.click(createButton);
  await waitFor(() =>
    expect(telemetryTrackMock).toBeCalledWith('deployToKube', {
      useRoutes: true,
      useServices: true,
      isOpenshift: true,
      createIngress: false,
    }),
  );
});

test('Expect to send telemetry error event', async () => {
  // creation throws an error
  kubernetesCreatePodMock.mockRejectedValue(new Error('Custom Error'));

  await waitRender({});
  const createButton = screen.getByRole('button', { name: 'Deploy' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeEnabled();

  // expect it throws a telemetry event reporting an error
  await fireEvent.click(createButton);
  await waitFor(() =>
    expect(telemetryTrackMock).toHaveBeenCalledWith('deployToKube', {
      errorMessage: 'Custom Error',
      useRoutes: true,
      useServices: true,
      createIngress: false,
    }),
  );
});

test('When deploying a pod, volumes should not be added (they are deleted by podman desktop)', async () => {
  await waitRender({});
  const createButton = screen.getByRole('button', { name: 'Deploy' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeEnabled();

  // Press the deploy button
  await fireEvent.click(createButton);

  // Expect kubernetesCreatePod to be called with default namespace and a modified bodyPod with volumes removed
  await waitFor(() =>
    expect(kubernetesCreatePodMock).toBeCalledWith('default', {
      metadata: {
        labels: {
          app: 'hello',
        },
        name: 'hello',
      },
      spec: {
        containers: [
          {
            name: 'hello',
            image: 'hello-world',
            imagePullPolicy: 'IfNotPresent',
            ports: [
              {
                containerPort: 8080,
                protocol: 'TCP',
              },
            ],
          },
        ],
      },
    }),
  );
});

// Test deploying a compose group of containers
test('Test deploying a group of compose containers with type compose still functions the same as normal deploy', async () => {
  await waitRender({ type: 'compose' });
  const createButton = screen.getByRole('button', { name: 'Deploy' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeEnabled();

  // Press the deploy button
  await fireEvent.click(createButton);

  // Expect to return the correct create pod yaml
  await waitFor(() =>
    expect(kubernetesCreatePodMock).toBeCalledWith('default', {
      metadata: {
        labels: {
          app: 'hello',
        },
        name: 'hello',
      },
      spec: {
        containers: [
          {
            name: 'hello',
            image: 'hello-world',
            imagePullPolicy: 'IfNotPresent',
            ports: [
              {
                containerPort: 8080,
                protocol: 'TCP',
              },
            ],
          },
        ],
      },
    }),
  );
});

// After modifying the pod name, metadata.apps.label should also have been changed
test('When modifying the pod name, metadata.apps.label should also have been changed', async () => {
  await waitRender({});
  const createButton = screen.getByRole('button', { name: 'Deploy' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeEnabled();

  const podNameInput = screen.getByLabelText('Pod Name');
  await userEvent.click(podNameInput);
  await userEvent.clear(podNameInput);
  await userEvent.keyboard('newName');

  // Press the deploy button
  await fireEvent.click(createButton);

  // Expect kubernetesCreatePod to be called with default namespace and a modified bodyPod with volumes removed
  await waitFor(() =>
    expect(kubernetesCreatePodMock).toBeCalledWith('default', {
      metadata: {
        labels: {
          app: 'newName',
        },
        name: 'newName',
      },
      spec: {
        containers: [
          {
            name: 'hello',
            image: 'hello-world',
            imagePullPolicy: 'IfNotPresent',
            ports: [
              {
                containerPort: 8080,
                protocol: 'TCP',
              },
            ],
          },
        ],
      },
    }),
  );
});

test('When deploying a pod, restricted security context is added', async () => {
  await waitRender({});
  const createButton = screen.getByRole('button', { name: 'Deploy' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeEnabled();

  // Click restricted
  const useRestricted = screen.getByRole('checkbox', { name: 'Use Restricted Security Context' });
  await fireEvent.click(useRestricted);

  // Press the deploy button
  await fireEvent.click(createButton);

  // Expect kubernetesCreatePod to be called with default namespace and a modified bodyPod with volumes removed
  await waitFor(() =>
    expect(kubernetesCreatePodMock).toBeCalledWith('default', {
      metadata: {
        labels: {
          app: 'hello',
        },
        name: 'hello',
      },
      spec: {
        containers: [
          {
            name: 'hello',
            image: 'hello-world',
            imagePullPolicy: 'IfNotPresent',
            ports: [
              {
                containerPort: 8080,
                protocol: 'TCP',
              },
            ],

            securityContext: {
              allowPrivilegeEscalation: false,
              capabilities: {
                drop: ['ALL'],
              },
              runAsNonRoot: true,
              seccompProfile: {
                type: 'RuntimeDefault',
              },
            },
          },
        ],
      },
    }),
  );
});

test('Succeed to deploy ingress if service is selected', async () => {
  await waitRender({});
  const createButton = screen.getByRole('button', { name: 'Deploy' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeEnabled();

  // Checkmark the ingress
  const checkbox = screen.getByRole('checkbox', { name: 'Create Ingress' });
  await fireEvent.click(checkbox);
  expect(checkbox).toHaveProperty('checked', true);

  // Press the deploy button
  await fireEvent.click(createButton);

  // Expect kubernetesCreateIngress to not be called since we error out as service wasn't selected
  expect(kubernetesCreateIngressMock).toHaveBeenCalled();
});

test('fail to deploy ingress if service is unselected', async () => {
  await waitRender({});
  const createButton = screen.getByRole('button', { name: 'Deploy' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeEnabled();

  // Press the deploy button
  await fireEvent.click(createButton);

  // Expect kubernetesCreateIngress to not be called since we error out as service wasn't selected
  expect(kubernetesCreateIngressMock).not.toHaveBeenCalled();
});

test('Should display Open pod button after successful deployment', async () => {
  await waitFor(() => kubernetesGetCurrentContextNameMock.mockResolvedValue('default'));
  await waitRender({});
  const createButton = screen.getByRole('button', { name: 'Deploy' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeEnabled();

  await waitFor(() =>
    kubernetesCreatePodMock.mockResolvedValue({
      metadata: { name: 'my-pod', namespace: 'default' },
    }),
  );
  await waitFor(() =>
    kubernetesReadNamespacedPodMock.mockResolvedValue({
      metadata: { name: 'my-pod', namespace: 'default' },
      status: {
        phase: 'Running',
      },
    }),
  );

  vi.useFakeTimers();
  await fireEvent.click(createButton);
  await vi.runAllTimersAsync();

  const doneButton = screen.getByRole('button', { name: 'Done' });
  expect(doneButton).toBeInTheDocument();
  expect(doneButton).toBeEnabled();

  const openPodButton = screen.getByRole('button', { name: 'Open Pod' });
  expect(openPodButton).toBeInTheDocument();
  expect(openPodButton).toBeEnabled();

  await fireEvent.click(openPodButton);
  expect(window.navigateToRoute).toBeCalledWith('kubernetes', {
    kind: 'Pod',
    name: 'my-pod',
    namespace: 'default',
  });
});

test('Done button should go back to previous page', async () => {
  await waitFor(() => kubernetesGetCurrentContextNameMock.mockResolvedValue('default'));
  await waitRender({});
  const createButton = screen.getByRole('button', { name: 'Deploy' });
  expect(createButton).toBeInTheDocument();
  expect(createButton).toBeEnabled();

  await waitFor(() =>
    kubernetesCreatePodMock.mockResolvedValue({
      metadata: { name: 'foobar/api-fake-cluster.com:6443', namespace: 'default' },
    }),
  );
  await waitFor(() =>
    kubernetesReadNamespacedPodMock.mockResolvedValue({
      metadata: { name: 'foobar/api-fake-cluster.com:6443' },
      status: {
        phase: 'Running',
      },
    }),
  );

  vi.useFakeTimers();
  await fireEvent.click(createButton);
  await vi.runAllTimersAsync();

  const doneButton = screen.getByRole('button', { name: 'Done' });
  expect(doneButton).toBeInTheDocument();
  expect(doneButton).toBeEnabled();

  lastPage.set({ name: 'perious page', path: '/last' });
  await fireEvent.click(doneButton);
  expect(router.goto).toHaveBeenCalledWith(`/last`);
});
