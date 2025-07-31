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

import { isMac, isWindows } from '..';
import { PodmanVirtualizationProviders } from '../model/core/types';

export const envProvider = process.env.CONTAINERS_MACHINE_PROVIDER?.toLowerCase();
export const virtualizationProvider =
  envProvider === 'wsl'
    ? PodmanVirtualizationProviders.WSL
    : envProvider === 'hyperv'
      ? PodmanVirtualizationProviders.HyperV
      : envProvider === 'applehv'
        ? PodmanVirtualizationProviders.AppleHV
        : envProvider === 'libkrun'
          ? PodmanVirtualizationProviders.LibKrun
          : envProvider === 'qemu'
            ? PodmanVirtualizationProviders.Qemu
            : undefined;

export function getDefaultVirtualizationProvider(): PodmanVirtualizationProviders {
  if (isWindows) {
    return PodmanVirtualizationProviders.WSL;
  } else if (isMac) {
    return PodmanVirtualizationProviders.AppleHV;
  } else return PodmanVirtualizationProviders.Qemu;
}
