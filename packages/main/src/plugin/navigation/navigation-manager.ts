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

import type { ProviderContainerConnection } from '@podman-desktop/api';
import { inject, injectable } from 'inversify';

import { ApiSenderType } from '/@/plugin/api.js';
import { CommandRegistry } from '/@/plugin/command-registry.js';
import { ContainerProviderRegistry } from '/@/plugin/container-registry.js';
import { ContributionManager } from '/@/plugin/contribution-manager.js';
import { OnboardingRegistry } from '/@/plugin/onboarding-registry.js';
import { NavigationPage } from '/@api/navigation-page.js';
import type { NavigationRequest } from '/@api/navigation-request.js';

import { ProviderRegistry } from '../provider-registry.js';
import { Disposable } from '../types/disposable.js';
import { WebviewRegistry } from '../webview/webview-registry.js';

export interface NavigationRoute {
  routeId: string;
  commandId: string;
}

@injectable()
export class NavigationManager {
  #registry: Map<string, NavigationRoute>;

  constructor(
    @inject(ApiSenderType)
    private apiSender: ApiSenderType,
    @inject(ContainerProviderRegistry)
    private containerRegistry: ContainerProviderRegistry,
    @inject(ContributionManager)
    private contributionManager: ContributionManager,
    @inject(ProviderRegistry)
    private providerRegistry: ProviderRegistry,
    @inject(WebviewRegistry)
    private webviewRegistry: WebviewRegistry,
    @inject(CommandRegistry)
    private commandRegistry: CommandRegistry,
    @inject(OnboardingRegistry)
    private onboardingRegistry: OnboardingRegistry,
  ) {
    this.#registry = new Map();
  }

  navigateTo<T extends NavigationPage>(navigateRequest: NavigationRequest<T>): void {
    this.apiSender.send('navigate', navigateRequest);
  }

  registerRoute(route: NavigationRoute): Disposable {
    if (this.hasRoute(route.routeId)) {
      throw new Error(`routeId ${route.routeId} is already registered.`);
    }
    this.#registry.set(route.routeId, route);

    return Disposable.create(() => {
      this.#registry.delete(route.routeId);
    });
  }

  hasRoute(routeId: string): boolean {
    return this.#registry.has(routeId);
  }

  async navigateToRoute(routeId: string, ...args: unknown[]): Promise<void> {
    const route = this.#registry.get(routeId);
    if (!route) {
      throw new Error(`navigation route ${routeId} does not exists.`);
    }

    if (!this.commandRegistry.hasCommand(route.commandId)) {
      throw new Error(`navigation route ${routeId} registered an unknown command: ${route.commandId}`);
    }

    return this.commandRegistry.executeCommand(route.commandId, ...args);
  }

  async navigateToProviderTask(internalProviderId: string, taskId?: number): Promise<void> {
    this.navigateTo({
      page: NavigationPage.PROVIDER_TASK,
      parameters: {
        internalId: internalProviderId,
        taskId: taskId,
      },
    });
  }

  async navigateToCliTools(): Promise<void> {
    this.navigateTo({
      page: NavigationPage.CLI_TOOLS,
    });
  }

  async navigateToHelp(): Promise<void> {
    this.navigateTo({
      page: NavigationPage.HELP,
    });
  }

  async navigateToTroubleshooting(): Promise<void> {
    this.navigateTo({
      page: NavigationPage.TROUBLESHOOTING,
    });
  }

  async navigateToDashboard(): Promise<void> {
    this.navigateTo({
      page: NavigationPage.DASHBOARD,
    });
  }

  async navigateToContainers(): Promise<void> {
    this.navigateTo({
      page: NavigationPage.CONTAINERS,
    });
  }

  private async assertContainerExist(id: string): Promise<void> {
    if (!(await this.containerRegistry.containerExist(id))) throw new Error(`Container with id ${id} cannot be found.`);
  }

  private assertOnboardingExist(extensionId: string): void {
    if (!this.onboardingRegistry.getOnboarding(extensionId)) {
      throw new Error(`Onboarding with extension id ${extensionId} cannot be found.`);
    }
  }

  async navigateToContainerLogs(id: string): Promise<void> {
    await this.assertContainerExist(id);

    this.navigateTo({
      page: NavigationPage.CONTAINER_LOGS,
      parameters: {
        id: id,
      },
    });
  }

  async navigateToContainerInspect(id: string): Promise<void> {
    await this.assertContainerExist(id);

    this.navigateTo({
      page: NavigationPage.CONTAINER_INSPECT,
      parameters: {
        id: id,
      },
    });
  }

  async navigateToContainerTerminal(id: string): Promise<void> {
    await this.assertContainerExist(id);

    this.navigateTo({
      page: NavigationPage.CONTAINER_TERMINAL,
      parameters: {
        id: id,
      },
    });
  }

  async navigateToContainer(id: string): Promise<void> {
    await this.assertContainerExist(id);

    this.navigateTo({
      page: NavigationPage.CONTAINER,
      parameters: {
        id: id,
      },
    });
  }

  async assertImageExist(id: string, engineId: string, tag: string): Promise<void> {
    if (!(await this.containerRegistry.imageExist(id, engineId, tag)))
      throw new Error(`Image with id ${id}, engine id ${engineId} and tag ${tag} cannot be found.`);
  }

  async navigateToImages(): Promise<void> {
    this.navigateTo({
      page: NavigationPage.IMAGES,
    });
  }

  async navigateToImageBuild(taskId?: number): Promise<void> {
    this.navigateTo({
      page: NavigationPage.IMAGE_BUILD,
      parameters: {
        taskId,
      },
    });
  }

  async navigateToImage(id: string, engineId: string, tag: string): Promise<void> {
    await this.assertImageExist(id, engineId, tag);

    this.navigateTo({
      page: NavigationPage.IMAGE,
      parameters: {
        id: id,
        engineId: engineId,
        tag: tag,
      },
    });
  }

  async assertVolumeExist(id: string, engineId: string): Promise<void> {
    if (!(await this.containerRegistry.volumeExist(id, engineId)))
      throw new Error(`Volume with id ${id} and engine id ${engineId} cannot be found.`);
  }

  async navigateToVolumes(): Promise<void> {
    this.navigateTo({
      page: NavigationPage.VOLUMES,
    });
  }

  async navigateToVolume(name: string, engineId: string): Promise<void> {
    await this.assertVolumeExist(name, engineId);
    this.navigateTo({
      page: NavigationPage.VOLUME,
      parameters: {
        name: name,
      },
    });
  }

  async assertPodExist(kind: string, name: string, engineId: string): Promise<void> {
    if (!(await this.containerRegistry.podExist(kind, name, engineId)))
      throw new Error(`Pod with kind ${kind}, name ${name} and engine id ${engineId} cannot be found.`);
  }

  async navigateToPods(): Promise<void> {
    this.navigateTo({
      page: NavigationPage.PODMAN_PODS,
    });
  }

  async navigateToPod(kind: string, name: string, engineId: string): Promise<void> {
    await this.assertPodExist(kind, name, engineId);

    this.navigateTo({
      page: NavigationPage.PODMAN_POD,
      parameters: {
        name: name,
        engineId: engineId,
      },
    });
  }

  protected assertContributionExist(name: string): void {
    const contribs = this.contributionManager.listContributions();
    if (contribs.find(contrib => contrib.name === name) === undefined) {
      throw new Error(`Contribution with name ${name} cannot be found.`);
    }
  }

  async navigateToContribution(name: string): Promise<void> {
    this.assertContributionExist(name);

    this.navigateTo({
      page: NavigationPage.CONTRIBUTION,
      parameters: {
        name: name,
      },
    });
  }

  protected assertWebviewExist(webviewId: string): void {
    const webviews = this.webviewRegistry.listWebviews();
    if (webviews.find(webview => webview.id === webviewId) === undefined) {
      throw new Error(`Webview with id ${webviewId} cannot be found.`);
    }
  }

  async navigateToWebview(webviewId: string): Promise<void> {
    this.assertWebviewExist(webviewId);

    this.navigateTo({
      page: NavigationPage.WEBVIEW,
      parameters: {
        id: webviewId,
      },
    });
  }

  async navigateToAuthentication(): Promise<void> {
    this.navigateTo({
      page: NavigationPage.AUTHENTICATION,
    });
  }

  async navigateToResources(): Promise<void> {
    this.navigateTo({
      page: NavigationPage.RESOURCES,
    });
  }

  async navigateToEditProviderContainerConnection(connection: ProviderContainerConnection): Promise<void> {
    const internalId = this.providerRegistry.getMatchingProviderInternalId(connection.providerId);
    this.navigateTo({
      page: NavigationPage.EDIT_CONTAINER_CONNECTION,
      parameters: {
        provider: internalId,
        name: Buffer.from(connection.connection.name).toString('base64'),
      },
    });
  }

  async navigateToOnboarding(extensionId: string): Promise<void> {
    this.assertOnboardingExist(extensionId);

    this.navigateTo({
      page: NavigationPage.ONBOARDING,
      parameters: {
        extensionId: extensionId,
      },
    });
  }
}
