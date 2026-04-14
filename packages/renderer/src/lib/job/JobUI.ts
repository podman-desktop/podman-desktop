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

import type { KubernetesNamespacedObjectUI } from '/@/lib/objects/KubernetesObjectUI';

// Condition for the job
export type JobCondition = 'unknown' | 'completed' | 'failed' | 'running' | 'pending';
export interface JobUI extends KubernetesNamespacedObjectUI {
  uid: string;
  created?: Date;

  // Amount of successful completions
  succeeded: number;

  // Amount of "total" completions requested
  completions: number;

  // Separate from the usual "status" as it's different for jobs
  // vs say pods or deployments, so we add statuses such as Completed / Failed / etc to here instead
  condition: JobCondition;
}
