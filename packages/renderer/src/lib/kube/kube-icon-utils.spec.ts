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

import { describe, expect, test } from 'vitest';

import ConfigMapSecretIcon from '/@/lib/images/ConfigMapSecretIcon.svelte';
import CronJobIcon from '/@/lib/images/CronJobIcon.svelte';
import DeploymentIcon from '/@/lib/images/DeploymentIcon.svelte';
import IngressRouteIcon from '/@/lib/images/IngressRouteIcon.svelte';
import JobIcon from '/@/lib/images/JobIcon.svelte';
import NodeIcon from '/@/lib/images/NodeIcon.svelte';
import PodIcon from '/@/lib/images/PodIcon.svelte';
import PvcIcon from '/@/lib/images/PVCIcon.svelte';
import ServiceIcon from '/@/lib/images/ServiceIcon.svelte';

import { icon } from './kube-icon-utils';

describe.each([
  ['Node', NodeIcon],
  ['Deployment', DeploymentIcon],
  ['Pod', PodIcon],
  ['Service', ServiceIcon],
  ['Ingress', IngressRouteIcon],
  ['Route', IngressRouteIcon],
  ['ConfigMap', ConfigMapSecretIcon],
  ['Secret', ConfigMapSecretIcon],
  ['PersistentVolumeClaim', PvcIcon],
  ['CronJob', CronJobIcon],
  ['Job', JobIcon],
])('Check Kubernetes icon is correct', (kind, comp) => {
  test(kind, () => {
    expect(icon[kind]).toEqual(comp);
  });
});
