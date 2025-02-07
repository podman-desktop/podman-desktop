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

import type { ApiSenderType } from '/@/plugin/api.js';
import type { CommandRegistry } from '/@/plugin/command-registry.js';
import type { ConfigurationRegistry } from '/@/plugin/configuration-registry.js';
import type { ProviderRegistry } from '/@/plugin/provider-registry.js';
import type { StatusBarRegistry } from '/@/plugin/statusbar/statusbar-registry.js';
import type { IDisposable } from '/@/plugin/types/disposable.js';
import { Disposable } from '/@/plugin/types/disposable.js';
import { STATUS_BAR_PIN_CONSTANTS } from '/@api/status-bar/pin-constants.js';
import type { PinOption } from '/@api/status-bar/pin-option.js';

export const STATUSBAR_PIN_ID = 'pin';

export class PinRegistry implements IDisposable {
  #disposables: IDisposable[] = [];
  #pinned: Set<string> = new Set(['podman']);
  #configuration: containerDesktopAPI.Configuration | undefined;

  constructor(
    private statusBarRegistry: StatusBarRegistry,
    private commandRegistry: CommandRegistry,
    private apiSender: ApiSenderType,
    private configurationRegistry: ConfigurationRegistry,
    private providers: ProviderRegistry,
  ) {}

  dispose(): void {
    this.#disposables.forEach(disposable => disposable.dispose());
    this.#disposables = [];
    this.#pinned.clear();
  }

  private notify(): void {
    this.apiSender.send(STATUS_BAR_PIN_CONSTANTS.PIN_OPTIONS_UPDATE, this.getOptions());
  }

  public pin(optionId: string): void {
    this.#pinned.add(optionId);
    this.notify();
    // save async
    this.save().catch(console.error);
  }

  public unpin(optionId: string): void {
    this.#pinned.delete(optionId);
    this.notify();
    // save async
    this.save().catch(console.error);
  }

  public getOptions(): Array<PinOption> {
    return this.providers.getProviderInfos().map(provider => ({
      value: provider.id,
      label: provider.name,
      pinned: this.#pinned.has(provider.id),
    }));
  }

  private async save(): Promise<void> {
    if (!this.#configuration) throw new Error('missing configuration object: cannot save');

    await this.#configuration.update(
      STATUS_BAR_PIN_CONSTANTS.PINNED_CONFIGURATION_PROPERTY,
      Array.from(this.#pinned.values()),
    );
  }

  init(): void {
    // register pin entry
    this.statusBarRegistry.setEntry(
      STATUSBAR_PIN_ID,
      true,
      Number.MAX_VALUE,
      undefined,
      'Pin',
      'fa fa-thumbtack',
      true,
      STATUS_BAR_PIN_CONSTANTS.TOGGLE_MENU_COMMAND,
    );
    this.#disposables.push(
      Disposable.create(() => {
        this.statusBarRegistry.removeEntry(STATUSBAR_PIN_ID);
      }),
    );

    // register toggle menu command
    this.#disposables.push(
      this.commandRegistry.registerCommand(STATUS_BAR_PIN_CONSTANTS.TOGGLE_MENU_COMMAND, () => {
        this.apiSender.send(STATUS_BAR_PIN_CONSTANTS.TOGGLE_MENU);
      }),
    );

    // register configuration for persistence
    this.#disposables.push(
      this.configurationRegistry.registerConfigurations([
        {
          id: STATUS_BAR_PIN_CONSTANTS.STATUS_BAR_CONFIGURATION,
          title: 'Status Bar Pin',
          type: 'object',
          properties: {
            [STATUS_BAR_PIN_CONSTANTS.PINNED_CONFIGURATION_PROPERTY]: {
              description: 'pinned items in the status bar',
              type: ['string'],
              hidden: true,
              default: ['podman'],
            },
          },
        },
      ]),
    );

    this.#configuration = this.configurationRegistry.getConfiguration(
      STATUS_BAR_PIN_CONSTANTS.STATUS_BAR_CONFIGURATION,
    );
    const options = this.#configuration.get<Array<string>>(STATUS_BAR_PIN_CONSTANTS.PINNED_CONFIGURATION_PROPERTY);
    if (options) {
      this.#pinned = new Set<string>(options);
      this.notify();
    }

    // notify if container connection changed
    this.#disposables.push(this.providers.onDidUpdateContainerConnection(this.notify.bind(this)));
  }
}
