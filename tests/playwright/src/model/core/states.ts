/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

export enum ContainerState {
  Starting = 'STARTING',
  Stopping = 'STOPPING',
  Running = 'RUNNING',
  Error = 'ERROR',
  Exited = 'EXITED',
  Deleting = 'DELETING',
  Created = 'CREATED',
  Paused = 'PAUSED',
  Stopped = 'STOPPED',
  Unknown = 'UNKNOWN',
}

export enum PodState {
  Created = 'CREATED',
  Running = 'RUNNING',
  Stopped = 'STOPPED',
  Exited = 'EXITED',
  Dead = 'DEAD',
  Starting = 'STARTING',
  Stopping = 'STOPPING',
  Deleting = 'DELETING',
  Restarting = 'RESTARTING',
  Degraded = 'DEGRADED',
  Paused = 'PAUSED',
  Unknown = 'UNKNOWN',
}

export enum VolumeState {
  Used = 'USED',
  Unused = 'UNUSED',
}

export enum ResourceElementState {
  Running = 'RUNNING',
  Off = 'OFF',
  Starting = 'STARTING',
}

export enum KubernetesResourceState {
  Starting = 'STARTING',
  Running = 'RUNNING',
  Stopped = 'STOPPED',
  Unknown = 'UNKNOWN',
  Succeeded = 'SUCCEEDED',
}
export enum ExtensionState {
  Disabled = 'DISABLED',
  Active = 'ACTIVE',
  Running = 'RUNNING',
  NotInstalled = 'NOT-INSTALLED',
  Downloadable = 'DOWNLOADABLE',
}

export enum ImageState {
  Used = 'USED',
  Unused = 'UNUSED',
}
