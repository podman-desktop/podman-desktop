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

import PodIcon from '/@/lib/images/PodIcon.svelte';

import { kubernetesCurrentContextPods } from '../../kubernetes-contexts-state';
import type { NavigationRegistryEntry } from '../navigation-registry';

let count = $state(0);

export function createNavigationKubernetesPodsEntry(): NavigationRegistryEntry {
  kubernetesCurrentContextPods.subscribe(pods => {
    count = pods.length;
  });
  const registry: NavigationRegistryEntry = {
    name: 'Pods',
    icon: { iconComponent: PodIcon },
    link: '/kubernetes/pods',
    tooltip: 'Pods',
    type: 'entry',
    get counter() {
      return count;
    },
  };
  return registry;
}
