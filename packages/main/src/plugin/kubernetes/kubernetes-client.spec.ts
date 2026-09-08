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

import * as fs from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

import * as clientNode from '@kubernetes/client-node';
import {
  Health,
  KubeConfig,
  type KubernetesObject,
  type V1ConfigMap,
  type V1Deployment,
  type V1Pod,
  type V1Service,
  type Watch,
} from '@kubernetes/client-node';
import type { FileSystemWatcher } from '@podman-desktop/api';
import type { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import type { IConfigurationChangeEvent, IConfigurationRegistry } from '@podman-desktop/core-api/configuration';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Emitter } from '/@/plugin/events/emitter.js';
import { FilesystemMonitoring } from '/@/plugin/filesystem-monitoring.js';
import type { Telemetry } from '/@/plugin/telemetry/telemetry.js';
import { Uri } from '/@/plugin/types/uri.js';

import { KubernetesClient } from './kubernetes-client.js';

vi.mock(import('node:fs'));

const _onDidChangeConfiguration = new Emitter<IConfigurationChangeEvent>();
const configurationRegistry: IConfigurationRegistry = {
  onDidChangeConfiguration: _onDidChangeConfiguration.event,
  registerConfigurations: vi.fn(),
  getConfiguration: vi.fn().mockReturnValue({
    get: vi.fn().mockReturnValue(''),
  }),
  updateConfigurationValue: vi.fn(),
} as unknown as IConfigurationRegistry;

const fileSystemMonitoring: FilesystemMonitoring = new FilesystemMonitoring();
const telemetry: Telemetry = {
  track: vi.fn().mockImplementation(async () => {
    // do nothing
  }),
} as unknown as Telemetry;
const makeApiClientMock = vi.fn();
const getContextObjectMock = vi.fn();
const podAndDeploymentTestYAML = `apiVersion: v1
kind: Pod
metadata:
  name: my-pod
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-deployment
  template:
    metadata:
      labels:
        app: my-deployment
    spec:
      containers:
      - name: my-deployment
        image: my-deployment-image
        ports:
        - containerPort: 80
`;

class TestKubernetesClient extends KubernetesClient {
  declare kubeConfig;

  declare public currentNamespace: string | undefined;

  public override createWatchObject(): Watch {
    return super.createWatchObject();
  }

  public setInitialNamespace(namespace: string): void {
    this.currentNamespace = namespace;
  }
}

function createTestClient(namespace?: string): TestKubernetesClient {
  const client = new TestKubernetesClient(apiSender, configurationRegistry, fileSystemMonitoring, telemetry);
  if (namespace) {
    client.setInitialNamespace(namespace);
  }
  return client;
}

const apiSenderSendMock = vi.fn();
const apiSender: ApiSenderType = {
  send: apiSenderSendMock,
  receive: vi.fn(),
};

vi.mock(import('@kubernetes/client-node'), async importOriginal => {
  const original = await importOriginal();
  return {
    // we need to use original ApiException
    ...original,
    KubeConfig: vi.fn(),
    CoreV1Api: {},
    CustomObjectsApi: {},
    NetworkingV1Api: {},
    VersionApi: {},
    makeInformer: vi.fn(),
    createConfiguration: vi.fn(),
    KubernetesObjectApi: vi.fn(),
    HttpError: class HttpError extends Error {
      statusCode: number;
      constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
      }
    },
    V1DeleteOptions: vi.fn(),
    Health: vi.fn(),
  } as unknown as typeof clientNode;
});

beforeEach(() => {
  vi.clearAllMocks();
  KubeConfig.prototype.loadFromString = vi.fn();
  KubeConfig.prototype.exportConfig = vi.fn();
  KubeConfig.prototype.makeApiClient = makeApiClientMock;
  KubeConfig.prototype.getContextObject = getContextObjectMock;
  KubeConfig.prototype.currentContext = 'context';
  Health.prototype.readyz = vi.fn();
});

test('Create Kubernetes resources with empty should return ok', async () => {
  const client = createTestClient();
  await client.createResources('dummy', []);
  expect(telemetry.track).toHaveBeenCalledWith('kubernetesSyncResources', { action: 'create', manifestsSize: 0 });
});

test('Create Kubernetes resources with v1 resource should return ok', async () => {
  const client = createTestClient();
  const readMock = vi.fn().mockRejectedValue(new Error('ResourceDoesntExistError'));
  const createMock = vi.fn().mockReturnValue({});
  makeApiClientMock.mockReturnValue({
    read: readMock,
    create: createMock,
  });
  await client.createResources('dummy', [{ apiVersion: 'v1', kind: 'Namespace', metadata: { name: 'n1' } }]);
  expect(createMock).toHaveBeenCalled();
  expect(telemetry.track).toHaveBeenCalledWith('kubernetesSyncResources', { action: 'create', manifestsSize: 1 });
});

describe.each([
  {
    manifest: { apiVersion: 'apps/v1', kind: 'Deployment', metadata: { name: 'n1' } },
    namespace: undefined,
    expectedNamespace: 'default',
  },
  {
    manifest: { apiVersion: 'apps/v1', kind: 'Deployment', metadata: { name: 'n1' } },
    namespace: 'defaultns',
    expectedNamespace: 'defaultns',
  },
  {
    manifest: { apiVersion: 'apps/v1', kind: 'Deployment', metadata: { name: 'n1', namespace: 'demons' } },
    namespace: undefined,
    expectedNamespace: 'demons',
  },
])(
  'Create Kubernetes resources with apps/v1 resource should return ok',
  ({ manifest, namespace, expectedNamespace }) => {
    test(`should use namespace ${expectedNamespace}`, async () => {
      const client = createTestClient();
      const readMock = vi.fn().mockRejectedValue(new Error('ResourceDoesntExistError'));
      const createMock = vi.fn().mockReturnValue({});
      makeApiClientMock.mockReturnValue({
        read: readMock,
        create: createMock,
      });

      await client.createResources('dummy', [manifest], namespace);
      expect(readMock).toHaveBeenCalled();
      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({ metadata: expect.objectContaining({ namespace: expectedNamespace }) }),
      );
      expect(telemetry.track).toHaveBeenCalledWith('kubernetesSyncResources', {
        action: 'create',
        manifestsSize: 1,
        namespace: namespace,
      });
    });
  },
);

describe.each([
  {
    manifest: { apiVersion: 'networking.k8s.io/v1', kind: 'Ingress', metadata: { name: 'n1' } },
    namespace: undefined,
    expectedNamespace: 'default',
  },
  {
    manifest: { apiVersion: 'networking.k8s.io/v1', kind: 'Ingress', metadata: { name: 'n1' } },
    namespace: 'defaultns',
    expectedNamespace: 'defaultns',
  },
  {
    manifest: { apiVersion: 'networking.k8s.io/v1', kind: 'Ingress', metadata: { name: 'n1', namespace: 'demons' } },
    namespace: undefined,
    expectedNamespace: 'demons',
  },
])(
  'Create Kubernetes resources with networking.k8s.io/v1 resource should return ok',
  ({ manifest, namespace, expectedNamespace }) => {
    test(`should use namespace ${expectedNamespace}`, async () => {
      const client = createTestClient();
      const readMock = vi.fn().mockRejectedValue(new Error('ResourceDoesntExistError'));
      const createMock = vi.fn().mockReturnValue({});
      makeApiClientMock.mockReturnValue({
        read: readMock,
        create: createMock,
      });

      await client.createResources('dummy', [manifest], namespace);
      expect(readMock).toHaveBeenCalled();
      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({ metadata: expect.objectContaining({ namespace: expectedNamespace }) }),
      );
      expect(telemetry.track).toHaveBeenCalledWith('kubernetesSyncResources', {
        action: 'create',
        manifestsSize: 1,
        namespace: namespace,
      });
    });
  },
);

describe.each([
  {
    manifest: { apiVersion: 'group/v1', kind: 'Namespace', metadata: { name: 'n1' } },
    namespace: undefined,
    expectedNamespace: 'default',
  },
  {
    manifest: { apiVersion: 'group/v1', kind: 'Namespace', metadata: { name: 'n1' } },
    namespace: 'defaultns',
    expectedNamespace: 'defaultns',
  },
  {
    manifest: { apiVersion: 'group/v1', kind: 'Namespace', metadata: { name: 'n1', namespace: 'demons' } },
    namespace: undefined,
    expectedNamespace: 'demons',
  },
])('Create custom Kubernetes resources should return ok', ({ manifest, namespace, expectedNamespace }) => {
  test(`should use namespace ${expectedNamespace}`, async () => {
    const client = createTestClient();
    const createMock = vi.fn().mockReturnValue({});
    const readMock = vi.fn().mockRejectedValue(new Error('ResourceDoesntExistError'));
    makeApiClientMock.mockReturnValue({
      read: readMock,
      create: createMock,
    });
    await client.createResources('dummy', [manifest], namespace);
    expect(readMock).toHaveBeenCalled();
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: expect.objectContaining({ namespace: expectedNamespace }) }),
    );
    expect(telemetry.track).toHaveBeenCalledWith('kubernetesSyncResources', {
      action: 'create',
      manifestsSize: 1,
      namespace: namespace,
    });
  });
});

test('Check connection to Kubernetes cluster', async () => {
  vi.mocked(clientNode.Health.prototype.readyz).mockResolvedValue(true);
  const client = new KubernetesClient({} as ApiSenderType, configurationRegistry, fileSystemMonitoring, telemetry);
  const result = await client.checkConnection();
  expect(result).toBeTruthy();
});

test('Check connection to Kubernetes cluster in error', async () => {
  vi.mocked(clientNode.Health.prototype.readyz).mockRejectedValue(undefined);

  const client = new KubernetesClient({} as ApiSenderType, configurationRegistry, fileSystemMonitoring, telemetry);
  const result = await client.checkConnection();
  expect(result).toBeFalsy();
});

test('Check update with empty kubeconfig file', async () => {
  const readFileMock = vi.spyOn(fs.promises, 'readFile');
  const consoleErrorSpy = vi.spyOn(console, 'error');

  // provide empty kubeconfig file
  readFileMock.mockResolvedValue('');

  const client = new KubernetesClient({} as ApiSenderType, configurationRegistry, fileSystemMonitoring, telemetry);
  await client.refresh();
  expect(consoleErrorSpy).toBeCalledWith(expect.stringContaining('is empty. Skipping'));
});

test('test that blank kubeconfig path will be set to default one', async () => {
  const client = createTestClient('fooNS');
  vi.spyOn(client, 'refresh').mockResolvedValue(undefined);
  const setKubeconfigSpy = vi.spyOn(client, 'setKubeconfig');

  await client.init();

  // Set empty path
  _onDidChangeConfiguration.fire({
    key: 'kubernetes.Kubeconfig',
    value: '',
    scope: 'DEFAULT',
  });

  const kubeconfigPath = Uri.file(resolve(homedir(), '.kube', 'config'));
  // Should be default kubeconfigpath
  expect(setKubeconfigSpy).toBeCalledWith(kubeconfigPath);
});

test('should throw error if cannot call the cluster (readNamespacedDeployment reject)', async () => {
  const client = createTestClient('default');
  makeApiClientMock.mockReturnValue({
    readNamespacedDeployment: () => Promise.reject(new Error('K8sError')),
  });

  try {
    await client.readNamespacedDeployment('deployment', 'default');
  } catch (err: unknown) {
    expect(err).to.be.a('Error');
    expect((err as Error).message).equal('K8sError');
  }
});

test('should return undefined if deployment does not exist', async () => {
  const client = createTestClient('default');
  makeApiClientMock.mockReturnValue({
    readNamespacedDeployment: () => Promise.resolve(undefined),
  });

  const deployment = await client.readNamespacedDeployment('deployment', 'default');
  expect(deployment).not.toBeDefined();
});

test('should return deployment if it exists', async () => {
  const v1Deployment: V1Deployment = {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Deployment',
    metadata: {
      name: 'deployment',
    },
  };
  const client = createTestClient('default');
  makeApiClientMock.mockReturnValue({
    readNamespacedDeployment: () => Promise.resolve(v1Deployment),
  });

  const deployment = await client.readNamespacedDeployment('deployment', 'default');
  expect(deployment).toBeDefined();
  expect(deployment?.metadata?.name).toEqual('deployment');
});

// Routes
test('Expect apply with invalid file should error', async () => {
  const client = createTestClient('default');
  let expectedError: unknown;
  try {
    await client.applyResourcesFromFile('default', 'missing-file.yaml');
  } catch (err: unknown) {
    expectedError = err;
  }
  expect(expectedError).to.be.a('Error');
  expect((expectedError as Error).message).equal('File missing-file.yaml does not exist');
});

test('Expect apply with empty yaml should throw error', async () => {
  const client = createTestClient('default');
  vi.spyOn(client, 'loadManifestsFromFile').mockResolvedValue([]);
  let expectedError: unknown;
  try {
    await client.applyResourcesFromFile('default', 'missing-file.yaml');
  } catch (err: unknown) {
    expectedError = err;
  }
  expect(expectedError).to.be.a('Error');
  expect((expectedError as Error).message).equal('No valid Kubernetes resources found');
});

test('Expect apply should create if object does not exist', async () => {
  const client = createTestClient('default');
  const manifests = { kind: test, metadata: { name: 'n1', annotations: test } } as unknown as KubernetesObject;
  const createdObj = { kind: 'created' };
  vi.spyOn(client, 'loadManifestsFromFile').mockResolvedValue([manifests]);
  makeApiClientMock.mockReturnValue({
    create: vi.fn().mockReturnValue(createdObj),
  });

  const objects = await client.applyResourcesFromFile('default', 'some-file.yaml');

  expect(objects).toHaveLength(1);
  expect(objects[0]).toEqual(createdObj);
});

test('Expect apply should patch if object exists', async () => {
  const client = createTestClient('default');
  const manifests = { kind: test, metadata: { name: 'n1', annotations: test } } as unknown as KubernetesObject;
  const patchedObj = { kind: 'patched' };
  vi.spyOn(client, 'loadManifestsFromFile').mockResolvedValue([manifests]);
  const patchMock = vi.fn();
  makeApiClientMock.mockReturnValue({
    read: vi.fn(),
    patch: patchMock.mockReturnValue(patchedObj),
  });

  const objects = await client.applyResourcesFromFile('default', 'some-file.yaml');

  expect(objects).toHaveLength(1);
  expect(objects[0]).toEqual(patchedObj);
  expect(patchMock).toHaveBeenCalledWith(expect.any(Object), undefined, undefined, 'podman-desktop');
});

test('Expect apply should patch with specific field manager', async () => {
  const client = createTestClient('default');
  const manifests = { kind: test, metadata: { name: 'n1', annotations: test } } as unknown as KubernetesObject;
  const patchedObj = { kind: 'patched' };
  vi.spyOn(client, 'loadManifestsFromFile').mockResolvedValue([manifests]);
  const patchMock = vi.fn();
  makeApiClientMock.mockReturnValue({
    read: vi.fn(),
    patch: patchMock.mockReturnValue({ body: patchedObj }),
  });

  await client.applyResourcesFromFile('default', 'some-file.yaml');
  expect(patchMock).toHaveBeenCalledWith(expect.any(Object), undefined, undefined, 'podman-desktop');
});

test('Expect apply should work with multiple files', async () => {
  const client = createTestClient('default');
  const manifests = { kind: test, metadata: { name: 'n1', annotations: test } } as unknown as KubernetesObject;
  const createdObjs = [{ kind: 'created' }, { kind: 'created' }];
  vi.spyOn(client, 'loadManifestsFromFile').mockResolvedValue([manifests]);
  makeApiClientMock.mockReturnValue({
    create: vi.fn().mockReturnValueOnce(createdObjs[0]).mockReturnValueOnce(createdObjs[1]),
  });

  const objects = await client.applyResourcesFromFile('default', ['some-file.yaml', 'another-file.yaml']);

  expect(objects).toHaveLength(2);
  expect(objects[0]).toEqual(createdObjs[0]);
  expect(objects[1]).toEqual(createdObjs[1]);
});

test('If Kubernetes returns a http error, output the http body message error.', async () => {
  const client = createTestClient();
  makeApiClientMock.mockReturnValue({
    read: vi.fn().mockReturnValue({}),
    create: vi.fn().mockRejectedValue(
      new clientNode.ApiException(
        400,
        'msg',
        JSON.stringify({
          message: 'A K8sError within message body',
        }),
        {},
      ),
    ),
  });

  try {
    await client.createResources('dummy', [{ apiVersion: 'v1' }]);
  } catch (err: unknown) {
    expect(err).to.be.a('Error');
    expect((err as Error).message).equals('A K8sError within message body');
  }
});

test('Expect loadManifestsFromYAML to correctly return a KubernetesObject[] from a valid YAML string', async () => {
  const client = createTestClient();
  const expectedObjects = [
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'my-pod',
      },
    },
    {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: 'my-deployment',
        namespace: 'default',
      },
      spec: {
        replicas: 3,
        selector: {
          matchLabels: {
            app: 'my-deployment',
          },
        },
        template: {
          metadata: {
            labels: {
              app: 'my-deployment',
            },
          },
          spec: {
            containers: [
              {
                name: 'my-deployment',
                image: 'my-deployment-image',
                ports: [
                  {
                    containerPort: 80,
                  },
                ],
              },
            ],
          },
        },
      },
    },
  ];
  const objects = await client.loadManifestsFromYAML(podAndDeploymentTestYAML);
  expect(objects).toEqual(expectedObjects);
});

test('Expect applyResourcesFromYAML to correctly call applyResources after loading the YAML', async () => {
  const client = createTestClient();
  const expectedObjects = [
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'my-pod',
      },
    },
    {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: 'my-deployment',
        namespace: 'default',
      },
      spec: {
        replicas: 3,
        selector: {
          matchLabels: {
            app: 'my-deployment',
          },
        },
        template: {
          metadata: {
            labels: {
              app: 'my-deployment',
            },
          },
          spec: {
            containers: [
              {
                name: 'my-deployment',
                image: 'my-deployment-image',
                ports: [
                  {
                    containerPort: 80,
                  },
                ],
              },
            ],
          },
        },
      },
    },
  ];
  const applyResourcesSpy = vi.spyOn(client, 'applyResources').mockResolvedValue(expectedObjects);
  const objects = await client.applyResourcesFromYAML('default', podAndDeploymentTestYAML);
  expect(objects).toEqual(expectedObjects);
  expect(applyResourcesSpy).toHaveBeenCalledWith('default', expectedObjects);
});

test('setupWatcher sends kubernetes-context-update when kubeconfig file changes', async () => {
  vi.mocked(fs.existsSync).mockReturnValue(true);
  const client = createTestClient();
  const fileSystemMonitoringSpy = vi.spyOn(fileSystemMonitoring, 'createFileSystemWatcher');
  const onDidChangeMock = vi.fn();
  vi.spyOn(client, 'refresh').mockResolvedValue(undefined);
  fileSystemMonitoringSpy.mockReturnValue({
    onDidChange: onDidChangeMock,
    onDidCreate: vi.fn(),
    onDidDelete: vi.fn(),
  } as unknown as FileSystemWatcher);
  onDidChangeMock.mockImplementation(f => {
    f();
  });
  client.setupWatcher('/path/to/kube/config');
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(apiSenderSendMock).toHaveBeenCalledWith('kubernetes-context-update');
});

test('setupWatcher sends kubernetes-context-update when kubeconfig file is created', async () => {
  const client = createTestClient();
  const fileSystemMonitoringSpy = vi.spyOn(fileSystemMonitoring, 'createFileSystemWatcher');
  const onDidCreateMock = vi.fn();
  vi.spyOn(client, 'refresh').mockResolvedValue(undefined);
  fileSystemMonitoringSpy.mockReturnValue({
    onDidChange: vi.fn(),
    onDidCreate: onDidCreateMock,
    onDidDelete: vi.fn(),
  } as unknown as FileSystemWatcher);
  onDidCreateMock.mockImplementation(f => {
    f();
  });
  client.setupWatcher('/path/to/kube/config');
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(apiSenderSendMock).toHaveBeenCalledWith('kubernetes-context-update');
});

test('setupWatcher sends kubernetes-context-update when kubeconfig file is deleted', async () => {
  const client = createTestClient();
  const fileSystemMonitoringSpy = vi.spyOn(fileSystemMonitoring, 'createFileSystemWatcher');
  const onDidDeleteMock = vi.fn();
  vi.spyOn(client, 'refresh').mockResolvedValue(undefined);
  fileSystemMonitoringSpy.mockReturnValue({
    onDidChange: vi.fn(),
    onDidCreate: vi.fn(),
    onDidDelete: onDidDeleteMock,
  } as unknown as FileSystemWatcher);
  onDidDeleteMock.mockImplementation(f => {
    f();
  });
  client.setupWatcher('/path/to/kube/config');
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(apiSenderSendMock).toHaveBeenCalledWith('kubernetes-context-update');
});

describe('Tests that managedFields are removed from the object when using read', () => {
  test('Pod', async () => {
    const client = createTestClient('default');
    const v1Pod: V1Pod = {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'pod',
        managedFields: [{ manager: 'manager' }],
      },
    };
    makeApiClientMock.mockReturnValue({
      readNamespacedPod: () =>
        Promise.resolve({
          body: v1Pod,
        }),
    });

    const pod = await client.readNamespacedPod('pod', 'default');
    expect(pod).toBeDefined();
    expect(pod?.metadata?.managedFields).toBeUndefined();
  });

  test('Deployment', async () => {
    const client = createTestClient('default');
    const v1Deployment: V1Deployment = {
      apiVersion: 'networking.k8s.io/v1',
      kind: 'Deployment',
      metadata: {
        name: 'deployment',
        managedFields: [{ manager: 'manager' }],
      },
    };
    makeApiClientMock.mockReturnValue({
      readNamespacedDeployment: () =>
        Promise.resolve({
          body: v1Deployment,
        }),
    });

    const deployment = await client.readNamespacedDeployment('deployment', 'default');
    expect(deployment).toBeDefined();
    expect(deployment?.metadata?.managedFields).toBeUndefined();
  });

  test('Service', async () => {
    const client = createTestClient('default');
    const v1Service: V1Service = {
      apiVersion: 'k8s.io/v1',
      kind: 'Service',
      metadata: {
        name: 'service',
        managedFields: [{ manager: 'manager' }],
      },
    };
    makeApiClientMock.mockReturnValue({
      readNamespacedService: () =>
        Promise.resolve({
          body: v1Service,
        }),
    });

    const service = await client.readNamespacedService('service', 'default');
    expect(service).toBeDefined();
    expect(service?.metadata?.managedFields).toBeUndefined();
  });

  test('ConfigMap', async () => {
    const client = createTestClient('default');
    const v1ConfigMap: V1ConfigMap = {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: 'configmap',
        managedFields: [{ manager: 'manager' }],
      },
    };
    makeApiClientMock.mockReturnValue({
      readNamespacedConfigMap: () =>
        Promise.resolve({
          body: v1ConfigMap,
        }),
    });

    const configMap = await client.readNamespacedConfigMap('configmap', 'default');
    expect(configMap).toBeDefined();
    expect(configMap?.metadata?.managedFields).toBeUndefined();
  });
});

test('test sync resources was called', async () => {
  const client = createTestClient('default');
  const context = 'test-context';
  const namespace = 'default';
  const manifests: KubernetesObject[] = [
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'test-pod',
      },
    },
  ];

  const mockedPatch = vi.fn();

  makeApiClientMock.mockReturnValue({
    read: vi.fn(),
    create: vi.fn(),
    patch: mockedPatch,
  });

  // Call the syncResources method with 'create' action
  await client.syncResources(context, manifests, 'apply', namespace);

  // Expect patch method to have been called
  expect(mockedPatch).toHaveBeenCalled();

  // We expect it to have been called with the same object, but with a few "extra" fiels such as last-applied-configuration
  expect(mockedPatch).toHaveBeenCalledWith(
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        annotations: {
          // eslint-disable-next-line no-useless-escape
          'kubectl.kubernetes.io/last-applied-configuration': `{\"apiVersion\":\"v1\",\"kind\":\"Pod\",\"metadata\":{\"name\":\"test-pod\",\"annotations\":{}}}`,
        },
        name: 'test-pod',
        namespace: 'default',
      },
    },
    undefined,
    undefined,
    'podman-desktop',
  );
});

test('test sync resources was called with no resourceVersion, uid, selfLink, or creationTimestamp being passed through', async () => {
  const client = createTestClient('default');
  const context = 'test-context';
  const namespace = 'default';
  const manifests: KubernetesObject[] = [
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'test-pod',
        resourceVersion: '123',
        uid: 'uid123',
        selfLink: '/api/v1/namespaces/default/pods/test-pod',
        creationTimestamp: new Date(42),
      },
    },
  ];

  const mockedPatch = vi.fn();

  makeApiClientMock.mockReturnValue({
    read: vi.fn(),
    create: vi.fn(),
    patch: mockedPatch,
  });

  // Call the syncResources method with 'create' action
  await client.syncResources(context, manifests, 'apply', namespace);

  // Expect patch method to have been called
  expect(mockedPatch).toHaveBeenCalled();

  // Expect it to be called with NO resourceVersion, uid, selfLink, or creationTimestamp in the metadata, however, it is okay to have it in 'last-applied-configuration'
  expect(mockedPatch).toHaveBeenCalledWith(
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        annotations: {
          // eslint-disable-next-line no-useless-escape
          'kubectl.kubernetes.io/last-applied-configuration': `{\"apiVersion\":\"v1\",\"kind\":\"Pod\",\"metadata\":{\"name\":\"test-pod\",\"resourceVersion\":\"123\",\"uid\":\"uid123\",\"selfLink\":\"/api/v1/namespaces/default/pods/test-pod\",\"creationTimestamp\":\"1970-01-01T00:00:00.042Z\",\"annotations\":{}}}`,
        },
        name: 'test-pod',
        namespace: 'default',
      },
    },
    undefined,
    undefined,
    'podman-desktop',
  );
});

test('test sync resources uses create without resourceVersion, uid, selfLink, or creationTimestamp', async () => {
  const client = createTestClient('default');
  const context = 'test-context';
  const namespace = 'default';
  const manifests: KubernetesObject[] = [
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'test-pod',
        resourceVersion: '123',
        uid: 'uid123',
        selfLink: '/api/v1/namespaces/default/pods/test-pod',
        creationTimestamp: new Date(42),
      },
    },
  ];

  const mockedCreate = vi.fn();
  makeApiClientMock.mockReturnValue({
    read: vi.fn().mockRejectedValue(new Error('NotFound')), // Force create
    create: mockedCreate,
    patch: vi.fn(),
  });

  await client.syncResources(context, manifests, 'create', namespace);

  expect(mockedCreate).toHaveBeenCalledWith({
    apiVersion: 'v1',
    kind: 'Pod',
    metadata: {
      annotations: {
        'kubectl.kubernetes.io/last-applied-configuration': expect.stringContaining('"resourceVersion":"123"'),
      },
      name: 'test-pod',
      namespace: 'default',
    },
  });
});

test('test sync resources uses create and removes status', async () => {
  const client = createTestClient('default');
  const context = 'test-context';
  const namespace = 'default';
  const manifests = [
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'test-pod',
        resourceVersion: '123',
        uid: 'uid123',
        selfLink: '/api/v1/namespaces/default/pods/test-pod',
        creationTimestamp: new Date(42),
      },
      status: {
        phase: 'Running',
        conditions: [
          {
            type: 'Ready',
            status: 'True',
          },
        ],
      },
    },
  ];

  const mockedCreate = vi.fn();
  makeApiClientMock.mockReturnValue({
    read: vi.fn().mockRejectedValue(new Error('NotFound')),
    create: mockedCreate,
    patch: vi.fn(),
  });

  await client.syncResources(context, manifests, 'create', namespace);

  expect(mockedCreate).toHaveBeenCalledWith(expect.not.objectContaining({ status: expect.anything() }));
});

test('test sync resources was called with no status being passed through', async () => {
  const client = createTestClient('default');
  const context = 'test-context';
  const namespace = 'default';
  const manifests = [
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'test-pod',
        resourceVersion: '123',
        uid: 'uid123',
        selfLink: '/api/v1/namespaces/default/pods/test-pod',
        creationTimestamp: new Date(42),
      },
      status: {
        phase: 'Running',
        conditions: [
          {
            type: 'Ready',
            status: 'True',
          },
        ],
      },
    },
  ];

  const mockedPatch = vi.fn();

  makeApiClientMock.mockReturnValue({
    read: vi.fn(),
    create: vi.fn(),
    patch: mockedPatch,
  });

  // Call the syncResources method with 'create' action
  await client.syncResources(context, manifests, 'apply', namespace);

  // Expect it to be called with NO status
  expect(mockedPatch).toHaveBeenCalledWith(
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        annotations: {
          'kubectl.kubernetes.io/last-applied-configuration': expect.anything(),
        },
        name: 'test-pod',
        namespace: 'default',
      },
    },
    undefined,
    undefined,
    'podman-desktop',
  );
});
