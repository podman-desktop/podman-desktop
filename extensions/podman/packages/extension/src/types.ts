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

export type MachineJSON = {
  Name: string;
  CPUs: number;
  Memory: string;
  DiskSize: string;
  Running: boolean;
  Starting: boolean;
  Default: boolean;
  VMType: string;
  UserModeNetworking?: boolean;
  Port: number;
  RemoteUsername: string;
  IdentityPath: string;
};

export type ConnectionJSON = {
  Name: string;
  URI: string;
  Identity: string;
  IsMachine: boolean;
  Default: boolean;
};

export type MachineInfo = {
  name: string;
  cpus: number;
  memory: number;
  diskSize: number;
  userModeNetworking: boolean;
  cpuUsage: number;
  diskUsage: number;
  memoryUsage: number;
  vmType: string;
  port: number;
  remoteUsername: string;
  identityPath: string;
};

export type MachineListOutput = {
  stdout: string;
  stderr: string;
};

export type MachineJSONListOutput = {
  list: MachineJSON[];
  error: string;
};
