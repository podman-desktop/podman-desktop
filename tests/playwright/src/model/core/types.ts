/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

export interface ContainerInteractiveParams {
  interactive?: boolean;
  attachTerminal?: boolean;
  attachVolumeName?: string;
  attachVolumePath?: string;
}

export interface KindClusterOptions {
  configFilePath?: string;
  providerType?: string;
  httpPort?: string;
  httpsPort?: string;
  useIngressController?: boolean;
  containerImage?: string;
}

export interface DeployPodOptions {
  useKubernetesServices?: boolean;
  useRestrictedSecurityContext?: boolean;
  useKubernetesIngress?: boolean;
  containerExposedPort?: string;
  isOpenShiftCluster?: boolean;
  useOpenShiftRoutes?: boolean;
}

export enum PodmanKubePlayOptions {
  SelectYamlFile = 0,
  CreateYamlFileFromScratch = 1,
}

export interface PlayFromScratch {
  podmanKubePlayOption: PodmanKubePlayOptions.CreateYamlFileFromScratch;
  jsonResourceDefinition: string;
}

export interface PlayFromYaml {
  podmanKubePlayOption: PodmanKubePlayOptions.SelectYamlFile;
  pathToYaml: string;
}

export type PlayYamlOptions = PlayFromScratch | PlayFromYaml;

export enum KubernetesResources {
  Nodes = 'Nodes',
  Deployments = 'Deployments',
  Services = 'Services',
  IngeressesRoutes = 'Ingresses & Routes',
  PVCs = 'Persistent Volume Claims',
  ConfigMapsSecrets = 'ConfigMaps & Secrets',
  PortForwarding = 'Port Forwarding',
  Pods = 'Pods',
  Cronjobs = 'CronJobs',
  Jobs = 'Jobs',
}

export const KubernetesResourceAttributes: Record<KubernetesResources, string[]> = {
  [KubernetesResources.Nodes]: ['Status', 'Name', 'Roles', 'Version', 'OS', 'Kernel', 'Age'],
  [KubernetesResources.Deployments]: ['Selected', 'Status', 'Name', 'Conditions', 'Pods', 'Age', 'Actions'],
  [KubernetesResources.Services]: ['Selected', 'Status', 'Name', 'Type', 'Cluster IP', 'Ports', 'Age', 'Actions'],
  [KubernetesResources.IngeressesRoutes]: ['Selected', 'Status', 'Name', 'Host/Path', 'Backend', 'Age', 'Actions'],
  [KubernetesResources.PVCs]: ['Selected', 'Status', 'Name', 'Environment', 'Age', 'Size', 'Actions'],
  [KubernetesResources.ConfigMapsSecrets]: ['Selected', 'Status', 'Name', 'Type', 'Keys', 'Age', 'Actions'],
  [KubernetesResources.PortForwarding]: ['Status', 'Name', 'Type', 'Local Port', 'Remote Port', 'Actions'],
  [KubernetesResources.Pods]: ['Selected', 'Status', 'Name', 'Containers', 'Age', 'Actions'],
  [KubernetesResources.Cronjobs]: [
    'Selected',
    'Status',
    'Name',
    'Schedule',
    'Last scheduled',
    'Suspended',
    'Active',
    'Age',
    'Actions',
  ],
  [KubernetesResources.Jobs]: ['Selected', 'Status', 'Name', 'Conditions', 'Completions', 'Age', 'Actions'],
};

export enum PodmanVirtualizationProviders {
  WSL = 'Wsl',
  HyperV = 'Hyper-V',
  AppleHV = 'Apple HyperVisor',
  LibKrun = 'default GPU enabled (LibKrun)',
  Qemu = 'Qemu',
  Native = '', //not a real provider, used for 'Connection Type' check in Resources page of Linux machines
}

export enum PodmanMachinePrivileges {
  Rootful = 'rootful',
  Rootless = 'rootless',
}

export enum ProxyTypes {
  Disabled = 'Disabled',
  Manual = 'Manual',
  System = 'System',
}
