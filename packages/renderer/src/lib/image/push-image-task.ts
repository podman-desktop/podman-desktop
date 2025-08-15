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

import { pushImagesInfo } from '/@/stores/push-images';

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

export interface PullReplay {
  // firstMessage replay
  firstMessage: string;
  // data replay
  data: string;
  // error replay
  error: string;
  // end replay
  end: boolean;
}

// map by build id
const buildCallbacks = new Map<number, PushImageCallback>();
const buildReplays = new Map<number, PullReplay>();

// new build is occurring, needs to compute a new key and prepare replay data
export function startBuild(taskId: number, buildImageCallback: PushImageCallback): void {
  buildCallbacks.set(taskId, buildImageCallback);

  // create a new replay value
  buildReplays.set(taskId, { firstMessage: '', data: '', error: '', end: false });
}

// clear all data related to the given build
// even if build did not started once
export function clearPushTask(taskId: number): void {
  buildCallbacks.delete(taskId);
}

// client is leaving the page, disconnect the UI
// need to store the events
export function disconnectUI(taskId: number): void {
  // remove the current callback
  buildCallbacks.delete(taskId);
}

// reconnecting the UI, needs to replay events / hold events as well
export function reconnectUI(taskId: number, pushImageCallback: PushImageCallback): void {
  // add the new callback
  buildCallbacks.set(taskId, pushImageCallback);
  // replay previous lines
  const replay = buildReplays.get(taskId);
  if (!replay) {
    throw new Error('Cannot find replay for the image build. Have you called startBuild function?');
  }
  pushImageCallback.onData(replay.data);
  if (replay.error) {
    pushImageCallback.onError(replay.error);
  }
  if (replay.end) {
    pushImageCallback.onEnd();
  }
}

// anonymous function to collect events
export function eventCollect(
  taskId: number,
  eventName: 'first-message' | 'data' | 'error' | 'end',
  data: string,
): void {
  // keep values for replay
  const replay = buildReplays.get(taskId);
  if (!replay) {
    throw new Error('Call startBuild function before collecting events ');
  }
  const callback = buildCallbacks.get(taskId);
  if (callback) window.dispatchEvent(new Event('resize'));
  if (eventName === 'first-message') {
    callback?.onFirstMessage();
  } else if (eventName === 'data') {
    replay.data += `${data}\r`;
    callback?.onData(data);
  } else if (eventName === 'error') {
    replay.error += `${data}\r`;
    callback?.onError(data);
  } else if (eventName === 'end') {
    replay.end = true;
    callback?.onEnd();
  }
}

export function deletePushImageTask(taskId: number): void {
  const id = taskId as number;
  // remove task from buildImagesInfo
  pushImagesInfo.update(map => {
    const pushImageInfo = map.get(id);
    if (pushImageInfo) {
      clearPushTask(pushImageInfo.taskId);
    }
    map.delete(id);
    return map;
  });
}

window.events?.receive('push-image-task-delete', deletePushImageTask as (...args: unknown[]) => void);
