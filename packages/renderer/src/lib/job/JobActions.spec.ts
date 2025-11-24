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

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import JobActions from './JobActions.svelte';
import type { JobUI } from './JobUI';

const deleteMock = vi.fn();

const job: JobUI = {
  uid: '123',
  name: 'my-job',
  status: 'RUNNING',
  namespace: '',
  selected: false,
  succeeded: 0,
  completions: 1,
  condition: 'running',
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.kubernetesDeleteJob).mockImplementation(deleteMock);
});

test('Expect no error and status deleting job', async () => {
  // Mock the showMessageBox to return 0 (yes)
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });
  render(JobActions, { job, detailed: false });

  // click on delete button
  const deleteButton = screen.getByRole('button', { name: 'Delete Job' });
  await fireEvent.click(deleteButton);

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(deleteMock).toHaveBeenCalled();
});
