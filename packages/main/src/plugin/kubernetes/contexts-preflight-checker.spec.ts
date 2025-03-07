/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { type Cluster, type Context, KubeConfig, type User } from '@kubernetes/client-node';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { Exec } from '../util/exec.js';
import { ContextsPreflightChecker, PreflightCheckRegistry } from './contexts-preflight-checker.js';
import { KubeConfigSingleContext } from './kubeconfig-single-context.js';

const context: Context = {
  name: 'context1',
  cluster: 'cluster1',
  user: 'user1',
};

const cluster: Cluster = {
  name: 'cluster1',
} as Cluster;

function getKubeConfigSingleContextWithUser(user: User): KubeConfigSingleContext {
  const kc = new KubeConfig();
  kc.loadFromOptions({
    contexts: [context],
    users: [user],
    clusters: [cluster],
    currentContext: 'context1',
  });
  return new KubeConfigSingleContext(kc, context);
}

describe('ContextsPreflightChecker', () => {
  let checker: ContextsPreflightChecker;
  const execMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    checker = new ContextsPreflightChecker({
      exec: execMock,
    } as unknown as Exec);
  });

  test('user without exec', async () => {
    const config = getKubeConfigSingleContextWithUser({
      name: 'user1',
    });
    await checker.check('context1', config);
    expect(checker.getResults()).toEqual([
      {
        contextName: 'context1',
        results: [],
      },
    ]);
  });

  test('user with full-path command', async () => {
    const config = getKubeConfigSingleContextWithUser({
      name: 'user1',
      exec: {
        command: '/path/to/cmd',
      },
    });
    await checker.check('context1', config);
    expect(checker.getResults()).toEqual([
      {
        contextName: 'context1',
        results: [],
      },
    ]);
  });

  test('user with command not found in path', async () => {
    const config = getKubeConfigSingleContextWithUser({
      name: 'user1',
      exec: {
        command: 'cmd-not-found-in-path',
      },
    });
    execMock.mockRejectedValue(new Error('not found'));
    await checker.check('context1', config);
    expect(checker.getResults()).toEqual([
      {
        contextName: 'context1',
        results: [
          {
            description:
              'the command "cmd-not-found-in-path" is not in the PATH. Consider using the full path of the command in the kubeconfig file',
          },
        ],
      },
    ]);
  });

  test('user with command not found in path and with a hint', async () => {
    const config = getKubeConfigSingleContextWithUser({
      name: 'user1',
      exec: {
        command: 'cmd-not-found-in-path',
        installHint: 'please install it',
      },
    });
    execMock.mockRejectedValue(new Error('not found'));
    await checker.check('context1', config);
    expect(checker.getResults()).toEqual([
      {
        contextName: 'context1',
        results: [
          {
            description:
              'the command "cmd-not-found-in-path" is not in the PATH. Consider using the full path of the command in the kubeconfig file\nplease install it',
          },
        ],
      },
    ]);
  });

  test('user with command found in path', async () => {
    const config = getKubeConfigSingleContextWithUser({
      name: 'user1',
      exec: {
        command: 'cmd-found-in-path',
        installHint: 'please install it',
      },
    });
    execMock.mockResolvedValue('output');
    await checker.check('context1', config);
    expect(checker.getResults()).toEqual([
      {
        contextName: 'context1',
        results: [],
      },
    ]);
  });
});

test('PreflightCheckRegistry', () => {
  const registry = new PreflightCheckRegistry();

  expect(registry.getAll()).toHaveLength(0);
  registry.addResult('ctx1', { description: 'desc1-1' });
  registry.addResult('ctx1', { description: 'desc1-2' });
  registry.addResult('ctx2', { description: 'desc2-1' });
  expect(registry.getAll()).toEqual([
    {
      contextName: 'ctx1',
      results: [{ description: 'desc1-1' }, { description: 'desc1-2' }],
    },
    {
      contextName: 'ctx2',
      results: [{ description: 'desc2-1' }],
    },
  ]);
  registry.reset('ctx2');
  expect(registry.getAll()).toEqual([
    {
      contextName: 'ctx1',
      results: [{ description: 'desc1-1' }, { description: 'desc1-2' }],
    },
    {
      contextName: 'ctx2',
      results: [],
    },
  ]);
  registry.reset('ctx1');
  expect(registry.getAll()).toEqual([
    {
      contextName: 'ctx1',
      results: [],
    },
    {
      contextName: 'ctx2',
      results: [],
    },
  ]);
});
