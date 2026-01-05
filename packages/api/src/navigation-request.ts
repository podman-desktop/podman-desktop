/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import type { NavigationPage } from './navigation-page.js';

// Define the type mapping for parameters
export interface NavigationParameters {
  [NavigationPage.DASHBOARD]: never;
  [NavigationPage.CONTAINERS]: never;
  [NavigationPage.CONTAINER]: { id: string };
  [NavigationPage.CONTAINER_EXPORT]: { id: string };
  [NavigationPage.CONTAINER_SUMMARY]: { id: string };
  [NavigationPage.CONTAINER_LOGS]: { id: string };
  [NavigationPage.CONTAINER_TTY]: { id: string };
  [NavigationPage.CONTAINER_INSPECT]: { id: string };
  [NavigationPage.CONTAINER_TERMINAL]: { id: string };
  [NavigationPage.CONTAINER_KUBE]: { id: string };
  [NavigationPage.EXISTING_IMAGE_CREATE_CONTAINER]: never;
  [NavigationPage.DEPLOY_TO_KUBE]: { id: string; engineId: string };
  [NavigationPage.IMAGES]: never;
  [NavigationPage.IMAGE_BUILD]: { taskId: number | undefined };
  [NavigationPage.IMAGE]: { id: string; engineId: string; tag: string };
  [NavigationPage.MANIFEST]: { id: string; engineId: string; tag: string };
  [NavigationPage.ONBOARDING]: { extensionId: string };
  [NavigationPage.PODMAN_PODS]: never;
  [NavigationPage.PODMAN_POD]: { name: string; engineId: string };
  [NavigationPage.PODMAN_POD_SUMMARY]: { name: string; engineId: string };
  [NavigationPage.VOLUMES]: never;
  [NavigationPage.VOLUME]: { engineId: string; name: string };
  [NavigationPage.CONTRIBUTION]: { name: string };
  [NavigationPage.TROUBLESHOOTING]: never;
  [NavigationPage.HELP]: never;
  [NavigationPage.WEBVIEW]: { id: string };
  [NavigationPage.AUTHENTICATION]: never;
  [NavigationPage.RESOURCES]: never;
  [NavigationPage.CLI_TOOLS]: never;
  [NavigationPage.EDIT_CONTAINER_CONNECTION]: { provider: string; name: string };
  [NavigationPage.CREATE_PROVIDER_CONNECTION]: { provider: string };
  [NavigationPage.PROVIDER_TASK]: { internalId: string; taskId: number | undefined };
  [NavigationPage.EXPERIMENTAL_FEATURES]: never;
  [NavigationPage.NETWORK]: { name: string; engineId: string };
  [NavigationPage.NETWORK_CREATE]: never;
  [NavigationPage.EXTENSIONS_CATALOG]: { searchTerm?: string };
}

// the parameters property is optional when the NavigationParameters say it is
export type NavigationRequest<T extends NavigationPage> = NavigationParameters[T] extends never
  ? {
      page: T;
    }
  : {
      page: T;
      parameters: NavigationParameters[T];
    };
