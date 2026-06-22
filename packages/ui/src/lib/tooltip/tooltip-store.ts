/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { derived, type Readable, writable } from 'svelte/store';

// Internal counter tracking how many dropdowns/menus are currently open
const tooltipHideCount = writable(0);

// Public derived store - true when tooltips should be hidden (count > 0)
export const tooltipHidden = setup();

export function setup(): Readable<boolean> {
  const derived$ = derived(tooltipHideCount, $count => $count > 0);

  window.addEventListener('tooltip-show', () => {
    tooltipHideCount.update(count => Math.max(0, count - 1));
  });

  window.addEventListener('tooltip-hide', () => {
    tooltipHideCount.update(count => count + 1);
  });

  return derived$;
}

// Export for testing purposes only
export function resetTooltipHideCount(): void {
  tooltipHideCount.set(0);
}
