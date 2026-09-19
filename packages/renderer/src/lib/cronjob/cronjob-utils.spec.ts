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

import type { KubernetesObject, V1CronJob } from '@kubernetes/client-node';
import { beforeEach, expect, test, vi } from 'vitest';

import { CronJobUtils } from './cronjob-utils';

let cronjobUtils: CronJobUtils;

beforeEach(() => {
  vi.resetAllMocks();
  cronjobUtils = new CronJobUtils();
});

test('expect basic UI conversion', async () => {
  const cronjob = {
    kind: 'CronJob',
    metadata: {
      name: 'my-cronjob',
      namespace: 'test-namespace',
    },
    spec: {
      schedule: '*/5 * * * *',
      jobTemplate: {},
    },
    status: {},
  } as V1CronJob;
  const cronjobUI = cronjobUtils.getCronJobUI(cronjob);
  expect(cronjobUI.kind).toEqual('CronJob');
  expect(cronjobUI.name).toEqual('my-cronjob');
  expect(cronjobUI.namespace).toEqual('test-namespace');
});

test('isV1CronJob returns true for object with spec', () => {
  const obj = {
    apiVersion: 'batch/v1',
    kind: 'CronJob',
    metadata: { name: 'my-cronjob' },
    spec: { schedule: '*/5 * * * *', jobTemplate: {} },
  } as KubernetesObject;
  expect(cronjobUtils.isV1CronJob(obj)).toBeTruthy();
});

test('isV1CronJob returns false for object without spec', () => {
  const obj: KubernetesObject = {
    apiVersion: 'batch/v1',
    kind: 'CronJob',
    metadata: { name: 'my-cronjob' },
  };
  expect(cronjobUtils.isV1CronJob(obj)).toBeFalsy();
});
