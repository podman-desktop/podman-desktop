/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import type { ProviderInfo } from '@desktop-framework/api';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import CronJobActions from '/@/lib/cronjob/CronJobActions.svelte';
import DeploymentDetailsSummary from '/@/lib/deployments/DeploymentDetailsSummary.svelte';
import { initTranslations } from '/@/lib/i18n/translations.svelte';
import Conditions from '/@/lib/job/columns/Conditions.svelte';
import type { JobUI } from '/@/lib/job/JobUI';
import PortForwardingList from '/@/lib/kubernetes-port-forward/PortForwardingList.svelte';
import { providerInfos } from '/@/stores/providers';

import SecretCreate from './SecretCreate.svelte';

vi.mock(import('/@/navigation'));

beforeEach(async () => {
  vi.resetAllMocks();
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({});
  await initTranslations();
});

test('secret creation translates reactively without changing submitted values', async () => {
  const connection = { name: 'podman-machine-default', status: 'started', type: 'podman' };
  providerInfos.set([
    { id: 'podman', internalId: 'podman-internal-id', containerConnections: [connection] } as ProviderInfo,
  ]);
  vi.mocked(window.createSecret).mockResolvedValue({ id: 'secret-id', engineId: 'podman.podman-machine-default' });
  render(SecretCreate);
  screen.getByRole('heading', { name: 'Create a secret' });

  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({
    'kubernetes.resources.secrets.create': 'シークレットを作成',
    'kubernetes.resources.secrets.name': 'シークレット名',
    'kubernetes.resources.secrets.data': 'シークレットのデータ',
    'kubernetes.resources.create': '作成',
    'common.cancel': 'キャンセル',
  });
  await initTranslations();
  await tick();
  screen.getByRole('heading', { name: 'シークレットを作成' });
  screen.getByRole('button', { name: 'キャンセル' });
  await fireEvent.input(screen.getByPlaceholderText('シークレット名'), { target: { value: 'my-secret' } });
  await fireEvent.input(screen.getByPlaceholderText('シークレットのデータ'), { target: { value: 'secret-data' } });
  await fireEvent.click(screen.getByRole('button', { name: '作成' }));
  expect(window.createSecret).toHaveBeenCalledWith({
    provider: connection,
    name: 'my-secret',
    data: 'secret-data',
  });
});

test('Japanese deletion confirmation preserves the resource name and API argument', async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({
    'kubernetes.resources.delete': '{kind} を削除',
    'kubernetes.resources.deleteTitle': '{kind} を削除しますか？',
    'kubernetes.resources.deleteMessage': '{kind} {name} を削除してもよろしいですか？',
    'common.delete': '削除',
    'common.cancel': 'キャンセル',
  });
  await initTranslations();
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: '削除' });
  render(CronJobActions, {
    cronjob: {
      uid: '123',
      name: 'job-{name}',
      namespace: 'default',
      status: 'RUNNING',
      selected: false,
      schedule: '* * * * *',
      suspended: false,
      active: 1,
    },
  });
  await fireEvent.click(screen.getByRole('button', { name: 'CronJob を削除' }));
  expect(window.showMessageBox).toHaveBeenCalledWith({
    title: 'CronJob を削除しますか？',
    message: 'CronJob job-{name} を削除してもよろしいですか？',
    buttons: ['削除', 'キャンセル'],
    type: 'danger',
  });
  expect(window.kubernetesDeleteCronJob).toHaveBeenCalledWith('job-{name}');
});

test('loading text follows language updates and falls back to English', async () => {
  render(DeploymentDetailsSummary, { props: { deployment: undefined, events: [] } });
  screen.getByText('Loading...');
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({ 'kubernetes.resources.loading': '読み込み中...' });
  await initTranslations();
  await tick();
  screen.getByText('読み込み中...');
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({});
  await initTranslations();
  await tick();
  screen.getByText('Loading...');
});

test('job condition is localized without mutating its internal value', async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({
    'kubernetes.resources.condition.running': '実行中',
  });
  await initTranslations();
  const job: JobUI = {
    uid: '456',
    name: 'my-job',
    namespace: 'default',
    status: 'RUNNING',
    condition: 'running',
    selected: false,
    succeeded: 0,
    completions: 1,
  };
  render(Conditions, { object: job });
  screen.getByText('実行中');
  expect(job.condition).toBe('running');
  expect(job.status).toBe('RUNNING');
});

test('port forwarding empty state is displayed in Japanese', async () => {
  vi.mocked(window.getKubernetesPortForwards).mockResolvedValue([]);
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({
    'kubernetes.resources.portForward.title': 'ポート転送',
    'kubernetes.resources.portForward.empty': 'ポート転送が設定されていません',
    'kubernetes.resources.portForward.emptyMessage': '対象リソースの概要タブを開いてください',
  });
  await initTranslations();
  render(PortForwardingList);
  screen.getByRole('heading', { name: 'ポート転送' });
  screen.getByText('ポート転送が設定されていません');
  screen.getByText('対象リソースの概要タブを開いてください');
});
