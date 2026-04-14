/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import { DarwinSocketCompatibility } from '/@/compatibility-mode/darwin-socket-compatibility';
import { LinuxSocketCompatibility } from '/@/compatibility-mode/linux-socket-compatibility';
import type { SocketCompatibility } from '/@/compatibility-mode/socket-compatibility';

// TODO: Windows
export function getSocketCompatibility(): SocketCompatibility {
  switch (process.platform) {
    case 'darwin':
      return new DarwinSocketCompatibility();
    case 'linux':
      return new LinuxSocketCompatibility();
    default:
      throw new Error(`Unsupported platform ${process.platform}`);
  }
}
