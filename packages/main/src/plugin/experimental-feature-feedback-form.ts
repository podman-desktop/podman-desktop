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

import { inject, injectable } from 'inversify';

import { IConfigurationRegistry } from '/@api/configuration/models.js';
import type { IDisposable } from '/@api/disposable.js';

import { ConfigurationRegistry } from './configuration-registry.js';

export type Timestamp = number | undefined;

const DAYS_TO_MS = 24 * 60 * 60 * 1_000;

@injectable()
export class ExperimentalFeatureFeedbackForm {
  #disposables: IDisposable[] = [];
  protected timestamps: Map<string, Timestamp> = new Map();
  protected disabled: string[] = [];
  protected experimentalFeatures: Set<string> = new Set([]);
  readonly #configurationRegistry: IConfigurationRegistry;
  constructor(
    @inject(ConfigurationRegistry)
    private configurationRegistry: ConfigurationRegistry,
  ) {
    this.#configurationRegistry = this.configurationRegistry;
  }

  protected async save(key: string): Promise<void> {
    // If timestamp does not exist, the feature is not enabled
    const timestamp: Timestamp = this.timestamps.get(key);
    let disabled: boolean | undefined = this.disabled.includes(key);
    if (!timestamp) {
      // Timestamp does not exist we need to set disabled manually, otherwise we would end up with:
      // feature {
      //  "disabled" : false
      // }
      disabled = undefined;
    }
    const conf =
      disabled || timestamp
        ? {
            remindAt: timestamp,
            disabled: disabled,
          }
        : undefined;

    const parts = key.split('.');
    const firstPart = parts[0];
    const secondPart = parts[1];
    if (secondPart) {
      const configuration = this.#configurationRegistry.getConfiguration(firstPart);
      await configuration?.update(secondPart, conf);
    }
  }

  dispose(): void {
    this.#disposables.forEach(disposable => disposable.dispose());
    this.#disposables = [];
  }

  async init(): Promise<void> {
    const configurationProperties = this.#configurationRegistry.getConfigurationProperties();
    for (const configurationKey in configurationProperties) {
      if (configurationProperties[configurationKey]?.experimental?.githubDiscussionLink)
        this.experimentalFeatures.add(configurationKey);
    }

    for (const feat of this.experimentalFeatures.values()) {
      // Get configuration from settings.json
      const parts = feat.split('.');
      const firstPart = parts[0];
      const secondPart = parts[1];
      if (!secondPart) return;

      const conf = this.#configurationRegistry.getConfiguration(firstPart).get(secondPart);
      // Set to undefined if is the feature disabled
      let optionDisabled = undefined;
      let optionRemindAt: Timestamp = undefined;
      if (conf && typeof conf === 'object' && 'disabled' in conf && 'remindAt' in conf) {
        optionDisabled = conf.disabled;
        if (typeof conf.remindAt === 'number') optionRemindAt = conf.remindAt;
      }

      if (optionDisabled && !this.disabled.includes(feat)) {
        this.disabled.push(feat);
      } else if (!optionDisabled) {
        const index = this.disabled.indexOf(feat, 0);
        if (index > -1) {
          this.disabled.splice(index, 1);
        }
      }

      if (optionRemindAt) {
        this.timestamps.set(feat, optionRemindAt);
        // TODO: Show Feedback
        // We want to show only one dialog at a time to avoid overwhelming the user.
        // This ensures that the user can focus on providing feedback for one feature
        // before being prompted about another. If additional dialogs are needed,
        // they will be shown in subsequent application sessions.
        return;
      } else {
        // when started for first time, we need to set the timetamps for each experimental feature
        this.setReminder(feat);
      }
    }
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
    this.timestamps.set(feature, date);
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
   * Replaces dots by spaces and adds uppercase on each sequence
   * @param id in format feature.name
   * @returns nicely formatted name e.g. feature Name
   */
  protected formatName(id: string): string {
    return id
      .split('.')
      .map(part => part.replace(/([a-z])([A-Z])/g, '$1 $2'))
      .join(' ');
  }

  /**
   * Disables feedback for feature by adding it to list of disabled features
   * @param id in format feature.name
   */
  protected disableFeature(id: string): void {
    if (!this.disabled.includes(id)) {
      this.disabled.push(id);
      this.save(id).catch((e: unknown) =>
        console.error(`Got error when saving timestamps for experimental features: ${e}`),
      );
    }
  }
}
