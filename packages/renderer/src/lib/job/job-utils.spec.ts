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

import type { V1Job } from '@kubernetes/client-node';
import { beforeEach, expect, test, vi } from 'vitest';

import { JobUtils } from './job-utils';

let jobUtils: JobUtils;

beforeEach(() => {
  vi.resetAllMocks();
  jobUtils = new JobUtils();
});

test('expect basic UI conversion', async () => {
  const job = {
    kind: 'Job',
    metadata: {
      name: 'my-job',
      namespace: 'test-namespace',
    },
    status: {},
  } as V1Job;
  const jobUI = jobUtils.getJobUI(job);
  expect(jobUI.kind).toEqual('Job');
  expect(jobUI.name).toEqual('my-job');
  expect(jobUI.namespace).toEqual('test-namespace');
});
