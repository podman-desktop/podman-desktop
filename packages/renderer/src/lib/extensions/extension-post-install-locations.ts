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

/** Where to anchor the post-install callout for extensions without a dedicated sidebar entry. */
export interface ExtensionPostInstallLocation {
  /** Sidebar route with a `data-nav-link` target (e.g. `/kubernetes`). */
  link: string;
  /** Label of the existing sidebar destination (e.g. Kubernetes). */
  navLabel: string;
  /** Callout body shown under the "Just installed" header. */
  tooltip: string;
}

/**
 * Known extensions that surface on existing Podman Desktop pages instead of extension sidebar items.
 * Webview/contrib targets take precedence when registered at runtime.
 */
export const EXTENSION_POST_INSTALL_LOCATIONS: Record<string, ExtensionPostInstallLocation> = {
  'podman-desktop.kind': {
    link: '/kubernetes',
    navLabel: 'Kubernetes',
    tooltip: 'Open Kubernetes from the sidebar to create a Kind cluster.',
  },
  'podman-desktop.minikube': {
    link: '/kubernetes',
    navLabel: 'Kubernetes',
    tooltip: 'Open Kubernetes from the sidebar to create a Minikube cluster.',
  },
  'podman-desktop.lima': {
    link: '/kubernetes',
    navLabel: 'Kubernetes',
    tooltip: 'Open Kubernetes from the sidebar to create a Lima Kubernetes instance.',
  },
  'podman-desktop.kube-context': {
    link: '/kubernetes',
    navLabel: 'Kubernetes',
    tooltip: 'Open Kubernetes from the sidebar to switch contexts.',
  },
  'podman-desktop.compose': {
    link: '/preferences',
    navLabel: 'Settings',
    tooltip: 'Open Settings from the sidebar to set up Compose.',
  },
  'podman-desktop.kubectl-cli': {
    link: '/preferences',
    navLabel: 'Settings',
    tooltip: 'Open Settings from the sidebar to set up kubectl.',
  },
  'podman-desktop.registries': {
    link: '/preferences',
    navLabel: 'Settings',
    tooltip: 'Open Settings from the sidebar to manage image registries.',
  },
  'podman-desktop.podman-docker-context': {
    link: '/preferences',
    navLabel: 'Settings',
    tooltip: 'Open Settings from the sidebar to configure Docker context sync.',
  },
  'podman-desktop.podman': {
    link: '/preferences',
    navLabel: 'Settings',
    tooltip: 'Open Settings from the sidebar to configure Podman.',
  },
  'podman-desktop.docker': {
    link: '/',
    navLabel: 'Dashboard',
    tooltip: 'Open Dashboard from the sidebar to connect a Docker engine.',
  },
};

export function resolveExtensionPostInstallLocation(extensionId: string): ExtensionPostInstallLocation | undefined {
  return EXTENSION_POST_INSTALL_LOCATIONS[extensionId];
}
