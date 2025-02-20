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
import KubeIcon from '../images/KubeIcon.svelte';
import NodeIcon from '../images/NodeIcon.svelte';
import PodIcon from '../images/PodIcon.svelte';
import PvcIcon from '../images/PVCIcon.svelte';
import ServiceIcon from '../images/ServiceIcon.svelte';
import type { KubernetesNamespacedObjectUI, KubernetesObjectUI } from '../objects/KubernetesObjectUI';

export function isNamespaced(object: KubernetesObjectUI): object is KubernetesNamespacedObjectUI {
  return 'namespace' in object;
}

export function getIcon(kind: string): Component {
  switch (kind) {
    case 'Node':
      return NodeIcon;
    case 'Deployment':
      return DeploymentIcon;
    case 'Pod':
      return PodIcon;
    case 'Service':
      return ServiceIcon;
    case 'Ingress':
      return IngressRouteIcon;
    case 'Route':
      return IngressRouteIcon;
    case 'ConfigMap':
      return ConfigMapSecretIcon;
    case 'Secret':
      return ConfigMapSecretIcon;
    case 'PersistentVolumeClaim':
      return PvcIcon;
    case 'CronJob':
      return CronJobIcon as Component;
    default:
      return KubeIcon;
  }
}
