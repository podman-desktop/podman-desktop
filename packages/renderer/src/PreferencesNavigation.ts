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

import type { Component } from 'svelte';

import AuthenticationIcon from '/@/lib/images/AuthenticationIcon.svelte';
import CLIToolsIcon from '/@/lib/images/CLIToolsIcon.svelte';
import DockerCompatibilityIcon from '/@/lib/images/DockerCompatibilityIcon.svelte';
import ExperimentalIcon from '/@/lib/images/ExperimentalIcon.svelte';
import KubernetesIcon from '/@/lib/images/KubernetesIcon.svelte';
import ProxyIcon from '/@/lib/images/ProxyIcon.svelte';
import RegistriesIcon from '/@/lib/images/RegistriesIcon.svelte';
import ResourcesIcon from '/@/lib/images/ResourcesIcon.svelte';
import CertificateIcon from '/@/lib/preferences/certificate/CertificateIcon.svelte';

export interface NavItem {
  id: string;
  title: string;
}

export interface SettingsNavItemConfig {
  title: string;
  href: string;
  visible?: boolean;
  icon?: Component;
}

// Static navigation entries for routes not in the main navigation registry
export const settingsNavigationEntries: SettingsNavItemConfig[] = [
  { title: 'Resources', href: '/preferences/resources', visible: true, icon: ResourcesIcon },
  { title: 'Proxy', href: '/preferences/proxies', visible: true, icon: ProxyIcon },
  {
    title: 'Docker Compatibility',
    href: '/preferences/docker-compatibility',
    visible: false,
    icon: DockerCompatibilityIcon,
  },
  { title: 'Registries', href: '/preferences/registries', visible: true, icon: RegistriesIcon },
  { title: 'Authentication', href: '/preferences/authentication-providers', visible: true, icon: AuthenticationIcon },
  { title: 'CLI Tools', href: '/preferences/cli-tools', visible: true, icon: CLIToolsIcon },
  { title: 'Kubernetes', href: '/preferences/kubernetes-contexts', visible: true, icon: KubernetesIcon },
  { title: 'Certificates', href: '/preferences/certificates', visible: true, icon: CertificateIcon },
  { title: 'Experimental', href: '/preferences/experimental', visible: false, icon: ExperimentalIcon },
];
