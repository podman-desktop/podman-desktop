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

import type { DragPayload } from '@podman-desktop/core-api';

export const LONG_PRESS_MS = 350;

/**
 * Shared pointer/payload state while pinning from submenu or settings into the main nav.
 */
export const navigationDragState = $state<{
  payload?: DragPayload;
  pointerX: number;
  pointerY: number;
  /** Pointer offset into the grabbed row at long-press start (no hardcoded ghost centering). */
  grabOffsetX: number;
  grabOffsetY: number;
}>({
  pointerX: 0,
  pointerY: 0,
  grabOffsetX: 0,
  grabOffsetY: 0,
});
