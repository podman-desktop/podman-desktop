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

import { RunnerOptions } from '/@/runner/runner-options';
import { expect as playExpect, test } from '/@/utility/fixtures';

/**
 * A reminder that fell due while the application was closed. The dialog is
 * expected on the next start; before this was fixed it was shown during plugin
 * system startup, when the renderer had not yet mounted the component that
 * draws it, and the user saw nothing.
 */
const REMIND_AT_IN_THE_PAST = 1_766_965_484_260;

test.use({
  runnerOptions: new RunnerOptions({
    customFolder: 'experimental-feature-feedback',
    customSettings: {
      'statusbarProviders.showProviders': {
        remindAt: REMIND_AT_IN_THE_PAST,
        disabled: false,
      },
    },
  }),
});

test.beforeAll(async ({ runner }) => {
  runner.setVideoAndTraceName('experimental-feature-feedback-e2e');
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe('Experimental feature feedback dialog', { tag: ['@smoke'] }, () => {
  // One test, not two: the dialog is a startup event and there is one of it per
  // launch. A second test observing the same dialog would depend on what the
  // first one left behind, which is how an e2e suite starts passing in one
  // order and failing in another.
  test('is shown on startup when a reminder is due, and closes when answered', async ({ page }) => {
    // The welcome page is deliberately not dismissed first: the point is that
    // the dialog survives startup on its own, without anybody asking for it.
    const dialog = page.getByRole('dialog', { name: 'Share Feedback' });

    await playExpect(dialog).toBeVisible({ timeout: 30_000 });

    // 'Remind me later' opens the choices rather than answering; the answers are
    // the RemindOption values the handler knows.
    await dialog.getByRole('button', { name: 'Remind me later' }).click();
    await dialog.getByRole('button', { name: 'Remind me tomorrow' }).click();

    await playExpect(dialog).toBeHidden();
  });
});
