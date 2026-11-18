/**********************************************************************
 * Copyright (C) 2023-2026 Red Hat, Inc.
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

import { PassThrough } from 'node:stream';

import Dockerode from 'dockerode';
import { beforeEach, expect, test, vi } from 'vitest';

import type { DockerodeInternals, LibPod } from './libpod-dockerode.js';
import { LibpodDockerode } from './libpod-dockerode.js';

let api: Dockerode & LibPod;
let request: ReturnType<typeof vi.fn<DockerodeInternals['modem']['buildRequest']>>;
let stream: PassThrough;

beforeEach(() => {
  vi.resetAllMocks();
  new LibpodDockerode().enhancePrototypeWithLibPod();
  stream = new PassThrough();
  request = vi.fn<DockerodeInternals['modem']['buildRequest']>();
  request.mockImplementation((_options, _context, _data, callback) => callback?.(null, stream));
  const modem = new Dockerode({ protocol: 'http', host: 'localhost' }).modem;
  Object.assign(modem, { buildRequest: request });
  const options: Dockerode.DockerOptions = { protocol: 'http', host: 'localhost' };
  api = LibpodDockerode.createDockerode(Object.assign(options, { modem }));
});

test.each(['compat', 'libpod'])('sends an empty %s attach body while preserving query options', async operation => {
  if (operation === 'libpod') {
    await api.podmanAttach('fixture');
  } else {
    await api.getContainer('fixture').attach({ stream: true, stdin: true, stdout: true, stderr: true, hijack: true });
  }
  expect(request).toHaveBeenCalledOnce();
  const call = request.mock.calls[0];
  if (!call) throw new Error('Missing attach request');
  const [options, , data] = call;
  expect(data).toBe('');
  expect(options.headers).toHaveProperty('Content-Length', 0);
  expect(options.headers).not.toHaveProperty('Transfer-Encoding');
  expect(options.path).toContain('stdin=true');
  expect(options.path).toContain('stdout=true');
});

test('installs one shared patch even after multiple native attaches', async () => {
  const patched = Object.getOwnPropertyDescriptor(api.modem, 'buildRequest')?.value;
  await api.podmanAttach('fixture');
  await api.podmanAttach('fixture');
  expect(Object.getOwnPropertyDescriptor(api.modem, 'buildRequest')?.value).toBe(patched);
  expect(request).toHaveBeenCalledTimes(2);
});

test('preserves the JSON body and length of ordinary POST requests', async () => {
  request.mockImplementation((_options, _context, _data, callback) => callback?.(null, { Id: 'created' }));
  const options = { Image: 'alpine:3.20', Cmd: ['/bin/sh'] };
  await api.createContainer(options);
  const call = request.mock.calls[0];
  if (!call) throw new Error('Missing create request');
  const [httpOptions, , data] = call;
  expect(data).toBe(JSON.stringify(options));
  expect(httpOptions.headers).toHaveProperty('Content-Length', Buffer.byteLength(JSON.stringify(options)));
});
