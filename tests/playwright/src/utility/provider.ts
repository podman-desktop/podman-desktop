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

import { PodmanVirtualizationProviders } from '/@/model/core/types';
import { isMac, isWindows } from '/@/utility/platform';

export const envProvider = process.env.CONTAINERS_MACHINE_PROVIDER;

const PROVIDER_MAP: Record<string, PodmanVirtualizationProviders> = {
  wsl: PodmanVirtualizationProviders.WSL,
  hyperv: PodmanVirtualizationProviders.HyperV,
  applehv: PodmanVirtualizationProviders.AppleHV,
  libkrun: PodmanVirtualizationProviders.LibKrun,
  qemu: PodmanVirtualizationProviders.Qemu,
};

export function getVirtualizationProvider(): PodmanVirtualizationProviders | undefined {
  return envProvider ? PROVIDER_MAP[envProvider?.toLowerCase()] : undefined;
}

export function getDefaultVirtualizationProvider(): PodmanVirtualizationProviders {
  if (isWindows) {
    return PodmanVirtualizationProviders.WSL;
  }

  if (isMac) {
    return PodmanVirtualizationProviders.LibKrun;
  }

  return PodmanVirtualizationProviders.Native;
}
