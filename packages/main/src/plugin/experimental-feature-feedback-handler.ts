/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import type { IDisposable } from '@podman-desktop/core-api';
import { IConfigurationNode, IConfigurationRegistry } from '@podman-desktop/core-api/configuration';
import { shell } from 'electron';
import { inject, injectable } from 'inversify';

import { formatName } from '/@/util.js';

import { ConfigurationRegistry } from './configuration-registry.js';
import { MessageBox } from './message-box.js';
import { Telemetry } from './telemetry/telemetry.js';

export type Timestamp = number | undefined;

/**
 * Configuration for an experimental feature
 * @property remindAt - Timestamp when the feature should be reminded again
 * @property dialogDisabled - Whether the experimental feature feedback dialog should be disabled
 * @property enabled - Whether the experimental feature is enabled
 */
export interface ExperimentalConfiguration {
  remindAt: Timestamp;
  dialogDisabled: boolean;
  enabled: boolean;
}

type RemindOption = 'Remind me tomorrow' | 'Remind me in 2 days' | `Don't show again`;
const DAYS_TO_MS = 24 * 60 * 60 * 1_000;

@injectable()
export class ExperimentalFeatureFeedbackHandler {
  #disposables: IDisposable[] = [];
  protected experimentalFeatures: Map<string, ExperimentalConfiguration> = new Map();
  readonly #configurationRegistry: IConfigurationRegistry;
  constructor(
    @inject(ConfigurationRegistry)
    private configurationRegistry: ConfigurationRegistry,
    @inject(MessageBox)
    private messageBox: MessageBox,
    @inject(Telemetry)
    private telemetry: Telemetry,
  ) {
    this.#configurationRegistry = this.configurationRegistry;
  }

  protected async save(key: string): Promise<void> {
    // If conf does not exist, the feature is not enabled
    const conf = this.experimentalFeatures.get(key);
    const parts = key.split('.');
    const firstPart = parts[0];
    const secondPart = parts[1];
    const configuration = this.#configurationRegistry.getConfiguration(firstPart);
    if (secondPart) {
      // HACK for features that are set as disabled with false (old config)
      // temporarily enable them and immediately disable, to remove them
      if (conf === undefined) {
        await configuration?.update(secondPart, {});
      }
      await configuration?.update(secondPart, conf);
    }
  }

  dispose(): void {
    this.#disposables.forEach(disposable => disposable.dispose());
    this.#disposables = [];
  }

  async init(): Promise<void> {
    const feedbackConfiguration: IConfigurationNode = {
      id: 'preferences',
      title: 'Feedback dialog',
      type: 'object',
      properties: {
        ['feedback.dialog']: {
          description: 'Show feedback dialog for experimental features',
          type: 'boolean',
          default: true,
        },
      },
    };

    this.#disposables.push(this.configurationRegistry.registerConfigurations([feedbackConfiguration]));

    const configurationProperties = this.#configurationRegistry.getConfigurationProperties();
    for (const configurationKey in configurationProperties) {
      if (!configurationProperties[configurationKey]?.experimental?.githubDiscussionLink) {
        continue;
      }

      // Get configuration from settings.json
      const parts = configurationKey.split('.');
      const firstPart = parts[0];
      const secondPart = parts[1];
      if (!secondPart) continue;

      const conf = this.#configurationRegistry.getConfiguration(firstPart).get(secondPart);
      // Configuration does not exist (feature is not enabled), or is set to false
      if (!conf) {
        if (typeof conf === 'boolean') {
          // Remove the feature if has value false using logic in save
          await this.save(configurationKey);
        }
        continue;
      }

      let optionDialogDisabled = false;
      let optionRemindAt: Timestamp = undefined;
      let optionEnabled = true;
      let needsMigration = false;

      if (typeof conf === 'object') {
        // Handle legacy 'disabled' property (renamed to 'dialogDisabled')
        if ('disabled' in conf && typeof conf.disabled === 'boolean') {
          optionDialogDisabled = conf.disabled;
          // If dialogDisabled doesn't exist, we need to migrate
          if (!('dialogDisabled' in conf)) {
            needsMigration = true;
          }
        }
        if ('dialogDisabled' in conf && typeof conf.dialogDisabled === 'boolean') {
          optionDialogDisabled = conf.dialogDisabled;
        }
        if ('enabled' in conf && typeof conf.enabled === 'boolean') {
          optionEnabled = conf.enabled;
        }
        if ('remindAt' in conf && typeof conf.remindAt === 'number') {
          optionRemindAt = conf.remindAt;
        }
      }

      // First, set the configuration with the values we read from settings.json
      const configuration: ExperimentalConfiguration = {
        remindAt: optionRemindAt,
        dialogDisabled: optionDialogDisabled,
        enabled: optionEnabled,
      };
      this.experimentalFeatures.set(configurationKey, configuration);

      // If remindAt is not set, we need to initialize it
      if (!optionRemindAt) {
        // when started for first time, we need to set the timestamps for each experimental feature
        this.setReminder(configurationKey);
      }

      // If we detected legacy 'disabled' property, migrate it to 'dialogDisabled'
      if (needsMigration) {
        this.save(configurationKey).catch((e: unknown) =>
          console.error(`Got error when migrating legacy disabled property for ${configurationKey}: ${e}`),
        );
      }
    }
    // When are all features set, show dialog
    await this.showFeedbackDialog();
  }

  /**
   * Updates timestamp for given experimental feature
   * @param feature in format feature.name
   * @param days timeout in days, undefined -> disabled, 'disabled' -> "Don't show again" was selected
   */
  protected setTimestamp(feature: string, days: Timestamp): void {
    let date: Timestamp = days;
    if (typeof days === 'number') {
      date = new Date(new Date().getTime() + days * DAYS_TO_MS).getTime();
    }
    // update configuration
    const conf = this.experimentalFeatures.get(feature);
    this.experimentalFeatures.set(feature, {
      remindAt: date,
      dialogDisabled: conf ? conf.dialogDisabled : false,
      enabled: conf ? conf.enabled : true,
    });
    this.save(feature).catch((e: unknown) =>
      console.error(`Got error when saving timestamps for experimental features: ${e}`),
    );
  }

  /**
   * Decides which value should be used for setting timestamp of given feature
   * @param configurationName in format feature.name
   */
  protected setReminder(configurationName: string): void {
    const splittedName = configurationName.split('.');
    if (splittedName.length >= 2 && splittedName[1]) {
      const configurationValue = this.#configurationRegistry.getConfiguration(splittedName[0]).get(splittedName[1]);
      if (configurationValue) this.setTimestamp(configurationName, 2);
      else this.setTimestamp(configurationName, undefined);
    }
  }

  /**
   * Disables feedback for feature by adding it to list of disabled features
   * @param id in format feature.name
   */
  protected disableFeature(id: string): void {
    const conf = this.experimentalFeatures.get(id);
    if (conf) {
      this.experimentalFeatures.set(id, { ...conf, dialogDisabled: true });
      this.save(id).catch((e: unknown) =>
        console.error(`Got error when saving timestamps for experimental features: ${e}`),
      );
    }
  }

  /**
   * Goes through each enabled experimental feature and shows dialog if current timestamp is greater than stored value
   */
  protected async showFeedbackDialog(): Promise<void> {
    const configurationProperties = this.#configurationRegistry.getConfigurationProperties();
    const feedbackEnabled = this.#configurationRegistry.getConfiguration('feedback').get<boolean>('dialog', true);
    if (!feedbackEnabled) {
      return;
    }

    // Go through all experimental features (in this point we should have all properties set)
    for (const [key, configuration] of this.experimentalFeatures) {
      const featureGitHubLink = configurationProperties[key]?.experimental?.githubDiscussionLink;
      // If the feature does not have a link or the dialog is disabled
      if (!featureGitHubLink || configuration.dialogDisabled) continue;

      // Compare timestamp of each experimental feature
      const date = new Date();
      if (configuration.remindAt && configuration.remindAt > date.getTime()) continue;
      const featureName = formatName(key);

      let footerMarkdownDescription: string = `:button[fa-thumbs-up]{command=openExternal args='["${featureGitHubLink}"]'} :button[fa-thumbs-down]{command=openExternal args='["${featureGitHubLink}"]'}`;

      const image = configurationProperties[key]?.experimental?.image;
      if (image) {
        footerMarkdownDescription = `:image[${featureName}]{src="${configurationProperties[key]?.experimental?.image}" title="${featureName}"}`;
      }
      const options: RemindOption[] = ['Remind me tomorrow', 'Remind me in 2 days', `Don't show again`];

      this.messageBox
        .showMessageBox({
          title: `Share Your Feedback`,
          message: `We are testing something new!\n\nHow's your experience so far with [${featureName}](${featureGitHubLink})? Let us know on GitHub!`,
          type: `info`,
          buttons: [
            {
              heading: 'Remind me later',
              buttons: options,
              type: 'dropdownButton',
            },
            {
              label: 'Share Feedback on GitHub',
              icon: 'fas fa-arrow-up-right-from-square',
              type: 'iconButton',
            },
          ],
          defaultId: 1,
          footerMarkdownDescription: footerMarkdownDescription,
        })
        .then(async response => {
          if (response) {
            const telemetryOptions = { option: 'Share Feedback on GitHub' };
            // Share Feedback on GitHub was selected
            if (response.response === 1) {
              await shell.openExternal(featureGitHubLink);
              this.setTimestamp(key, undefined);
            }
            // Option from Dropdown was selected
            else if (response.response === 0 && typeof response.dropdownIndex === 'number') {
              telemetryOptions.option = options[response.dropdownIndex] ?? 'Unknown option';
              switch (options[response.dropdownIndex]) {
                case 'Remind me tomorrow':
                  this.setTimestamp(key, 1);
                  break;
                case 'Remind me in 2 days':
                  this.setTimestamp(key, 2);
                  break;
                case `Don't show again`:
                default:
                  this.disableFeature(key);
              }
            }
            this.telemetry.track('experimentalFeatureFeedback', telemetryOptions);
          }
        })
        .catch(console.error);
    }
  }
}
