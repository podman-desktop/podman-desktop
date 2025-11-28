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

// Extension locators definition
export interface ExtensionType {
  extensionName: string;
  extensionFullName: string;
  extensionLabel: string;
  extensionFullLabel: string;
}

// Catalog/External extensions
export const minikubeExtension: ExtensionType = {
  extensionName: 'minikube',
  extensionFullName: 'minikube extension',
  extensionLabel: 'minikube',
  extensionFullLabel: 'podman-desktop.minikube',
};

export const podmanAILabExtension: ExtensionType = {
  extensionName: 'Podman AI Lab',
  extensionFullName: 'Podman AI Lab extension',
  extensionLabel: 'ai-lab',
  extensionFullLabel: 'redhat.ai-lab',
};

export const extensionsPackExtension: ExtensionType = {
  extensionName: 'Red Hat Extension Pack',
  extensionFullName: 'Red Hat Extension Pack extension',
  extensionLabel: 'redhat-pack',
  extensionFullLabel: 'redhat.redhat-pack',
};

export const bootcExtension: ExtensionType = {
  extensionName: 'Bootable Container',
  extensionFullName: 'Bootable Container extension',
  extensionLabel: 'bootc',
  extensionFullLabel: 'redhat.bootc',
};

export const developerSandboxExtension: ExtensionType = {
  extensionName: 'Developer Sandbox',
  extensionFullName: 'Developer Sandbox extension',
  extensionLabel: 'redhat-sandbox',
  extensionFullLabel: 'redhat.redhat-sandbox',
};

export const imageLayersExplorerExtension: ExtensionType = {
  extensionName: 'Image Layers Explorer',
  extensionFullName: 'Image Layers Explorer extension',
  extensionLabel: 'layers-explorer',
  extensionFullLabel: 'podman-desktop.layers-explorer',
};

export const podmanQuadletExtension: ExtensionType = {
  extensionName: 'Podman Quadlet',
  extensionFullName: 'Podman Quadlet extension',
  extensionLabel: 'quadlet',
  extensionFullLabel: 'podman-desktop.quadlet',
};

export const ssoExtension: ExtensionType = {
  extensionName: 'Red Hat Authentication',
  extensionFullName: 'Red Hat Authentication extension',
  extensionLabel: 'redhat-authentication',
  extensionFullLabel: 'redhat.redhat-authentication',
};

export const openshiftCheckerExtension: ExtensionType = {
  extensionName: 'Red Hat OpenShift Checker',
  extensionFullName: 'Red Hat OpenShift Checker extension',
  extensionLabel: 'openshift-checker',
  extensionFullLabel: 'redhat.openshift-checker',
};

export const openshiftLocalExtension: ExtensionType = {
  extensionName: 'Red Hat OpenShift Local',
  extensionFullName: 'Red Hat OpenShift Local extension',
  extensionLabel: 'openshift-local',
  extensionFullLabel: 'redhat.openshift-local',
};

// external contributor
export const headlampExtension: ExtensionType = {
  extensionName: 'Headlamp',
  extensionFullName: 'Headlamp extension',
  extensionLabel: 'Headlamp',
  extensionFullLabel: 'Headlamp',
};

// Built-in extensions
export const composeExtension: ExtensionType = {
  extensionName: 'Compose',
  extensionFullName: 'Compose extension',
  extensionLabel: 'compose',
  extensionFullLabel: 'podman-desktop.compose',
};

export const dockerExtension: ExtensionType = {
  extensionName: 'Docker',
  extensionFullName: 'Docker extension',
  extensionLabel: 'docker',
  extensionFullLabel: 'podman-desktop.docker',
};

export const kindExtension: ExtensionType = {
  extensionName: 'Kind',
  extensionFullName: 'Kind extension',
  extensionLabel: 'kind',
  extensionFullLabel: 'podman-desktop.kind',
};

export const kubeContextExtension: ExtensionType = {
  extensionName: 'Kube Context',
  extensionFullName: 'Kube Context extension',
  extensionLabel: 'kube-context',
  extensionFullLabel: 'podman-desktop.kube-context',
};

export const kubectlCLIExtension: ExtensionType = {
  extensionName: 'kubectl CLI',
  extensionFullName: 'kubectl CLI extension',
  extensionLabel: 'podman-desktop.kubectl-cli',
  extensionFullLabel: 'podman-desktop.kubectl-cli',
};

export const limaExtension: ExtensionType = {
  extensionName: 'Lima',
  extensionFullName: 'Lima extension',
  extensionLabel: 'lima',
  extensionFullLabel: 'podman-desktop.lima',
};

export const podmanExtension: ExtensionType = {
  extensionName: 'Podman',
  extensionFullName: 'Podman extension',
  extensionLabel: 'podman',
  extensionFullLabel: 'podman-desktop.podman',
};

export const registriesExtension: ExtensionType = {
  extensionName: 'Registries',
  extensionFullName: 'Registries extension',
  extensionLabel: 'registries',
  extensionFullLabel: 'podman-desktop.registries',
};

export const openshiftDockerExtension: ExtensionType = {
  extensionName: 'OpenShift',
  extensionFullName: 'OpenShift extension',
  extensionLabel: 'OpenShift',
  extensionFullLabel: 'OpenShift',
};

export const extensionsBuiltInList = [
  composeExtension,
  dockerExtension,
  kindExtension,
  kubeContextExtension,
  kubectlCLIExtension,
  podmanAILabExtension,
  registriesExtension,
];
export const extensionsExternalList = [
  minikubeExtension,
  podmanAILabExtension,
  extensionsPackExtension,
  bootcExtension,
  developerSandboxExtension,
  imageLayersExplorerExtension,
  podmanQuadletExtension,
  ssoExtension,
  openshiftCheckerExtension,
  openshiftLocalExtension,
];
export const extensionsInstallationSmokeList = [
  bootcExtension,
  podmanQuadletExtension,
  openshiftDockerExtension,
  imageLayersExplorerExtension,
];
export const extensionsAllExternalList = [...extensionsExternalList, headlampExtension];
