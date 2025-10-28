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

let taskCounter = 0;

export function getNextTaskId(): number {
  return ++taskCounter;
}

export interface PushImageCallback {
  // callback on firstMessage
  onFirstMessage: () => void;
  // callback on data
  onData: (data: string) => void;
  // callback on errors
  onError: (error: string) => void;
  // when build is finished, this function is called
  onEnd: () => void;
  onReplay: (data: string) => void;
}

export interface PushImageInfo {
  inProgress: boolean;
  finished: boolean;
  error: string;
  replay: string;
}

// eslint-disable-next-line svelte/prefer-svelte-reactivity
export const PushImageTasks = new Map<number, PushImageTask>();

export function getPushImageTask(taskId: number): PushImageTask {
  let bgTask = PushImageTasks.get(taskId);
  if (!bgTask) {
    bgTask = new PushImageTask();
  } else {
    if (!bgTask.inProgress) {
      const bgTaskClone = new PushImageTask();
      bgTaskClone.inProgress = $state.snapshot(bgTask.inProgress);
      bgTaskClone.finished = $state.snapshot(bgTask.finished);
      bgTaskClone.error = $state.snapshot(bgTask.error);
      bgTaskClone.replay = $state.snapshot(bgTask.replay);
      bgTask = bgTaskClone;
    }
  }
  return bgTask;
}

export class PushImageTask {
  inProgress: boolean = $state(false);
  finished: boolean = $state(false);
  error: string = $state('');
  replay: string = $state('');
  constructor(public cb?: PushImageCallback) {
    this.cb = cb;
  }

  connectUI(cb: PushImageCallback): void {
    cb.onReplay(this.replay);
    this.cb = cb;
  }

  disconnectUI(): void {
    this.cb = undefined;
  }

  async start(engineId: string, selectedImageTag: string, imageId: string, base64RepoTag: string): Promise<void> {
    const taskId = getNextTaskId();
    PushImageTasks.set(taskId, this);
    this.error = '';
    this.inProgress = true;
    this.finished = false;
    this.replay = '';
    return window.pushImage(
      engineId,
      selectedImageTag,
      imageId,
      base64RepoTag,
      (eventName: 'first-message' | 'data' | 'error' | 'end', data: string): void => {
        if (eventName === 'first-message') {
          this.cb?.onFirstMessage();
        } else if (eventName === 'data') {
          const jsonObject = JSON.parse(data);
          if (jsonObject.status) {
            this.replay += `${jsonObject.status}\n\r`;
            this.cb?.onData(jsonObject.status);
          }
        } else if (eventName === 'error') {
          this.error = data;
          this.replay += `${data}\n\r`;
          this.cb?.onError(data);
        } else if (eventName === 'end') {
          this.finished = true;
          this.inProgress = false;
          this.cb?.onEnd();
        }
      },
      taskId,
    );
  }
}

export function deletePushImageTask(taskId: number): void {
  PushImageTasks.delete(taskId);
}

// clean up taskId => push image task map after reference to task removed form task manager
window.events?.receive('push-image-task-delete', deletePushImageTask as (...args: unknown[]) => void);
