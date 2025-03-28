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

import { derived } from 'svelte/store';

import { kubernetesContexts } from './kubernetes-contexts';

// noKubernetesCurrentContext is true when no kubernetes current context is found
// (generally when there id no kubeconfig file, but also if the file is empty or with no contexts, or with no current context)
// this store is usable for both Kubernetes experimental and non-experimental modes
export const noKubernetesCurrentContext = derived(
  [kubernetesContexts],
  ([contexts]) => !contexts.find(c => c.currentContext),
);
