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

import type { TelemetryLogger } from '@podman-desktop/api';
import { inject, injectable } from 'inversify';

import { TelemetryLoggerSymbol } from '/@/inject/symbols';
import { WinPlatform } from '/@/platforms/win-platform';
import { HyperVPrep } from '/@/platforms/windows/hyperv-prep';

/**
 * Exposes the Hyper-V preparation flow to the Windows onboarding workflow.
 * The command handlers and the onboarding context keys are added in a follow-up change.
 */
@injectable()
export class HyperVPrepOnboarding {
  @inject(HyperVPrep)
  private readonly hyperVPrep!: HyperVPrep;

  @inject(WinPlatform)
  private readonly winPlatform!: WinPlatform;

  @inject(TelemetryLoggerSymbol)
  private readonly telemetryLogger!: TelemetryLogger;
}
