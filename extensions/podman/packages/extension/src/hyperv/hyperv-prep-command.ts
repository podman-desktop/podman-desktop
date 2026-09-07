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

import type { Disposable, ExtensionContext, RunError, TelemetryLogger } from '@podman-desktop/api';
import { commands, env, ProgressLocation, window } from '@podman-desktop/api';

import { HYPERV_PREP_COMMAND } from '/@/constants';
import {
  getHyperVPrepStatus,
  HYPERV_PREP_RELOGIN_MESSAGE,
  isHyperVPrepSupported,
  refreshHyperVPrepContext,
  runHyperVPrep,
} from '/@/hyperv/hyperv-prep';
import type { PodmanBinary } from '/@/utils/podman-binary';

export function registerHyperVPrepCommands(
  podmanBinary: PodmanBinary,
  telemetryLogger?: TelemetryLogger,
): Disposable[] {
  const prepareCommand = commands.registerCommand(HYPERV_PREP_COMMAND, async () => {
    if (!env.isWindows || !(await isHyperVPrepSupported(podmanBinary))) {
      return;
    }

    const currentStatus = await getHyperVPrepStatus();
    if (currentStatus.status === 'applied') {
      await window.showInformationMessage('Hyper-V preparation is already applied.');
      await refreshHyperVPrepContext(podmanBinary, telemetryLogger);
      return;
    }

    const confirmation = await window.showInformationMessage(
      'Prepare Hyper-V now? Administrator approval (UAC) is required.',
      'Yes',
      'No',
    );
    if (confirmation !== 'Yes') {
      return;
    }

    try {
      await window.withProgress(
        {
          location: ProgressLocation.TASK_WIDGET,
          title: 'Preparing Hyper-V',
        },
        () => runHyperVPrep(),
      );
    } catch (error) {
      const runError = error as RunError;
      const message = runError.message ?? runError.stderr ?? 'Unknown error while preparing Hyper-V.';
      telemetryLogger?.logError('hypervPrepFailed', { error: message });
      await window.showErrorMessage(`Hyper-V preparation failed: ${message}`);
      return;
    }

    const updatedStatus = await refreshHyperVPrepContext(podmanBinary, telemetryLogger);
    if (updatedStatus) {
      telemetryLogger?.logUsage('podman.hypervPrep', { status: updatedStatus.status });
      await window.showInformationMessage(`Hyper-V preparation applied.\n\n${HYPERV_PREP_RELOGIN_MESSAGE}`);
    }
  });

  return [prepareCommand];
}

export async function initHyperVPrep(
  extensionContext: ExtensionContext,
  podmanBinary: PodmanBinary,
  telemetryLogger?: TelemetryLogger,
): Promise<void> {
  if (env.isWindows) {
    await refreshHyperVPrepContext(podmanBinary, telemetryLogger);
  }

  extensionContext.subscriptions.push(...registerHyperVPrepCommands(podmanBinary, telemetryLogger));
}
