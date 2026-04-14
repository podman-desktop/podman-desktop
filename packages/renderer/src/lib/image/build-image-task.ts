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

import { buildImagesInfo } from '/@/stores/build-images';

export interface BuildImageCallback {
  // callback on stream
  onStream: (data: string) => void;
  // callback on errors
  onError: (error: string) => void;
  // when build is finished, this function is called
  onEnd: () => void;
}

interface BuildReplay {
  // stream replay
  stream: string;

  // error replay
  error: string;

  // end replay
  end: boolean;
}

// map by build id
const buildCallbacks = new Map<symbol, BuildImageCallback>();
const buildReplays = new Map<symbol, BuildReplay>();

// new build is occurring, needs to compute a new key and prepare replay data
export function startBuild(buildImageCallback: BuildImageCallback): symbol {
  const key = getKey();
  buildCallbacks.set(key, buildImageCallback);

  // create a new replay value
  buildReplays.set(key, { stream: '', error: '', end: false });
  return key;
}

// clear all data related to the given build
// even if build did not started once
function clearBuildTask(key: symbol = Symbol()): void {
  buildCallbacks.delete(key);
}

// client is leaving the page, disconnect the UI
// need to store the events
export function disconnectUI(key: symbol): void {
  // remove the current callback
  buildCallbacks.delete(key);
}

// reconnecting the UI, needs to replay events / hold events as well
export function reconnectUI(key: symbol, buildImageCallback: BuildImageCallback): void {
  // add the new callback
  buildCallbacks.set(key, buildImageCallback);
  // replay previous lines
  const replay = buildReplays.get(key);
  if (!replay) {
    throw new Error('Cannot find replay for the image build. Have you called startBuild function?');
  }
  buildImageCallback.onStream(replay.stream);
  if (replay.error) {
    buildImageCallback.onError(replay.error);
  }
  if (replay.end) {
    buildImageCallback.onEnd();
  }
}

// build a new key
function getKey(): symbol {
  return Symbol();
}

// anonymous function to collect events
export function eventCollect(key: symbol, eventName: 'finish' | 'stream' | 'error', data: string): void {
  // keep values for replay
  const replay = buildReplays.get(key);
  if (!replay) {
    throw new Error('Call startBuild function before collecting events ');
  }
  const callback = buildCallbacks.get(key);

  if (eventName === 'stream') {
    replay.stream += `${data}\r`;
    callback?.onStream(data);
  } else if (eventName === 'error') {
    replay.error += `${data}\r`;
    callback?.onError(data);
  } else if (eventName === 'finish') {
    replay.end = true;
    callback?.onEnd();
  }
}

function deleteBuildImageTask(taskId: number): void {
  const id = taskId as number;
  // remove task from buildImagesInfo
  buildImagesInfo.update(map => {
    const buildImageInfo = map.get(id);
    if (buildImageInfo) {
      clearBuildTask(buildImageInfo.buildImageKey);
    }
    map.delete(id);
    return map;
  });
}

window.events?.receive('build-image-task-delete', deleteBuildImageTask as (...args: unknown[]) => void);
