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

import type { AuditRecord, TelemetryLogger } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { connectionAuditor, createCluster, getKindClusterConfig } from './create-cluster';
import { getKindPath, getMemTotalInfo } from './util';

vi.mock('node:fs', () => ({
  promises: {
    writeFile: vi.fn(),
    readFile: vi.fn(),
    mkdtemp: vi.fn(),
    rm: vi.fn(),
  },
  readFileSync: vi.fn(),
}));

vi.mock('@podman-desktop/api', async () => {
  return {
    Logger: {},
    kubernetes: {
      createResources: vi.fn(),
      getKubeconfig: vi.fn().mockReturnValue({ path: '/some/path' }),
      onDidUpdateKubeconfig: vi.fn(),
    },
    provider: {
      getContainerConnections: vi.fn().mockReturnValue([
        {
          providerId: 'docker',
          connection: {
            name: 'docker-connection',
            type: 'docker',
            endpoint: { socketPath: 'socket' },
            status: (): extensionApi.ProviderConnectionStatus => 'started',
          },
        },
      ]),
    },
    process: {
      exec: vi.fn(),
    },
    window: {
      showInformationMessage: vi.fn(),
    },
    net: {
      getFreePort: vi.fn(),
    },
  };
});

vi.mock('./util', async () => {
  return {
    getKindPath: vi.fn(),
    getMemTotalInfo: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fs.promises.mkdtemp).mockResolvedValue('/tmp/file');

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

test('expect error is cli returns non zero exit code', async () => {
  const error = { exitCode: -1, message: 'error' } as extensionApi.RunError;
  try {
    (extensionApi.process.exec as Mock).mockRejectedValue(error);
    await createCluster({}, '', telemetryLoggerMock);
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
  await createCluster({}, '', telemetryLoggerMock);
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
  expect(env).toStrictEqual({ PATH: '/kind/path' });
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

    createCluster({}, '', telemetryLoggerMock).catch((error: unknown) => {
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
  await createCluster({ 'kind.cluster.creation.configFile': '/path' }, '', telemetryLoggerMock, logger);
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
  await createCluster({ 'kind.cluster.creation.configFile': '/path' }, '', telemetryLoggerMock, logger);

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
    { 'kind.cluster.creation.configFile': '/path', 'kind.cluster.creation.ingress': 'on' },
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
    { 'kind.cluster.creation.configFile': '/path', 'kind.cluster.creation.ingress': 'on' },
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
  await createCluster({ 'kind.cluster.creation.ingress': 'on' }, '', telemetryLoggerMock, logger);
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
    {
      'kind.cluster.creation.http.port': '9091',
      'kind.cluster.creation.https.port': '9444',
    },
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
    {
      'kind.cluster.creation.http.port': 9091,
      'kind.cluster.creation.https.port': 9444,
    },
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
    await createCluster({ 'kind.cluster.creation.ingress': 'on' }, '', telemetryLoggerMock, logger);
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
  const checks = await connectionAuditor('docker', {
    'kind.cluster.creation.http.port': 9090,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).to.contains({
    type: 'info',
    record: 'It is recommend to install Kind on a virtual machine with at least 6GB of memory.',
  } as AuditRecord);
});

test('check that consilience check returns no warning messages', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockResolvedValueOnce(9090).mockResolvedValueOnce(9443);
  (getMemTotalInfo as Mock).mockReturnValue(6000000001);
  const checks = await connectionAuditor('docker', {
    'kind.cluster.creation.http.port': 9090,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(0);
});

test('check that consilience check returns warning message when image has no sha256 digest', async () => {
  vi.spyOn(extensionApi.net, 'getFreePort').mockResolvedValueOnce(9090).mockResolvedValueOnce(9443);
  const checks = await connectionAuditor('docker', {
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
  const checks = await connectionAuditor('docker', {
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
  const checks = await connectionAuditor('docker', {
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
  const checks = await connectionAuditor('docker', {
    'kind.cluster.creation.http.port': 9090,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).toHaveProperty('type');
  expect(checks.records[0].type).toBe('error');
});

test('check that auditItems returns error message when provider is not running', async () => {
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

  const checks = await connectionAuditor('podman', {
    'kind.cluster.creation.http.port': 9090,
    'kind.cluster.creation.https.port': 9443,
  });

  expect(checks).toBeDefined();
  expect(checks).toHaveProperty('records');
  expect(checks.records.length).toBe(1);
  expect(checks.records[0]).toHaveProperty('type');
  expect(checks.records[0].type).toBe('error');
  expect(checks.records[0].record).toContain('The podman provider is not running');
});
