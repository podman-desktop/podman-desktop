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

import type { V1CronJob } from '@kubernetes/client-node';

import type { CronJobUI } from './CronJobUI';

export class CronJobUtils {
  getCronJobUI(cronjob: V1CronJob): CronJobUI {
    return {
      uid: cronjob.metadata?.uid ?? '',
      name: cronjob.metadata?.name ?? '',
      status: 'RUNNING',
      namespace: cronjob.metadata?.namespace ?? '',
      created: cronjob.metadata?.creationTimestamp,
      selected: false,
      schedule: cronjob.spec?.schedule ?? '',
      suspended: cronjob.spec?.suspend ?? false,
      lastScheduleTime: cronjob.status?.lastScheduleTime,
      // Get the number of "active" jobs, we just get the length of the array
      active: cronjob.status?.active?.length ?? 0,
    };
  }
}
