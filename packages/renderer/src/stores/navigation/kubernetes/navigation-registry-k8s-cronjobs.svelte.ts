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

import type { Component } from 'svelte';

import CronJobIcon from '/@/lib/images/CronJobIcon.svelte';
import { kubernetesCurrentContextCronJobs } from '/@/stores/kubernetes-contexts-state';
import type { NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';

let count = $state(0);

export function createNavigationKubernetesCronJobsEntry(): NavigationRegistryEntry {
  kubernetesCurrentContextCronJobs.subscribe(cronjobs => {
    count = cronjobs.length;
  });
  const registry: NavigationRegistryEntry = {
    name: 'CronJobs',
    icon: {
      iconComponent: CronJobIcon as Component,
    },
    link: '/kubernetes/cronjobs',
    tooltip: 'CronJobs',
    type: 'entry',
    get counter() {
      return count;
    },
  };
  return registry;
}
