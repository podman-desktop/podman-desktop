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

import * as extensionApi from '@podman-desktop/api';

import { getSocketCompatibility } from '/@/compatibility-mode/compatibility-mode';

import { isDisguisedPodman } from './warnings';

export class ExtensionNotifications {
  constructor(private readonly telemetryLogger: extensionApi.TelemetryLogger) {}
  // Configuration buttons
  private static readonly configurationCompatibilityModeMacSetupNotificationDoNotShow =
    'setting.doNotShowMacHelperNotification';

  private _shouldNotifySetup = true;

  public get shouldNotifySetup(): boolean {
    return this._shouldNotifySetup;
  }

  public set shouldNotifySetup(shouldNotifySetup: boolean) {
    this._shouldNotifySetup = shouldNotifySetup;
  }

  private _notificationDisposable?: extensionApi.Disposable;

  private _disguisedPodmanNotificationDisposable?: extensionApi.Disposable;

  public get disguisedPodmanNotificationDisposable(): extensionApi.Disposable | undefined {
    return this._disguisedPodmanNotificationDisposable;
  }

  private _doNotShowMacHelperSetup = false;

  public get doNotShowMacHelperSetup(): boolean {
    return this._doNotShowMacHelperSetup;
  }

  public set doNotShowMacHelperSetup(doNotShowMacHelperSetup: boolean) {
    this._doNotShowMacHelperSetup = doNotShowMacHelperSetup;
  }

  private _podmanMacHelperNotificationDisposable?: extensionApi.Disposable;
  public get podmanMacHelperNotificationDisposable(): extensionApi.Disposable | undefined {
    return this._podmanMacHelperNotificationDisposable;
  }

  // Shortform for getting the do not show ever again setting for the podman-mac-helper notification
  private getDoNotShowMacHelperSetting(): boolean {
    return (
      extensionApi.configuration
        .getConfiguration('podman')
        .get<boolean>(ExtensionNotifications.configurationCompatibilityModeMacSetupNotificationDoNotShow) ?? false
    );
  }

  public setupNotificationMacPodman(): extensionApi.Disposable {
    // Get if we should never show the podman-mac-helper notification ever again
    this.doNotShowMacHelperSetup = this.getDoNotShowMacHelperSetting();

    return extensionApi.commands.registerCommand('podman.doNotShowMacHelperNotification', async () => {
      // Set the configuration setting to true, so on reload of Podman Desktop it
      // is consistent / will not show the notification again
      await extensionApi.configuration
        .getConfiguration('podman')
        .update(ExtensionNotifications.configurationCompatibilityModeMacSetupNotificationDoNotShow, true);

      //  Set the global variable to true
      this.doNotShowMacHelperSetup = true;

      // Dismiss the notification
      this.podmanMacHelperNotificationDisposable?.dispose();
    });
  }

  // to avoid having multiple notification of the same nature in the notifications list
  // we first dispose the old one and then push the same again
  public notifySetupPodman(): void {
    if (this.shouldNotifySetup) {
      // Alert for setting up
      this._notificationDisposable ??= extensionApi.window.showNotification({
        title: 'Podman needs to be set up',
        body: 'The Podman extension is installed, yet requires configuration. Some features might not function optimally.',
        type: 'info',
        markdownActions: ':button[Set up]{href=/preferences/onboarding/podman-desktop.podman title="Set up Podman"}',
        highlight: true,
        silent: true,
      });
      this.shouldNotifySetup = false;
    }
  }

  private notifyDisguisedPodmanSocket(): void {
    // Notification for if Docker Desktop has overriden the socket other tools are using it.
    this._disguisedPodmanNotificationDisposable ??= extensionApi.window.showNotification({
      title: 'Docker socket is not disguised correctly',
      body: 'The Docker socket (/var/run/docker.sock) is not being properly disguised by Podman. This could potentially cause docker-compatible tools to fail. Please disable any conflicting tools and re-enable Docker Compatibility.',
      markdownActions:
        ':button[Docker compatibility settings]{href=/preferences/docker-compatibility title="Docker Compatibility settings"}',
      type: 'error',
      highlight: true,
      silent: true,
    });
  }

  // Check that the socket is indeed a disguised podman socket, if it is NOT, we should
  // alert the user that compatibility was not ran.
  private async checkAndNotifyDisguisedPodman(): Promise<void> {
    const socketCompatibilityMode = getSocketCompatibility();

    // Immediate return as we should not be checking if compatibility mode wasn't "enabled" (press Enable button).
    if (!socketCompatibilityMode.isEnabled()) {
      return;
    }

    let isDisguisedPodmanSocket: boolean;
    try {
      isDisguisedPodmanSocket = await isDisguisedPodman();
    } catch (error: unknown) {
      this.telemetryLogger.logError('checkIfSocketDisguisedFailed', { error });
      console.debug('Error while check if the socket is disguised', error);
      return;
    }

    // If the socket is not disguised, we should alert the user that compatibility was not ran.
    if (!isDisguisedPodmanSocket) {
      this.notifyDisguisedPodmanSocket();
    } else {
      // If it's already disguised, dispose of the notification.
      this.disguisedPodmanNotificationDisposable?.dispose();
    }
  }

  // Show the banner for running podman-mac-helper
  private notifySetupPodmanMacHelper(): void {
    this.podmanMacHelperNotificationDisposable?.dispose();

    // Alert for running podman-mac-helper
    // Add notification that podman-mac-helper needs setting up
    this._podmanMacHelperNotificationDisposable = extensionApi.window.showNotification({
      title: 'Podman Mac Helper needs to be set up',
      body: 'The Podman Mac Helper is not set up, some features might not function optimally.',
      type: 'info',
      // Execute the "Docker Compatibility" command when the button is clicked
      markdownActions:
        ':button[Enable]{command=podman.socketCompatibilityMode} &nbsp; :button[Do not show again]{command=podman.doNotShowMacHelperNotification}',
      highlight: true,
      silent: true,
    });
  }

  private async checkAndNotifySetupPodmanMacHelper(): Promise<void> {
    // Exit immediately if doNotShowMacHelperSetup is true
    if (this.doNotShowMacHelperSetup) {
      return;
    }

    // We do one last check to see if the socket is truly disguised or not by checking isEnabled for socketCompatibilityMode
    const socketCompatibilityMode = getSocketCompatibility();

    // Check to see if we actually have a disguised podman socket, if it's false, we should notify.
    let isDisguisedPodmanSocket: boolean;
    try {
      isDisguisedPodmanSocket = await isDisguisedPodman();
    } catch (error: unknown) {
      this.telemetryLogger.logError('checkIfSocketDisguisedFailed', { error });
      console.debug('Error while check if the socket is disguised', error);
      return;
    }

    // Notify if we need to run podman-mac-helper only if isDisguisedPodmanSocket is set to false
    // and we are on macOS, as the helper is only required for macOS.
    // We also only notify if the actual notification is undefined (already disposed / not exists)
    if (!isDisguisedPodmanSocket && !socketCompatibilityMode.isEnabled()) {
      this.notifySetupPodmanMacHelper();
    } else {
      // If it's already enabled, just dispose the notification
      this.podmanMacHelperNotificationDisposable?.dispose();
    }
  }

  public async checkMacSocket(): Promise<void> {
    // This check specifically applies to macOS environments.
    if (extensionApi.env.isMac) {
      // On macOS, verify if the Podman socket requires the podman-mac-helper.
      // This notification should ideally occur only once upon initial extension activation
      // to prevent repetitive user prompts.
      await this.checkAndNotifySetupPodmanMacHelper();

      // Additionally, verify if the Podman socket is a "disguised" Podman socket
      // (e.g., a Docker-compatible socket provided by Podman) and notify the user
      // if any specific setup or awareness is required.
      await this.checkAndNotifyDisguisedPodman();
    }
  }

  public notifySetupPodmanNotLinux(): void {
    // Only show the notification on macOS and Windows
    // as Podman is already installed on Linux and machine is OPTIONAL.
    if (!extensionApi.env.isLinux) {
      // push setup notification
      this.notifySetupPodman();
    }
  }

  public disposeNotification(): void {
    // notification is no more required
    this._notificationDisposable?.dispose();
    this.shouldNotifySetup = true;
  }
}
