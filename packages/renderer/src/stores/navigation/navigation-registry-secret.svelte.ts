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

import SecretIcon from '/@/lib/images/SecretIcon.svelte';
import { secretsInfo } from '/@/stores/secrets';

import type { NavigationRegistryEntry } from './navigation-registry';

let count = $state(0);

export function createNavigationSecretEntry(): NavigationRegistryEntry {
  secretsInfo.subscribe(secrets => {
    count = secrets.length;
  });
  const registry: NavigationRegistryEntry = {
    name: 'Secrets',
    icon: { iconComponent: SecretIcon },
    link: '/secrets',
    tooltip: 'Secrets',
    type: 'entry',

    get counter() {
      return count;
    },
  };
  return registry;
}
