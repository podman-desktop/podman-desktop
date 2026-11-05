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

import type { ContributionInfo, WebviewInfo } from '@desktop-framework/api';
import { AppearanceSettings } from '@desktop-framework/api/appearance';
import type { IpcMainEvent, IpcMainInvokeEvent, WebContents } from 'electron';

type IpcEvent = IpcMainEvent | IpcMainInvokeEvent;

const DOCKER_CHANNELS = new Set([
  'container-provider-registry:listImages',
  'container-provider-registry:listSimpleContainers',
  'shell:openExternal',
]);

const WEBVIEW_CHANNELS = new Set([
  'configuration-registry:getConfigurationValue',
  'colorRegistry:listColors',
  'colorRegistry:getThemeInfo',
  'webviewRegistry:listWebviews',
  'webviewRegistry:post-message',
  'webviewRegistry:update-state',
]);

function pageUrl(url: string): string {
  const parsed = new URL(url);
  parsed.search = '';
  parsed.hash = '';
  return parsed.href;
}

export class IpcSenderValidator {
  private mainWindow: { contents: WebContents; url: string } | undefined;
  private getContributions: () => ContributionInfo[] = () => [];
  private getWebviews: () => { views: WebviewInfo[]; port: number } = () => ({ views: [], port: 0 });
  private readonly guestPages = new WeakMap<WebContents, string>();

  registerMainWindow(contents: WebContents, url: string): void {
    this.mainWindow = { contents, url: pageUrl(url) };
  }

  registerContributions(getContributions: () => ContributionInfo[]): void {
    this.getContributions = getContributions;
  }

  registerWebviews(getWebviews: () => { views: WebviewInfo[]; port: number }): void {
    this.getWebviews = getWebviews;
  }

  private assertMainFrame(event: IpcEvent): void {
    if (event.sender.isDestroyed() || !event.senderFrame || event.senderFrame !== event.sender.mainFrame) {
      throw new Error('IPC is only allowed from a live main frame');
    }
  }

  private isMainSender(event: IpcEvent): boolean {
    return (
      !!this.mainWindow &&
      !this.mainWindow.contents.isDestroyed() &&
      event.sender === this.mainWindow.contents &&
      !!event.senderFrame &&
      pageUrl(event.senderFrame.url) === this.mainWindow.url
    );
  }

  assertMainSender(event: IpcEvent): void {
    this.assertMainFrame(event);
    if (!this.isMainSender(event)) {
      throw new Error('IPC sender is not the main application renderer');
    }
  }

  private assertGuestSender(event: IpcEvent): URL {
    this.assertMainFrame(event);
    if (
      !this.mainWindow ||
      this.mainWindow.contents.isDestroyed() ||
      event.sender.getType() !== 'webview' ||
      event.sender.hostWebContents !== this.mainWindow.contents ||
      pageUrl(this.mainWindow.contents.mainFrame.url) !== this.mainWindow.url
    ) {
      throw new Error('IPC sender is not an application extension webview');
    }
    const url = new URL(event.sender.mainFrame.url);
    url.hash = '';
    const registeredPage = this.guestPages.get(event.sender);
    if (registeredPage !== undefined && registeredPage !== url.href) {
      throw new Error('IPC extension webview has navigated away from its registered page');
    }
    return url;
  }

  assertDockerSender(event: IpcEvent, contributionId?: string): ContributionInfo {
    const url = this.assertGuestSender(event);
    const extensionId = url.searchParams.get('extensionName');
    const contribution = this.getContributions().find(
      item => item.extensionId === extensionId && pageUrl(item.uiUri) === pageUrl(url.href),
    );
    if (!contribution || (contributionId !== undefined && contributionId !== contribution.extensionId)) {
      throw new Error('IPC sender does not own the Docker extension contribution');
    }
    this.guestPages.set(event.sender, url.href);
    return contribution;
  }

  assertSharedSender(event: IpcEvent, channel: string, args: unknown[]): void {
    this.assertMainFrame(event);
    if (this.isMainSender(event)) {
      return;
    }
    if (DOCKER_CHANNELS.has(channel)) {
      this.assertDockerSender(event);
      return;
    }
    if (WEBVIEW_CHANNELS.has(channel)) {
      const url = this.assertGuestSender(event);
      const { views, port } = this.getWebviews();
      const view = views.find(
        item =>
          item.id === url.searchParams.get('webviewId') &&
          pageUrl(url.href) === `http://${item.uuid}.webview.localhost:${port}/`,
      );
      if (!view) {
        throw new Error('IPC sender is not a registered extension webview');
      }
      this.guestPages.set(event.sender, url.href);
      if (
        (channel === 'configuration-registry:getConfigurationValue' &&
          (args[0] !== `${AppearanceSettings.SectionName}.${AppearanceSettings.Appearance}` ||
            args[1] !== undefined)) ||
        ((channel === 'webviewRegistry:post-message' || channel === 'webviewRegistry:update-state') &&
          args[0] !== view.id)
      ) {
        throw new Error('IPC request is outside the extension webview scope');
      }
      return;
    }
    throw new Error(`IPC channel '${channel}' is restricted to the main application renderer`);
  }
}

export const ipcSenderValidator = new IpcSenderValidator();
