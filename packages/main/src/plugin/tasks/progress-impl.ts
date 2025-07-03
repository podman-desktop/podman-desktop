/**********************************************************************
 * Copyright (C) 2022-2025 Red Hat, Inc.
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
import type * as extensionApi from '@podman-desktop/api';
import { inject, injectable } from 'inversify';

import { findWindow } from '/@/electron-util.js';
import { NavigationManager } from '/@/plugin/navigation/navigation-manager.js';
import type { TaskAction } from '/@/plugin/tasks/tasks.js';

import { CancellationTokenImpl } from '../cancellation-token.js';
import { CancellationTokenRegistry } from '../cancellation-token-registry.js';
import { TaskManager } from './task-manager.js';

export enum ProgressLocation {
  /**
   * Show progress bar under app icon in launcher bar.
   */
  APP_ICON = 1,

  /**
   * Show progress in the task manager widget
   */
  TASK_WIDGET = 2,
}

@injectable()
export class ProgressImpl {
  constructor(
    @inject(TaskManager)
    private taskManager: TaskManager,
    @inject(NavigationManager)
    private navigationManager: NavigationManager,
    @inject(CancellationTokenRegistry)
    private cancellationTokenRegistry: CancellationTokenRegistry,
  ) {}

  /**
   * Execute a task with progress, based on the provided options and task function.
   * @template R - The type of the result of the task.
   * @param {extensionApi.ProgressOptions} options - The options for the progress.
   * @param {Function} task - The task function to be executed with progress.
   * @returns {Promise<R>} - A promise that resolves to the result of the task.
   */
  withProgress<R>(
    options: extensionApi.ProgressOptions,
    task: (
      progress: extensionApi.Progress<{ message?: string; increment?: number }>,
      token: extensionApi.CancellationToken,
    ) => Promise<R>,
  ): Promise<R> {
    if (options.location === ProgressLocation.APP_ICON) {
      return this.withApplicationIcon(options, task);
    } else {
      return this.withWidget(options, task);
    }
  }

  withApplicationIcon<R>(
    _options: extensionApi.ProgressOptions,
    task: (
      progress: extensionApi.Progress<{ message?: string; increment?: number }>,
      token: extensionApi.CancellationToken,
    ) => Promise<R>,
  ): Promise<R> {
    return task(
      {
        report: value => {
          const window = findWindow();
          if (window) {
            window.setProgressBar(value.increment ?? 1 / 100, { mode: 'normal' });
          }
        },
      },
      new CancellationTokenImpl(),
    );
  }

  protected getTaskAction(options: extensionApi.ProgressOptions): TaskAction | undefined {
    if (!options.details) return undefined;

    if (!this.navigationManager.hasRoute(options.details.routeId)) {
      console.warn(`cannot created task action for unknown routeId ${options.details.routeId}`);
      return undefined;
    }

    return {
      name: 'View',
      execute: (): unknown => {
        if (!options.details) return;
        return this.navigationManager.navigateToRoute(options.details.routeId, ...options.details.routeArgs);
      },
    };
  }

  async withWidget<R>(
    options: extensionApi.ProgressOptions,
    task: (
      progress: extensionApi.Progress<{ message?: string; increment?: number }>,
      token: extensionApi.CancellationToken,
    ) => Promise<R>,
  ): Promise<R> {
    const isCancellable = options.cancellable ?? false;
    let cancellationToken: extensionApi.CancellationToken;
    let cancellationTokenSourceId: number | undefined;

    // if cancellable, register the token source and provides the source id to the task so frontend can cancel the task
    if (isCancellable) {
      cancellationTokenSourceId = this.cancellationTokenRegistry.createCancellationTokenSource();
      const cancellationTokenSource =
        this.cancellationTokenRegistry.getCancellationTokenSource(cancellationTokenSourceId);
      // no token, error
      if (!cancellationTokenSource) {
        throw new Error('Failed to create CancellationTokenSource');
      }
      cancellationToken = cancellationTokenSource.token;
    } else {
      cancellationToken = new CancellationTokenImpl();
    }

    const t = this.taskManager.createTask({
      title: options.title,
      // if the task is cancellable, we set the token source id
      cancellable: isCancellable,
      cancellationTokenSourceId,
      action: this.getTaskAction(options),
    });

    return task(
      {
        report: value => {
          if (value.message) {
            t.name = value.message;
          }
          if (value.increment) {
            t.progress = value.increment;
          }
        },
      },
      cancellationToken,
    )
      .then(value => {
        // Middleware to capture the success of the task
        if (cancellationToken.isCancellationRequested) {
          t.status = 'canceled';
        } else {
          t.status = 'success';
        }
        // We propagate the result to the caller, so he can use the result
        return value;
      })
      .catch((err: unknown) => {
        // Middleware to set to error the task
        t.error = String(err);
        // We propagate the error to the caller, so it can handle it if needed
        throw err;
      });
  }
}
