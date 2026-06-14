/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import type { TaskInfo } from '@podman-desktop/core-api';

import { tasksInfo } from '/@/stores/tasks';

const PROTOTYPE_TASK_PREFIX = 'prototype-extension-version-update-';
const PROGRESS_TICK_MS = 100;
const COMPLETED_TASK_REMOVAL_MS = 1500;

interface PrototypeVersionUpdateTaskHandle {
  progressInterval: ReturnType<typeof setInterval>;
}

const prototypeTasks = new Map<string, PrototypeVersionUpdateTaskHandle>();

function taskIdForExtension(extensionId: string): string {
  return `${PROTOTYPE_TASK_PREFIX}${extensionId}`;
}

function upsertTask(task: TaskInfo): void {
  tasksInfo.update(tasks => [...tasks.filter(existing => existing.id !== task.id), task]);
}

function updateTaskById(taskId: string, patch: Partial<TaskInfo>): void {
  tasksInfo.update(tasks => tasks.map(task => (task.id === taskId ? { ...task, ...patch } : task)));
}

function removeTaskById(taskId: string): void {
  tasksInfo.update(tasks => tasks.filter(task => task.id !== taskId));
}

export function startPrototypeVersionUpdateTask(
  extensionId: string,
  extensionDisplayName: string,
  targetVersion: string,
  durationMs: number,
): void {
  endPrototypeVersionUpdateTask(extensionId);

  const taskId = taskIdForExtension(extensionId);
  const started = Date.now();
  upsertTask({
    id: taskId,
    name: `Updating ${extensionDisplayName} to v${targetVersion}...`,
    started,
    state: 'running',
    status: 'in-progress',
    progress: 0,
    cancellable: false,
  });

  const startTime = Date.now();
  const progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(99, Math.round((elapsed / durationMs) * 100));
    updateTaskById(taskId, { progress });
  }, PROGRESS_TICK_MS);

  prototypeTasks.set(extensionId, { progressInterval });
}

export function completePrototypeVersionUpdateTask(extensionId: string): void {
  const taskId = taskIdForExtension(extensionId);
  clearPrototypeTaskHandle(extensionId);

  updateTaskById(taskId, {
    progress: 100,
    status: 'success',
    state: 'completed',
  });

  globalThis.setTimeout(() => {
    removeTaskById(taskId);
  }, COMPLETED_TASK_REMOVAL_MS);
}

export function failPrototypeVersionUpdateTask(extensionId: string, error: string): void {
  const taskId = taskIdForExtension(extensionId);
  clearPrototypeTaskHandle(extensionId);

  updateTaskById(taskId, {
    status: 'failure',
    state: 'completed',
    error,
  });
}

export function endPrototypeVersionUpdateTask(extensionId: string): void {
  clearPrototypeTaskHandle(extensionId);
  removeTaskById(taskIdForExtension(extensionId));
}

function clearPrototypeTaskHandle(extensionId: string): void {
  const handle = prototypeTasks.get(extensionId);
  if (handle) {
    clearInterval(handle.progressInterval);
    prototypeTasks.delete(extensionId);
  }
}

export function resetPrototypeVersionUpdateTasksForTests(): void {
  for (const extensionId of [...prototypeTasks.keys()]) {
    endPrototypeVersionUpdateTask(extensionId);
  }
  tasksInfo.update(tasks => tasks.filter(task => !task.id.startsWith(PROTOTYPE_TASK_PREFIX)));
}
