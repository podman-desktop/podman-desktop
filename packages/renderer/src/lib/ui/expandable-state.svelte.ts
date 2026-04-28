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

import { onDestroy, onMount } from 'svelte';

import { onDidChangeConfiguration } from '/@/stores/configurationProperties';

/**
 * Encapsulates the expand/collapse state and configuration persistence logic
 * shared by components that use the Expandable component.
 *
 * Usage:
 *   const expandableState = new ExpandableState('mySection.expanded');
 */
export class ExpandableState {
  expanded: boolean = $state(true);
  initialized: boolean = $state(false);

  readonly #configurationKey: string;

  readonly #listener: EventListener = (obj: object) => {
    if ('detail' in obj) {
      const detail = (obj as CustomEvent<{ key: string; value: boolean }>).detail;
      if (this.#configurationKey === detail?.key) {
        this.expanded = detail.value;
      }
    }
  };

  constructor(configurationKey: string) {
    this.#configurationKey = configurationKey;

    onMount(async () => {
      onDidChangeConfiguration.addEventListener(this.#configurationKey, this.#listener);
      try {
        this.expanded = (await window.getConfigurationValue<boolean>(this.#configurationKey)) ?? true;
      } finally {
        this.initialized = true;
      }
    });

    onDestroy(() => {
      onDidChangeConfiguration.removeEventListener(this.#configurationKey, this.#listener);
    });
  }

  async toggle(value: boolean): Promise<void> {
    await window.updateConfigurationValue(this.#configurationKey, value);
    await window.telemetryTrack(`dashboard.healthCard.${value ? 'expanded' : 'collapsed'}`);
  }
}
