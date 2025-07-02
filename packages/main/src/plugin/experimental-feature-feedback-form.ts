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

import type containerDesktopAPI from '@podman-desktop/api';
import { shell } from 'electron';

import type { IDisposable } from '/@api/disposable.js';

import type { ConfigurationRegistry } from './configuration-registry.js';
import type { MessageBox } from './message-box.js';

// Pseudo infinity number for "don't show again" option
// Aprox Wednesday, June 6, 2255
const MAX_NUMBER: number = Number.MAX_SAFE_INTEGER;

export type Timestamp = number | undefined | null;

type RemindOption = 'Remind me tomorrow' | 'Remind me in 2 days' | `Don't show again`;

export class ExperimentalFeatureFeedbackForm {
  #disposables: IDisposable[] = [];
  #configuration: containerDesktopAPI.Configuration | undefined;
  #timestamps: Map<string, Timestamp> = new Map();
  #experimentalFeatures: Set<string> = new Set([]);
  readonly #configurationRegistry: ConfigurationRegistry;
  constructor(
    private configurationRegistry: ConfigurationRegistry,
    private messageBox: MessageBox,
  ) {
    this.#configurationRegistry = this.configurationRegistry;
  }

  protected async save(): Promise<void> {
    if (!this.#configuration) throw new Error('missing configuration object: cannot save');

    await this.#configuration.update('timestamp', Object.fromEntries(this.#timestamps));
  }

  dispose(): void {
    this.#disposables.forEach(disposable => disposable.dispose());
    this.#disposables = [];
  }

  async init(): Promise<void> {
    const configurationProperties = this.#configurationRegistry.getConfigurationProperties();
    for (const configurationKey in configurationProperties) {
      if (configurationProperties[configurationKey]?.experimental?.githubDiscussionLink)
        this.#experimentalFeatures.add(configurationKey);
    }

    this.#disposables.push(
      this.#configurationRegistry.registerConfigurations([
        {
          id: 'features',
          title: 'Experimental Features',
          type: 'object',
          scope: 'DEFAULT',
          properties: {
            ['timestamp']: {
              description: 'Notification fimestamp for each experimental feature',
              type: 'object',
              hidden: true,
            },
          },
        },
      ]),
      this.#configurationRegistry.onDidChangeConfiguration(event => {
        // If configuration changed and if is experimenal feature
        if (this.#experimentalFeatures.has(event.key) && typeof event.value === 'boolean') {
          // If value === true the feature is now enabled we want to schedule notification in 2 days
          // If value === false, the feature is disabled and we want to disable notification
          this.setTimestamp(event.key, event.value ? 2 : undefined);
        }
      }),
    );

    // Get configuration from settings.json
    this.#configuration = this.#configurationRegistry.getConfiguration('features');
    const options = this.#configuration.get('timestamp');

    if (options) {
      this.#timestamps = new Map<string, Timestamp>(Object.entries(options).map(([k, v]) => [k as string, v!]));
      await this.showFeedbackDialog();
    } else {
      // when started for first time, we need to set the timetamps for each experimental feature
      this.#experimentalFeatures.forEach(feature => {
        this.setReminder(feature);
      });
    }
  }

  // TODO set to days
  /**
   * Updates timestamp for given experimental feature
   * @param feature in format feature.name
   * @param days timeout in days
   */
  protected setTimestamp(feature: string, days: number | undefined): void {
    let date: undefined | number = undefined;
    if (days) {
      date = new Date(new Date().getTime() + days * 60 * 1000).getTime();
    }
    // update configuration
    this.#timestamps.set(feature, date);
    this.save().catch(console.error);
  }

  /**
   * Decides which value should be used for setting timestamp of given feature
   * @param configurationName in format feature.name
   */
  protected setReminder(configurationName: string): void {
    const splittedName = configurationName.split('.');
    if (splittedName.length >= 2 && splittedName[1]) {
      const configurationValue = this.#configurationRegistry
        .getConfiguration(splittedName[0])
        .get<boolean>(splittedName[1]);
      if (configurationValue) this.setTimestamp(configurationName, 2);
      else this.setTimestamp(configurationName, undefined);
    }
  }

  /**
   * Formats id to better readable one
   * @param id in format feature.name
   * @returns nicely formated name e.g. feature Name
   */
  protected formatName(id: string): string {
    return id
      .split('.')
      .map(part => part.replace(/([a-z])([A-Z])/g, '$1 $2'))
      .join(' ');
  }

  /**
   * Getter method for timestamps
   * @returns timestamps
   */
  protected getTimestampsMap(): Map<string, Timestamp> {
    return this.#timestamps;
  }

  /**
   * Goes through each enabled experimenatl feature and shows dialog if current timestamp is greater than stored value
   */
  protected async showFeedbackDialog(): Promise<void> {
    const configurationProperties = this.#configurationRegistry.getConfigurationProperties();
    this.#timestamps.forEach((timestamp: Timestamp, key: string) => {
      const featureGitHubLink = configurationProperties[key]?.experimental?.githubDiscussionLink;
      if (!featureGitHubLink || !timestamp) return;

      // Compare timestamp of each experimental feature
      const date = new Date();
      if (timestamp > date.getTime()) return;
      const featureName = this.formatName(key);
      const footerMarkdownDescription: string = `:button[fa-thumbs-up]{command=openExternal args='["${featureGitHubLink}"]'} :button[fa-thumbs-down]{command=openExternal args='["${featureGitHubLink}"]'}`;
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
            },
            {
              label: 'Share Feedback on GitHub',
              icon: 'fas fa-arrow-up-right-from-square',
            },
          ],
          defaultId: 1,
          footerMarkdownDescription: footerMarkdownDescription,
        })
        .then(response => {
          // Share Feedback on GitHub was selected
          if (response.response === 1) {
            shell
              .openExternal(featureGitHubLink)
              .then(() => {})
              .catch(console.error);
            this.setTimestamp(key, undefined);
          }
          // Option from Dropdown was selected
          else if (response.response === 0 && typeof response.dropdownIndex === 'number') {
            let remindInDays;
            switch (options[response.dropdownIndex]) {
              case 'Remind me tomorrow':
                remindInDays = 1;
                break;
              case 'Remind me in 2 days':
                remindInDays = 2;
                break;
              case `Don't show again`:
              default:
                remindInDays = MAX_NUMBER;
            }
            this.setTimestamp(key, remindInDays);
          }
        })
        .catch(console.error);
    });
  }
}
