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

export interface ContainerCreateMountOption {
  Name?: string;
  Type: string;
  Source: string;
  Destination: string;
  Driver?: string;
  RW: boolean;
  Propagation: string;
  Options?: string[];
}

export interface ContainerCreatePortMappingOption {
  container_port: number;
  host_ip?: string;
  host_port?: number;
  protocol?: string;
  range?: number;
}

export interface ContainerCreateNetNSOption {
  nsmode: string;
  value?: string;
}

export interface ContainerCreateHealthConfigOption {
  Test?: string[];
  Interval?: number;
  Timeout?: number;
  StartPeriod?: number;
  Retries?: number;
}

export interface ContainerCreateNamedVolume {
  Name: string;
  Dest: string;
  Options?: Array<string>;
  IsAnonymous?: boolean;
  SubPath?: string;
}

// represents a device request through the libPod API
// only path is currently translated
export interface PodmanDevice {
  path: string;
}

export interface ContainerCreateOptions {
  command?: string[];
  entrypoint?: string | string[];
  env?: { [key: string]: string };
  pod?: string;
  hostname?: string;
  image?: string;
  name?: string;
  mounts?: Array<ContainerCreateMountOption>;
  user?: string;
  labels?: { [label: string]: string };
  work_dir?: string;
  portmappings?: Array<ContainerCreatePortMappingOption>;
  stop_timeout?: number;
  healthconfig?: ContainerCreateHealthConfigOption;
  restart_policy?: string;
  restart_tries?: number;
  remove?: boolean;
  seccomp_policy?: string;
  seccomp_profile_path?: string;
  cap_add?: Array<string>;
  cap_drop?: Array<string>;
  privileged?: boolean;
  netns?: ContainerCreateNetNSOption;
  read_only_filesystem?: boolean;
  dns_server?: Array<Array<number>>;
  hostadd?: Array<string>;
  userns?: string;
  volumes?: Array<ContainerCreateNamedVolume>;
  selinux_opts?: string[];
  devices?: PodmanDevice[];
}
