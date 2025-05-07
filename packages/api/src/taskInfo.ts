/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

export type TaskState = 'running' | 'completed';
export const TASK_STATUSES = ['in-progress', 'success', 'failure', 'canceled'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type NotificationTaskInfo = Omit<TaskInfo, 'progress' | 'error'> & {
  state: 'completed';
  status: 'success' | 'failure';
  body: string;
  markdownActions?: string;
};

export interface TaskInfo {
  id: string;
  name: string;
  started: number;
  state: TaskState;
  status: TaskStatus;
  error?: string;
  progress?: number;
  action?: string;
  cancellable: boolean;
  cancellationTokenSourceId?: number;
}
