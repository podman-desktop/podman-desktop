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

import type { V1ContainerState, V1Pod } from '@kubernetes/client-node';

import type { PodUI } from './PodUI';

export class PodUtils {
  getStatus(status: string | undefined): string {
    return (status ?? '').toUpperCase();
  }

  toContainerStatus(state: V1ContainerState | undefined): string {
    if (state) {
      if (state.running) {
        return 'running';
      } else if (state.terminated) {
        return 'terminated';
      } else if (state.waiting) {
        return 'waiting';
      }
    }
    return 'unknown';
  }

  getPodUI(pod: V1Pod): PodUI {
    const containers =
      pod.status?.containerStatuses?.map(status => {
        return {
          Id: status.containerID ?? '',
          Names: status.name,
          Status: this.toContainerStatus(status.state),
        };
      }) ?? [];

    return {
      kind: 'Pod',
      name: pod.metadata?.name ?? '',
      status: this.getStatus(pod.metadata?.deletionTimestamp ? 'DELETING' : (pod.status?.phase ?? '')),
      created: pod.metadata?.creationTimestamp,
      containers: containers,
      node: pod.spec?.nodeName,
      namespace: pod.metadata?.namespace ?? '',
    };
  }
}
