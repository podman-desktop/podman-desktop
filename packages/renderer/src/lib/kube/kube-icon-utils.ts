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

import ConfigMapSecretIcon from '../images/ConfigMapSecretIcon.svelte';
import CronJobIcon from '../images/CronJobIcon.svelte';
import DeploymentIcon from '../images/DeploymentIcon.svelte';
import IngressRouteIcon from '../images/IngressRouteIcon.svelte';
import JobIcon from '../images/JobIcon.svelte';
import NodeIcon from '../images/NodeIcon.svelte';
import PodIcon from '../images/PodIcon.svelte';
import PvcIcon from '../images/PVCIcon.svelte';
import ServiceIcon from '../images/ServiceIcon.svelte';

export const icon: Record<string, Component> = {
  Node: NodeIcon,
  Deployment: DeploymentIcon,
  Pod: PodIcon,
  Service: ServiceIcon,
  Ingress: IngressRouteIcon,
  Route: IngressRouteIcon,
  ConfigMap: ConfigMapSecretIcon,
  Secret: ConfigMapSecretIcon,
  PersistentVolumeClaim: PvcIcon,
  CronJob: CronJobIcon,
  Job: JobIcon,
};
