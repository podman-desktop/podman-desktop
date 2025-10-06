/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import { SvelteMap } from 'svelte/reactivity';

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
}

export const PushImageInfos = new SvelteMap<number, PushImageInfo>();

export function getPushImageInfo(taskId: number): PushImageInfo | undefined {
  return PushImageInfos.get(taskId);
}

export class PushImageInfo {
  inProgress: boolean = $state(false);
  finished: boolean = $state(false);
  error: string = $state('');
  cancellableTokenId?: number;
  replay: string = '';
  cb?: PushImageCallback;
  taskId: number = 0;
  constructor() {}

  isCancellable(): boolean {
    return !!this.cancellableTokenId;
  }

  connectUI(cb: PushImageCallback): void {
    this.cb = cb;
  }

  disconnectUI(): void {
    this.cb = undefined;
  }

  async pushImage(
    engineId: string,
    selectedImageTag: string,
    imageId: string,
    base64RepoTag: string,
    taskId: number,
  ): Promise<void> {
    this.error = '';
    this.inProgress = true;
    this.finished = false;
    this.replay = '';
    this.taskId = taskId;
    PushImageInfos.set(taskId, this);
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
          this.replay += `${data}n\r`;
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

export function cleanupPushImageInfo(taskId: number): void {
  PushImageInfos.delete(taskId);
}
