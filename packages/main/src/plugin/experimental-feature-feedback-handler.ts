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
export interface ExperimentalConfiguration {
  remindAt: Timestamp;
  disabled: boolean;
}

const DAYS_TO_MS = 24 * 60 * 60 * 1_000;

@injectable()
export class ExperimentalFeatureFeedbackHandler {
  #disposables: IDisposable[] = [];
  protected experimentalFeatures: Map<string, ExperimentalConfiguration> = new Map();
  readonly #configurationRegistry: IConfigurationRegistry;
  constructor(
    @inject(ConfigurationRegistry)
    private configurationRegistry: ConfigurationRegistry,
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
    const configurationProperties = this.#configurationRegistry.getConfigurationProperties();
    for (const configurationKey in configurationProperties) {
      if (!configurationProperties[configurationKey]?.experimental?.githubDiscussionLink) {
        continue;
      }

      // Get configuration from settings.json
      const parts = configurationKey.split('.');
      const firstPart = parts[0];
      const secondPart = parts[1];
      if (!secondPart) return;

      const conf = this.#configurationRegistry.getConfiguration(firstPart).get(secondPart);
      // Configuration does not exist (feature is not enabled), or is set to false
      if (!conf) {
        if (typeof conf === 'boolean') {
          // Remove the feature if has value false using logic in save
          await this.save(configurationKey);
        }
        continue;
      }

      let optionDisabled = false;
      let optionRemindAt: Timestamp = undefined;
      if (typeof conf === 'object' && 'disabled' in conf && 'remindAt' in conf) {
        if (typeof conf.disabled === 'boolean') optionDisabled = conf.disabled;
        if (typeof conf.remindAt === 'number') optionRemindAt = conf.remindAt;
      }

      if (optionRemindAt) {
        const configuration: ExperimentalConfiguration = {
          remindAt: optionRemindAt,
          disabled: optionDisabled,
        };

        this.experimentalFeatures.set(configurationKey, configuration);
      } else {
        // when started for first time, we need to set the timetamps for each experimental feature
        this.setReminder(configurationKey);
      }
    }
    // When are all features set, show dialog
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
    this.experimentalFeatures.set(feature, { remindAt: date, disabled: conf ? conf.disabled : false });
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
      this.experimentalFeatures.set(id, { ...conf, disabled: true });
      this.save(id).catch((e: unknown) =>
        console.error(`Got error when saving timestamps for experimental features: ${e}`),
      );
    }
  }
}
