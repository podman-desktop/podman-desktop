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

/* eslint-disable no-null/no-null */

import { rm, writeFile } from 'node:fs/promises';
import type { RequestOptions } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';

import type DockerModem from 'docker-modem';
import Dockerode from 'dockerode';
import { http, HttpResponse } from 'msw';
import { setupServer, type SetupServerApi } from 'msw/node';
import { afterEach, beforeAll, expect, test } from 'vitest';

import type { DockerodeInternals, LibPod } from '/@/plugin/dockerode/libpod-dockerode.js';
import { LibpodDockerode } from '/@/plugin/dockerode/libpod-dockerode.js';
import type { PodmanListImagesOptions } from '/@api/image-info.js';

import podmanInfo from '../../../tests/resources/data/plugin/podman-info.json' with { type: 'json' };

let server: SetupServerApi | undefined = undefined;

beforeAll(() => {
  const libpod = new LibpodDockerode();
  libpod.enhancePrototypeWithLibPod();
});

afterEach(() => {
  server?.close();
});

test('Check force is not given with default remove pod options', async () => {
  server = setupServer(
    http.delete('http://localhost/v4.2.0/libpod/pods/dummy', async info => {
      // check force is set to true in the URL query
      expect(info.request.url.endsWith('?force=true')).toBeFalsy();
      return HttpResponse.text();
    }),
  );

  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  await (api as unknown as LibPod).removePod('dummy');
});

test('Check force is given with remove pod options', async () => {
  server = setupServer(
    http.delete('http://localhost/v4.2.0/libpod/pods/dummy', async info => {
      // check force is set to true in the URL query
      expect(info.request.url.endsWith('?force=true')).toBeTruthy();
      return HttpResponse.text();
    }),
  );
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  await (api as unknown as LibPod).removePod('dummy', { force: true });
});

test('Check list of images using Podman API', async () => {
  const jsonImages = [
    {
      Id: 'sha256:1234567890',
      ParentId: 'sha256:0987654321',
      RepoTags: ['docker.io/library/httpd:latest'],
      RepoDigests: [],
      Created: 1691582587,
      Size: 0,
      VirtualSize: 0,
      SharedSize: 0,
      Labels: null,
      Containers: 0,
    },
  ];

  server = setupServer(http.get('http://localhost/v4.2.0/libpod/images/json', () => HttpResponse.json(jsonImages)));
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  const listOfImages = await (api as unknown as LibPod).podmanListImages({} as PodmanListImagesOptions);
  expect(listOfImages.length).toBe(1);
  const firstImage = listOfImages[0];
  expect(firstImage?.Id).toBe('sha256:1234567890');
});

test('Check list of containers using Podman API', async () => {
  const jsonContainers = [
    {
      AutoRemove: false,
      Command: ['httpd-foreground'],
      Created: '2023-08-09T13:49:31.12068064+02:00',
      CreatedAt: '',
      Exited: false,
      ExitedAt: 1691582587,
      ExitCode: 0,
      Id: '37a54a845ef27a212634ef00c994c0793b5f19ec16853d606beb1c929461c1cd',
      Image: 'docker.io/library/httpd:latest',
      ImageID: '911d72fc5020723f0c003a134a8d2f062b4aea884474a11d1db7dcd28ce61d6a',
      IsInfra: false,
      Labels: null,
      Mounts: [],
      Names: ['gallant_solomon'],
      Namespaces: {},
      Networks: ['podman'],
      Pid: 1738,
      Pod: '',
      PodName: '',
      Ports: [
        {
          host_ip: '',
          container_port: 80,
          host_port: 9090,
          range: 1,
          protocol: 'tcp',
        },
      ],
      Size: null,
      StartedAt: 1691585124,
      State: 'running',
      Status: '',
    },
  ];

  server = setupServer(
    http.get('http://localhost/v4.2.0/libpod/containers/json', () => HttpResponse.json(jsonContainers)),
  );
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  const listOfContainers = await (api as unknown as LibPod).listPodmanContainers();
  expect(listOfContainers.length).toBe(1);
  const firstContainer = listOfContainers[0];
  expect(firstContainer?.Id).toBe('37a54a845ef27a212634ef00c994c0793b5f19ec16853d606beb1c929461c1cd');
});

test('Check list of containers using Podman API and all true options', async () => {
  const jsonContainers = [
    {
      AutoRemove: false,
      Command: ['httpd-foreground'],
      Created: '2023-08-09T13:49:31.12068064+02:00',
      CreatedAt: '',
      Exited: false,
      ExitedAt: 1691582587,
      ExitCode: 0,
      Id: '37a54a845ef27a212634ef00c994c0793b5f19ec16853d606beb1c929461c1cd',
      Image: 'docker.io/library/httpd:latest',
      ImageID: '911d72fc5020723f0c003a134a8d2f062b4aea884474a11d1db7dcd28ce61d6a',
      IsInfra: false,
      Labels: null,
      Mounts: [],
      Names: ['gallant_solomon'],
      Namespaces: {},
      Networks: ['podman'],
      Pid: 1738,
      Pod: '',
      PodName: '',
      Ports: [
        {
          host_ip: '',
          container_port: 80,
          host_port: 9090,
          range: 1,
          protocol: 'tcp',
        },
      ],
      Size: null,
      StartedAt: 1691585124,
      State: 'running',
      Status: '',
    },
  ];

  server = setupServer(
    http.get('http://localhost/v4.2.0/libpod/containers/json', () => HttpResponse.json(jsonContainers)),
  );
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  const listOfContainers = await (api as unknown as LibPod).listPodmanContainers({ all: true });
  expect(listOfContainers.length).toBe(1);
  const firstContainer = listOfContainers[0];
  expect(firstContainer?.Id).toBe('37a54a845ef27a212634ef00c994c0793b5f19ec16853d606beb1c929461c1cd');
});

test('Check attach API', async () => {
  const containerPrompt = `#`;
  const containerId = '12345678';

  server = setupServer(
    http.post(`http://localhost/v4.2.0/libpod/containers/${containerId}/attach`, () =>
      HttpResponse.json(containerPrompt),
    ),
  );
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  const libPod = api as unknown as DockerodeInternals;

  // patch libpod to not wait for the test as websocket is not supported by mock server
  const originalBuildRequest = libPod.modem.buildRequest;
  libPod.modem.buildRequest = function (
    options: RequestOptions,
    context: DockerModem.DialOptions,
    data?: string | Buffer | NodeJS.ReadableStream,
    callback?: DockerModem.RequestCallback,
  ): void {
    context.openStdin = false;
    originalBuildRequest.call(this, options, context, data, callback);
  };

  const stream = await (api as unknown as LibPod).podmanAttach(containerId);
  expect(stream.on).toBeDefined();
});

test('Check info', async () => {
  server = setupServer(http.get('http://localhost/v4.2.0/libpod/info', () => HttpResponse.json(podmanInfo)));
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  const info = await (api as unknown as LibPod).podmanInfo();
  expect(info).toBeDefined();
  expect(info).toStrictEqual(podmanInfo);
});

test('Check labels are passed to the api when creating a pod', async () => {
  server = setupServer(
    http.post('http://localhost/v4.2.0/libpod/pods/create', () =>
      HttpResponse.json({ name: 'pod1', labels: { key1: 'value1' } }, { status: 201 }),
    ),
  );
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  await (api as unknown as LibPod).createPod({
    name: 'pod1',
    labels: {
      key1: 'value1',
    },
  });
});

test('Check using libpod/manifests/ endpoint', async () => {
  server = setupServer(
    http.post('http://localhost/v4.2.0/libpod/manifests/name1', () =>
      HttpResponse.json({ Id: 'testId1' }, { status: 201 }),
    ),
  );
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  const manifest = await (api as unknown as LibPod).podmanCreateManifest({
    name: 'name1',
    images: ['image1', 'image2'],
  });
  expect(manifest.Id).toBe('testId1');
});

test('Check using libpod/manifests/{name}/json endpoint', async () => {
  // Below is the example return output from
  // https://docs.podman.io/en/latest/_static/api.html?version=v4.2#tag/manifests/operation/ManifestInspectLibpod
  const mockJsonManifest = {
    manifests: [
      {
        digest: 'sha256:1234567890',
        mediaType: 'application/vnd.docker.distribution.manifest.v2+json',
        platform: {
          architecture: 'amd64',
          features: [],
          os: 'linux',
          'os.features': [],
          'os.version': '',
          variant: '',
        },
        size: 0,
        urls: [],
      },
    ],
    mediaType: 'application/vnd.docker.distribution.manifest.v2+json',
    schemaVersion: 2,
  };

  server = setupServer(
    http.get('http://localhost/v4.2.0/libpod/manifests/name1/json', () =>
      HttpResponse.json(mockJsonManifest, { status: 200 }),
    ),
  );
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  const manifest = await (api as unknown as LibPod).podmanInspectManifest('name1');

  // Check manifest information returned
  expect(manifest.mediaType).toBe('application/vnd.docker.distribution.manifest.v2+json');
  expect(manifest.schemaVersion).toBe(2);
  expect(manifest.manifests.length).toBe(1);

  // Check manifest.manifests
  expect(manifest.manifests[0]?.mediaType).toBe('application/vnd.docker.distribution.manifest.v2+json');
  expect(manifest.manifests[0]?.platform.architecture).toBe('amd64');
  expect(manifest.manifests[0]?.platform.os).toBe('linux');
  expect(manifest.manifests[0]?.size).toBe(0);
  expect(manifest.manifests[0]?.urls).toEqual([]);
});

test('Check create volume', async () => {
  server = setupServer(
    http.post('http://localhost/volumes/create', () =>
      HttpResponse.json({ Name: 'foo', Driver: 'local', Scope: 'local' }, { status: 200 }),
    ),
  );
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });

  const response = await api.createVolume({ Name: 'foo' });
  expect(response).toBeDefined();
  expect(response.Driver).toBe('local');
  expect(response.Name).toBe('foo');
  expect(response.Scope).toBe('local');
});

test('Test push manifest', async () => {
  server = setupServer(
    http.post('http://localhost/v4.2.0/libpod/manifests/name1/registry/name2', () =>
      HttpResponse.json({}, { status: 200 }),
    ),
  );
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  const manifest = await (api as unknown as LibPod).podmanPushManifest({ name: 'name1', destination: 'name2' });
  expect(manifest).toBeDefined();
});

test('Test remove manifest', async () => {
  server = setupServer(
    http.delete('http://localhost/v4.2.0/libpod/manifests/name1', () => HttpResponse.json({}, { status: 200 })),
  );
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });

  const response = await (api as unknown as LibPod).podmanRemoveManifest('name1');

  // Check that the response is correct
  expect(response).toBeDefined();
});

test('check correct header is provided for playKube', async () => {
  // Create a dummy yaml file in the tmp directory using os.tmpdir()
  const tmpFile = path.join(tmpdir(), 'test-apply-kube.yaml');
  // write some content to the file
  const content = 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: test\n';
  await writeFile(tmpFile, content);

  server = setupServer(
    http.post('http://localhost/v4.2.0/libpod/play/kube', info => {
      // check that the header is yaml
      expect(info.request.headers.get('content-type')).toBe('application/yaml');
      return HttpResponse.json({}, { status: 200 });
    }),
  );
  server.listen({ onUnhandledRequest: 'error' });
  const api = new Dockerode({ protocol: 'http', host: 'localhost' });

  const response = await (api as unknown as LibPod).playKube(tmpFile);

  // Check that the response is correct
  expect(response).toBeDefined();

  // Cleanup the file
  await rm(tmpFile);
});

test('Check prune all images', async () => {
  server = setupServer(
    http.post('http://localhost/v4.2.0/libpod/images/prune', async info => {
      const url = new URL(info.request.url);
      expect(url.searchParams.get('all')).toEqual('true');
      return HttpResponse.json({}, { status: 200 });
    }),
  );
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  await (api as unknown as LibPod).pruneAllImages(true);
});

test('Check prune default images (not all)', async () => {
  server = setupServer(
    http.post('http://localhost/v4.2.0/libpod/images/prune', async info => {
      const url = new URL(info.request.url);
      expect(url.searchParams.get('all')).toBeNull();
      return HttpResponse.json({}, { status: 200 });
    }),
  );
  server.listen({ onUnhandledRequest: 'error' });

  const api = new Dockerode({ protocol: 'http', host: 'localhost' });
  await (api as unknown as LibPod).pruneAllImages(false);
});

test('check pod inspect', async () => {
  server = setupServer(
    http.get('http://localhost/v4.2.0/libpod/pods/name1/json', () =>
      HttpResponse.json({ Id: 'testId1' }, { status: 200 }),
    ),
  );
  server.listen({ onUnhandledRequest: 'error' });
  const api = new Dockerode({ protocol: 'http', host: 'localhost' });

  const response = await (api as unknown as LibPod).getPodInspect('name1');

  // Check that the response is correct
  expect(response).toBeDefined();
  expect(response.Id).toStrictEqual('testId1');
});
