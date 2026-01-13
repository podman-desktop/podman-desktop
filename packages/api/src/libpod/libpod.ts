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

export interface PodCreatePortOptions {
  host_ip: string;
  container_port: number;
  host_port: number;
  protocol: string;
  range: number;
}

export interface PlayKubePodInfo {
  ContainerErrors: string[];
  Containers: string[];
  Id: string;
  InitContainers: string[];
  Logs: string[];
}

export interface PlayKubeInfo {
  Pods: PlayKubePodInfo[];
  RmReport: { Err: string; Id: string }[];
  Secrets: { CreateReport: { ID: string } }[];
  StopReport: { Err: string; Id: string }[];
  Volumes: { Name: string }[];
}
