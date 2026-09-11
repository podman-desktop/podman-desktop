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

import { KubeConfig, loadAllYaml } from '@kubernetes/client-node';
import type { AuditRecord, AuditRequestItems, TelemetryLogger } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { connectionAuditor, createCluster, getKindClusterConfig, waitForCoreDNSReady } from './create-cluster';
import { KindClusterWatcher } from './kind-cluster-watcher';
import { getKindPath, getMemTotalInfo } from './util';

vi.mock(import('./kind-cluster-watcher'));
vi.mock(import('@kubernetes/client-node'));
vi.mock(import('./util'));
vi.mock(import('node:fs'));

beforeEach(() => {
  vi.resetAllMocks();
  (extensionApi.env.isWindows as unknown as boolean) = false;
  vi.mocked(extensionApi.kubernetes.getKubeconfig).mockReturnValue({
    path: '/some/path',
  } as unknown as extensionApi.Uri);
  vi.mocked(extensionApi.provider.getContainerConnections).mockReturnValue([
    {
      providerId: 'docker',
      connection: {
        name: 'docker-connection',
        type: 'docker',
        endpoint: { socketPath: 'socket' },
        status: (): extensionApi.ProviderConnectionStatus => 'started',
      },
    },
  ]);
  vi.mocked(fs.promises.mkdtemp).mockResolvedValue('/tmp/file');

  vi.mocked(KindClusterWatcher.prototype.waitForNodesReady).mockResolvedValue(undefined);
  vi.mocked(KindClusterWatcher.prototype.waitForSystemPodsReady).mockResolvedValue(undefined);
  vi.mocked(loadAllYaml).mockReturnValue([{ kind: 'Namespace', metadata: { name: 'test' } }]);

  // mock kubeconfig changing immediately after registering for update
  vi.mocked(extensionApi.kubernetes.onDidUpdateKubeconfig).mockImplementation(listener => {
    listener({} as extensionApi.KubeconfigUpdateEvent);
    return {
      dispose: vi.fn(),
    };
  });
});

const telemetryLogUsageMock = vi.fn();
const telemetryLogErrorMock = vi.fn();
const telemetryLoggerMock = {
  logUsage: telemetryLogUsageMock,
  logError: telemetryLogErrorMock,
} as unknown as TelemetryLogger;

function connectionSelection(providerId: string, connectionName: string): string {
  return JSON.stringify({ providerId, connectionName });
}

function withConnection(
  params: Record<string, unknown> = {},
  providerId = 'docker',
  connectionName = 'docker-connection',
): Record<string, unknown> {
  return {
    'kind.cluster.creation.provider': connectionSelection(providerId, connectionName),
    ...params,
  };
}

async function auditConnection(
  items: AuditRequestItems,
  providerId = 'docker',
  connectionName = 'docker-connection',
): Promise<extensionApi.AuditResult> {
  return connectionAuditor(withConnection(items, providerId, connectionName));
}

test('expect error is cli returns non zero exit code', async () => {
  const error = { exitCode: -1, message: 'error' } as extensionApi.RunError;
  try {
    (extensionApi.process.exec as Mock).mockRejectedValue(error);
    await createCluster(withConnection(), '', telemetryLoggerMock);
  } catch (err) {
    expect(err).to.be.a('Error');
    expect((err as Error).message).equal('Failed to create kind cluster. error');
    expect(telemetryLogUsageMock).toBeCalledWith('createCluster', expect.objectContaining({ error: error }));
    expect(telemetryLogErrorMock).not.toBeCalled();
  }
});

test('expect cluster to be created', async () => {
  vi.mocked(getKindPath).mockReturnValue('/kind/path');
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);
  await createCluster(withConnection(), '', telemetryLoggerMock);
  expect(telemetryLogUsageMock).toHaveBeenNthCalledWith(
    1,
    'createCluster',
    expect.objectContaining({ provider: 'docker' }),
  );
  expect(telemetryLogErrorMock).not.toBeCalled();
  expect(extensionApi.kubernetes.createResources).not.toBeCalled();
  const props = (extensionApi.process.exec as Mock).mock.calls[0][2];
  expect(props).to.have.property('env');
  const env = props.env;
  expect(env).toStrictEqual({ DOCKER_HOST: 'unix://socket', PATH: '/kind/path' });
});

test('expect selected Podman connection and cancellation token in Kind command environment', async () => {
  vi.mocked(extensionApi.provider.getContainerConnections).mockReturnValue([
    {
      providerId: 'podman',
      connection: {
        name: 'podman-machine-remote',
        type: 'podman',
        endpoint: { socketPath: 'remote-socket' },
        status: (): extensionApi.ProviderConnectionStatus => 'started',
      },
    },
  ]);
  vi.mocked(getKindPath).mockReturnValue('/kind/path');
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);
  const token = {} as extensionApi.CancellationToken;

  await createCluster(
    withConnection({}, 'podman', 'podman-machine-remote'),
    '/kind',
    telemetryLoggerMock,
    undefined,
    token,
  );

  expect(extensionApi.process.exec).toHaveBeenCalledWith(
    '/kind',
    expect.any(Array),
    expect.objectContaining({
      env: {
        CONTAINER_CONNECTION: 'podman-machine-remote',
        KIND_EXPERIMENTAL_PROVIDER: 'podman',
        PATH: '/kind/path',
      },
      token,
    }),
  );
  expect(telemetryLogUsageMock).toHaveBeenCalledWith('createCluster', expect.objectContaining({ provider: 'podman' }));
  expect(telemetryLogUsageMock.mock.calls[0][1]).not.toHaveProperty('containerConnection');
});

test('expect a legacy provider value to use a running connection of the same type', async () => {
  vi.mocked(extensionApi.provider.getContainerConnections).mockReturnValue([
    {
      providerId: 'docker',
      connection: {
        name: 'docker-desktop',
        type: 'docker',
        endpoint: { socketPath: 'docker-socket' },
        status: (): extensionApi.ProviderConnectionStatus => 'started',
      },
    },
    {
      providerId: 'podman',
      connection: {
        name: 'podman-machine-default',
        type: 'podman',
        endpoint: { socketPath: 'podman-socket' },
        status: (): extensionApi.ProviderConnectionStatus => 'started',
      },
    },
  ]);
  vi.mocked(getKindPath).mockReturnValue('/kind/path');
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);

  await createCluster({ 'kind.cluster.creation.provider': 'podman' }, '/kind', telemetryLoggerMock);

  expect(extensionApi.process.exec).toHaveBeenCalledWith(
    '/kind',
    expect.any(Array),
    expect.objectContaining({
      env: {
        CONTAINER_CONNECTION: 'podman-machine-default',
        KIND_EXPERIMENTAL_PROVIDER: 'podman',
        PATH: '/kind/path',
      },
    }),
  );
});

test('expect a legacy provider value to reject stopped connections', async () => {
  vi.mocked(extensionApi.provider.getContainerConnections).mockReturnValue([
    {
      providerId: 'podman',
      connection: {
        name: 'podman-machine-default',
        type: 'podman',
        endpoint: { socketPath: 'podman-socket' },
        status: (): extensionApi.ProviderConnectionStatus => 'stopped',
      },
    },
  ]);

  await expect(
    createCluster({ 'kind.cluster.creation.provider': 'podman' }, '/kind', telemetryLoggerMock),
  ).rejects.toThrow(
    'The previously selected Podman provider has no running container connection. Start one or select another connection.',
  );
  expect(extensionApi.process.exec).not.toHaveBeenCalled();
});

test('expect selected Docker connection to configure its Unix socket', async () => {
  vi.mocked(extensionApi.provider.getContainerConnections).mockReturnValue([
    {
      providerId: 'podman',
      connection: {
        name: 'shared-name',
        type: 'podman',
        endpoint: { socketPath: 'podman-socket' },
        status: (): extensionApi.ProviderConnectionStatus => 'started',
      },
    },
    {
      providerId: 'docker',
      connection: {
        name: 'shared-name',
        type: 'docker',
        endpoint: { socketPath: 'docker-socket' },
        status: (): extensionApi.ProviderConnectionStatus => 'started',
      },
    },
  ]);
  vi.mocked(getKindPath).mockReturnValue('/kind/path');
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);

  await createCluster(withConnection({}, 'docker', 'shared-name'), '/kind', telemetryLoggerMock);

  expect(extensionApi.process.exec).toHaveBeenCalledWith(
    '/kind',
    expect.any(Array),
    expect.objectContaining({ env: { DOCKER_HOST: 'unix://docker-socket', PATH: '/kind/path' } }),
  );
  expect(telemetryLogUsageMock).toHaveBeenCalledWith('createCluster', expect.objectContaining({ provider: 'docker' }));
  expect(telemetryLogUsageMock.mock.calls[0][1]).not.toHaveProperty('containerConnection');
});

test('expect selected Docker connection to configure its Windows named pipe', async () => {
  (extensionApi.env.isWindows as unknown as boolean) = true;
  vi.mocked(extensionApi.provider.getContainerConnections).mockReturnValue([
    {
      providerId: 'docker',
      connection: {
        name: 'docker-desktop',
        type: 'docker',
        endpoint: { socketPath: '\\\\.\\pipe\\docker_engine' },
        status: (): extensionApi.ProviderConnectionStatus => 'started',
      },
    },
  ]);
  vi.mocked(getKindPath).mockReturnValue('C:\\kind');
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);

  await createCluster(withConnection({}, 'docker', 'docker-desktop'), 'C:\\kind\\kind.exe', telemetryLoggerMock);

  expect(extensionApi.process.exec).toHaveBeenCalledWith(
    'C:\\kind\\kind.exe',
    expect.any(Array),
    expect.objectContaining({
      env: {
        DOCKER_HOST: 'npipe:////./pipe/docker_engine',
        PATH: 'C:\\kind',
      },
    }),
  );
});

test('expect cluster creation to fail if the selected connection disappears', async () => {
  vi.mocked(extensionApi.provider.getContainerConnections).mockReturnValue([]);

  await expect(createCluster(withConnection(), '/kind', telemetryLoggerMock)).rejects.toThrow(
    'The selected container connection "docker-connection" is no longer available. Select another connection.',
  );
  expect(extensionApi.process.exec).not.toHaveBeenCalled();
});

test('expect cluster creation to reject an unsupported connection type', async () => {
  vi.mocked(extensionApi.provider.getContainerConnections).mockReturnValue([
    {
      providerId: 'custom',
      connection: {
        name: 'custom-connection',
        type: 'custom',
        endpoint: { socketPath: 'custom-socket' },
        status: (): extensionApi.ProviderConnectionStatus => 'started',
      },
    } as unknown as extensionApi.ProviderContainerConnection,
  ]);

  await expect(
    createCluster(withConnection({}, 'custom', 'custom-connection'), '/kind', telemetryLoggerMock),
  ).rejects.toThrow(
    'The selected container connection "custom-connection" uses an unsupported provider type "custom". Select a Podman or Docker connection.',
  );
  expect(extensionApi.process.exec).not.toHaveBeenCalled();
});

describe('fake timers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('expect cluster creation to wait for kubeconfig change', async () => {
    vi.mocked(getKindPath).mockReturnValue('/kind/path');
    vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);

    // record kubeconfig listener
    let listener!: (e: extensionApi.KubeconfigUpdateEvent) => extensionApi.Disposable;
    vi.mocked(extensionApi.kubernetes.onDidUpdateKubeconfig).mockImplementation(x => {
      listener = x;
      return {
        dispose: vi.fn(),
      };
    });

    createCluster(withConnection(), '', telemetryLoggerMock).catch((error: unknown) => {
      console.error('Error creating cluster', error);
    });

    // wait for the listener to be registered and wait for 29s
    await vi.waitFor(() => {
      if (!listener) throw new Error('Not listening yet');
    });
    await vi.advanceTimersByTimeAsync(29_000);

    expect(telemetryLogUsageMock).not.toHaveBeenCalled();

    // notify listener
    listener({} as extensionApi.KubeconfigUpdateEvent);

    await vi.waitFor(() => expect(telemetryLogUsageMock).toHaveBeenCalled());
  });
});

test('expect cluster to be created using config file', async () => {
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);
  const logger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  };
  await createCluster(withConnection({ 'kind.cluster.creation.configFile': '/path' }), '', telemetryLoggerMock, logger);
  expect(telemetryLogUsageMock).toHaveBeenNthCalledWith(
    1,
    'createCluster',
    expect.objectContaining({ provider: 'docker' }),
  );
  expect(telemetryLogErrorMock).not.toBeCalled();
  expect(extensionApi.kubernetes.createResources).not.toBeCalled();
});

test('expect cluster to not call setupIngressController function when supplying config file and ingress is set to no', async () => {
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);
  const logger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  };

  // Supply the configuration file
  await createCluster(withConnection({ 'kind.cluster.creation.configFile': '/path' }), '', telemetryLoggerMock, logger);

  // Expect us to call the exec function as normal
  expect(telemetryLogUsageMock).toHaveBeenNthCalledWith(
    1,
    'createCluster',
    expect.objectContaining({ provider: 'docker' }),
  );
  expect(telemetryLogErrorMock).not.toBeCalled();

  // Expect create resources to NOT be called
  expect(extensionApi.kubernetes.createResources).not.toBeCalled();
});

test('expect cluster to call ingress controller setup when ingress is set to yes AND a config is supplied', async () => {
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);
  const logger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  };

  // Supply the configuration file
  await createCluster(
    withConnection({ 'kind.cluster.creation.configFile': '/path', 'kind.cluster.creation.ingress': 'on' }),
    '',
    telemetryLoggerMock,
    logger,
  );

  // Expect us to call the exec function as normal
  expect(telemetryLogUsageMock).toHaveBeenNthCalledWith(
    1,
    'createCluster',
    expect.objectContaining({ provider: 'docker' }),
  );
  expect(telemetryLogErrorMock).not.toBeCalled();

  // Expect create resources to be called
  expect(extensionApi.kubernetes.createResources).toBeCalled();

  // Expect createResources to be called with `kind-kind` as the namespace since we are using a "fake"
  // config file and there was no name supplied, so it should be using the default
  expect(extensionApi.kubernetes.createResources).toBeCalledWith('kind-kind', expect.anything());
});

test('expect cluster to use "name: foobar" within the yaml file when supplying a config file', async () => {
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);
  const logger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  };

  // Mock the fs readFileSync function to return a fake yaml file
  vi.mocked(fs.promises.readFile).mockResolvedValue(
    `
    apiVersion: kind.x-k8s.io/v1alpha4
    kind: Cluster
    name: foobar
    nodes:
    - role: control-plane
    - role: worker
    - role: worker`,
  );

  // Supply the configuration file
  await createCluster(
    withConnection({ 'kind.cluster.creation.configFile': '/path', 'kind.cluster.creation.ingress': 'on' }),
    '',
    telemetryLoggerMock,
    logger,
  );

  // Expect us to call the exec function as normal
  expect(telemetryLogUsageMock).toHaveBeenNthCalledWith(
    1,
    'createCluster',
    expect.objectContaining({ provider: 'docker' }),
  );

  expect(telemetryLogErrorMock).not.toBeCalled();

  // Expect create resources to be called
  expect(extensionApi.kubernetes.createResources).toBeCalled();

  // Expect `kind-foobar` to appear as the kind name in the createResources call
  expect(extensionApi.kubernetes.createResources).toBeCalledWith('kind-foobar', expect.anything());
});

test('expect cluster to be created with ingress', async () => {
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);
  const logger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  };
  await createCluster(withConnection({ 'kind.cluster.creation.ingress': 'on' }), '', telemetryLoggerMock, logger);
  expect(telemetryLogUsageMock).toHaveBeenNthCalledWith(
    1,
    'createCluster',
    expect.objectContaining({ provider: 'docker' }),
  );
  expect(extensionApi.kubernetes.createResources).toBeCalled();
});

test('expect cluster to be created with ports as strings', async () => {
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);
  const logger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  };
  await createCluster(
    withConnection({
      'kind.cluster.creation.http.port': '9091',
      'kind.cluster.creation.https.port': '9444',
    }),
    '',
    telemetryLoggerMock,
    logger,
  );
  expect(telemetryLogUsageMock).toHaveBeenNthCalledWith(
    1,
    'createCluster',
    expect.objectContaining({
      httpHostPort: 9091,
      httpsHostPort: 9444,
    }),
  );
  expect(fs.promises.writeFile).toHaveBeenCalledWith(
    expect.anything(),
    expect.stringContaining(`
  - containerPort: 80
    hostPort: 9091
    protocol: TCP
  - containerPort: 443
    hostPort: 9444
    protocol: TCP`),
    expect.anything(),
  );
});

test('expect cluster to be created with ports as numbers', async () => {
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);
  const logger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  };
  await createCluster(
    withConnection({
      'kind.cluster.creation.http.port': 9091,
      'kind.cluster.creation.https.port': 9444,
    }),
    '',
    telemetryLoggerMock,
    logger,
  );
  expect(telemetryLogUsageMock).toHaveBeenNthCalledWith(
    1,
    'createCluster',
    expect.objectContaining({
      httpHostPort: 9091,
      httpsHostPort: 9444,
    }),
  );
  expect(fs.promises.writeFile).toHaveBeenCalledWith(
    expect.anything(),
    expect.stringContaining(`
  - containerPort: 80
    hostPort: 9091
    protocol: TCP
  - containerPort: 443
    hostPort: 9444
    protocol: TCP`),
    expect.anything(),
  );
});

test('expect error if Kubernetes reports error', async () => {
  const error = new Error('Kubernetes error');
  try {
    vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);
    const logger = {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    };
    (extensionApi.kubernetes.createResources as Mock).mockRejectedValue(error);
    await createCluster(withConnection({ 'kind.cluster.creation.ingress': 'on' }), '', telemetryLoggerMock, logger);
  } catch (err) {
    expect(extensionApi.kubernetes.createResources).toBeCalled();
    expect(err).to.be.a('Error');
    expect((err as Error).message).equal('Failed to create kind cluster. Kubernetes error');
    expect(telemetryLogErrorMock).not.toBeCalled();
    expect(telemetryLogUsageMock).toBeCalledWith('createCluster', expect.objectContaining(error));
  }
});

test('check cluster configuration generation', async () => {
  const conf = getKindClusterConfig('k1', 80, 443, 'image:tag');
  expect(conf).to.contains('name: k1');
  expect(conf).to.contains('hostPort: 80');
  expect(conf).to.contains('hostPort: 443');
  expect(conf).to.contains('image: image:tag');
});

test('check cluster configuration empty string image', async () => {
  const conf = getKindClusterConfig('cluster', 80, 80, '');
  expect(conf).to.not.contains('image:');
});

test('check cluster configuration null string image', async () => {
  const conf = getKindClusterConfig('cluster', 80, 80);
  expect(conf).to.not.contains('image:');
});

test('check that consilience check returns warning message', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockResolvedValueOnce(9090).mockResolvedValueOnce(9443);
  (getMemTotalInfo as Mock).mockReturnValue(3000000000);
  const checks = await auditConnection({
    'kind.cluster.creation.http.port': 9090,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).to.contains({
    type: 'info',
    record: 'It is recommended to install Kind on a virtual machine with at least 6GB of memory.',
  } as AuditRecord);
});

test('check that consilience check returns no warning messages', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockResolvedValueOnce(9090).mockResolvedValueOnce(9443);
  (getMemTotalInfo as Mock).mockReturnValue(6000000001);
  const checks = await auditConnection({
    'kind.cluster.creation.http.port': 9090,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(0);
});

test('check that consilience check returns warning message when image has no sha256 digest', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockResolvedValueOnce(9090).mockResolvedValueOnce(9443);
  const checks = await auditConnection({
    'kind.cluster.creation.controlPlaneImage': 'image:tag',
    'kind.cluster.creation.http.port': 9090,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).toHaveProperty('type');
  expect(checks.records[0].type).toBe('warning');
});

test('check that consilience check returns warning message when config file is specified', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockImplementation((port: number) => Promise.resolve(port));
  const checks = await auditConnection({
    'kind.cluster.creation.configFile': '/path',
    'kind.cluster.creation.http.port': 9090,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).toHaveProperty('type');
  expect(checks.records[0].type).toBe('warning');
});

test('check that auditItems returns error message when HTTP port is not available', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockResolvedValueOnce(9091).mockResolvedValueOnce(9443);
  const checks = await auditConnection({
    'kind.cluster.creation.http.port': 9090,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).toHaveProperty('type');
  expect(checks.records[0].type).toBe('error');
});

test('check that auditItems returns error message when HTTPS port is not available', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockResolvedValueOnce(9090).mockResolvedValueOnce(9444);
  const checks = await auditConnection({
    'kind.cluster.creation.http.port': 9090,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).toHaveProperty('type');
  expect(checks.records[0].type).toBe('error');
});

test('check that auditItems requires a selected connection', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockImplementation((port: number) => Promise.resolve(port));

  const checks = await connectionAuditor({
    'kind.cluster.creation.http.port': 9090,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks.records).toContainEqual({
    type: 'error',
    record: 'Select a running container connection to create a Kind cluster.',
  });
});

test('check that selected provider identity disambiguates duplicate connection names', async () => {
  vi.spyOn(extensionApi.provider, 'getContainerConnections').mockReturnValue([
    {
      providerId: 'podman',
      connection: {
        name: 'shared-name',
        type: 'podman',
        endpoint: { socketPath: 'podman-socket' },
        status: (): extensionApi.ProviderConnectionStatus => 'started',
      },
    },
    {
      providerId: 'docker',
      connection: {
        name: 'shared-name',
        type: 'docker',
        endpoint: { socketPath: 'docker-socket' },
        status: (): extensionApi.ProviderConnectionStatus => 'started',
      },
    },
  ]);
  vi.spyOn(extensionApi.net, 'getFreePort').mockImplementation((port: number) => Promise.resolve(port));
  vi.mocked(getMemTotalInfo).mockResolvedValue(8000000000);

  const checks = await auditConnection(
    {
      'kind.cluster.creation.http.port': 9090,
      'kind.cluster.creation.https.port': 9443,
    },
    'docker',
    'shared-name',
  );

  expect(checks.records.filter(record => record.type === 'error')).toHaveLength(0);
  expect(getMemTotalInfo).toHaveBeenCalledWith('docker-socket');
});

test('check that auditItems rejects an unsupported connection type', async () => {
  vi.spyOn(extensionApi.provider, 'getContainerConnections').mockReturnValue([
    {
      providerId: 'custom',
      connection: {
        name: 'custom-connection',
        type: 'custom',
        endpoint: { socketPath: 'custom-socket' },
        status: (): extensionApi.ProviderConnectionStatus => 'started',
      },
    } as unknown as extensionApi.ProviderContainerConnection,
  ]);
  vi.spyOn(extensionApi.net, 'getFreePort').mockImplementation((port: number) => Promise.resolve(port));

  const checks = await auditConnection(
    {
      'kind.cluster.creation.http.port': 9090,
      'kind.cluster.creation.https.port': 9443,
    },
    'custom',
    'custom-connection',
  );

  expect(checks.records).toContainEqual({
    type: 'error',
    record:
      'The selected container connection "custom-connection" uses an unsupported provider type "custom". Select a Podman or Docker connection.',
  });
  expect(getMemTotalInfo).not.toHaveBeenCalled();
});

test('check that auditItems returns error message when no provider connections are running', async () => {
  // Mock provider connection with stopped status
  vi.spyOn(extensionApi.provider, 'getContainerConnections').mockReturnValue([
    {
      providerId: 'podman',
      connection: {
        name: 'podman-machine-default',
        type: 'podman',
        endpoint: { socketPath: 'socket' },
        status: (): extensionApi.ProviderConnectionStatus => 'stopped',
      },
    },
  ]);
  vi.spyOn(extensionApi.net, 'getFreePort').mockImplementation((port: number) => Promise.resolve(port));

  const checks = await auditConnection(
    {
      'kind.cluster.creation.http.port': 9090,
      'kind.cluster.creation.https.port': 9443,
    },
    'podman',
    'podman-machine-default',
  );

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).toHaveProperty('type');
  expect(checks.records[0].type).toBe('error');
  expect(checks.records[0].record).toContain(
    'The selected container connection "podman-machine-default" is not running',
  );
});

test('check that auditItems returns error message when HTTP and HTTPS ports are the same', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockImplementation((port: number) => Promise.resolve(port));
  const checks = await auditConnection({
    'kind.cluster.creation.http.port': 9090,
    'kind.cluster.creation.https.port': 9090,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).toHaveProperty('type');
  expect(checks.records[0].type).toBe('error');
  expect(checks.records[0].record).toBe('HTTP and HTTPS ports must be different. Currently both are set to 9090.');
});

test('check that auditItems returns error message when port is invalid (> 65535)', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockRejectedValueOnce(
    new Error('Please enter a port number between 0 and 65535.'),
  );
  vi.spyOn(extensionApi.net, 'getFreePort').mockResolvedValueOnce(9443);

  const checks = await auditConnection({
    'kind.cluster.creation.http.port': 999999,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).toHaveProperty('type');
  expect(checks.records[0].type).toBe('error');
  expect(checks.records[0].record).toContain('Invalid HTTP Port 999999');
  expect(checks.records[0].record).toContain('Please enter a port number between 0 and 65535.');
});

test('check that auditItems returns error message when port is invalid (< 1024)', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockRejectedValueOnce(new Error('The port must be greater than 1024.'));
  vi.spyOn(extensionApi.net, 'getFreePort').mockResolvedValueOnce(9443);

  const checks = await auditConnection({
    'kind.cluster.creation.http.port': 500,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).toHaveProperty('type');
  expect(checks.records[0].type).toBe('error');
  expect(checks.records[0].record).toContain('Invalid HTTP Port 500');
  expect(checks.records[0].record).toContain('The port must be greater than 1024.');
});

test('check that auditItems returns multiple error messages when both ports are invalid', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockRejectedValueOnce(
    new Error('Please enter a port number between 0 and 65535.'),
  );
  vi.spyOn(extensionApi.net, 'getFreePort').mockRejectedValueOnce(
    new Error('Please enter a port number between 0 and 65535.'),
  );

  const checks = await auditConnection({
    'kind.cluster.creation.http.port': 999999,
    'kind.cluster.creation.https.port': 888888,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(2);

  expect(checks.records[0]).toHaveProperty('type');
  expect(checks.records[0].type).toBe('error');
  expect(checks.records[0].record).toContain('Invalid HTTP Port 999999');
  expect(checks.records[0].record).toContain('Please enter a port number between 0 and 65535.');

  expect(checks.records[1]).toHaveProperty('type');
  expect(checks.records[1].type).toBe('error');
  expect(checks.records[1].record).toContain('Invalid HTTPS Port 888888');
  expect(checks.records[1].record).toContain('Please enter a port number between 0 and 65535.');
});

test('check that auditItems returns error message when multiple VMs exist but all are stopped', async () => {
  // Mock multiple provider connections where all are stopped
  vi.spyOn(extensionApi.provider, 'getContainerConnections').mockReturnValue([
    {
      providerId: 'podman',
      connection: {
        name: 'podman-machine-default',
        type: 'podman',
        endpoint: { socketPath: 'socket1' },
        status: (): extensionApi.ProviderConnectionStatus => 'stopped',
      },
    },
    {
      providerId: 'podman',
      connection: {
        name: 'podman-machine-custom',
        type: 'podman',
        endpoint: { socketPath: 'socket2' },
        status: (): extensionApi.ProviderConnectionStatus => 'stopped',
      },
    },
  ]);
  vi.spyOn(extensionApi.net, 'getFreePort').mockImplementation((port: number) => Promise.resolve(port));

  const checks = await auditConnection(
    {
      'kind.cluster.creation.http.port': 9090,
      'kind.cluster.creation.https.port': 9443,
    },
    'podman',
    'podman-machine-default',
  );

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).toHaveProperty('type');
  expect(checks.records[0].type).toBe('error');
  expect(checks.records[0].record).toContain(
    'The selected container connection "podman-machine-default" is not running',
  );
});

test('check that auditItems does not return error when multiple VMs exist and one is running', async () => {
  // Mock multiple provider connections where one is stopped and one is running
  vi.spyOn(extensionApi.provider, 'getContainerConnections').mockReturnValue([
    {
      providerId: 'podman',
      connection: {
        name: 'podman-machine-default',
        type: 'podman',
        endpoint: { socketPath: 'socket1' },
        status: (): extensionApi.ProviderConnectionStatus => 'stopped',
      },
    },
    {
      providerId: 'podman',
      connection: {
        name: 'podman-machine-custom',
        type: 'podman',
        endpoint: { socketPath: 'socket2' },
        status: (): extensionApi.ProviderConnectionStatus => 'started',
      },
    },
  ]);
  vi.spyOn(extensionApi.net, 'getFreePort').mockImplementation((port: number) => Promise.resolve(port));
  vi.mocked(getMemTotalInfo).mockResolvedValue(8000000000); // 8GB

  const checks = await auditConnection(
    {
      'kind.cluster.creation.http.port': 9090,
      'kind.cluster.creation.https.port': 9443,
    },
    'podman',
    'podman-machine-custom',
  );

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  // Should not have the "not running" error since one VM is running
  const errorRecords = checks.records.filter(r => r.type === 'error');
  expect(errorRecords.length).toBe(0);
  // Should have called getMemTotalInfo with the running connection's socket
  expect(getMemTotalInfo).toHaveBeenCalledWith('socket2');
});

test('waitForCoreDNSReady should call watcher methods in correct order', async () => {
  const logger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  };
  const mockKubeConfig = new KubeConfig();
  await waitForCoreDNSReady(mockKubeConfig, logger);

  // Verify all watcher methods were called
  expect(KindClusterWatcher.prototype.waitForNodesReady).toHaveBeenCalledWith();
  expect(KindClusterWatcher.prototype.waitForSystemPodsReady).toHaveBeenCalledWith('component=kube-scheduler');
  expect(KindClusterWatcher.prototype.waitForSystemPodsReady).toHaveBeenCalledWith('component=kube-controller-manager');
  expect(KindClusterWatcher.prototype.waitForSystemPodsReady).toHaveBeenCalledWith('k8s-app=kube-dns');

  // Verify cleanup was called
  expect(KindClusterWatcher.prototype.dispose).toHaveBeenCalled();
});

test('waitForCoreDNSReady should handle errors and cleanup properly', async () => {
  const mockError = new Error('Nodes not ready');
  vi.mocked(KindClusterWatcher.prototype.waitForNodesReady).mockRejectedValue(mockError);

  const logger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  };
  const mockKubeConfig = new KubeConfig();
  await expect(waitForCoreDNSReady(mockKubeConfig, logger)).rejects.toThrow(
    'Cluster not ready: Error: Nodes not ready',
  );

  expect(KindClusterWatcher.prototype.dispose).toHaveBeenCalled();
});
