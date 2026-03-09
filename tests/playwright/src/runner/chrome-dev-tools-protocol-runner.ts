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

import { join } from 'node:path';

import type { Browser, Page } from '@playwright/test';
import { chromium } from '@playwright/test';

import { Runner } from '/@/runner/podman-desktop-runner';
import { RunnerFactory } from '/@/runner/runner-factory';
import type { RunnerOptions } from '/@/runner/runner-options';

export class ChromeDevToolsProtocolRunner extends Runner {
  private _browser: Browser | undefined;

  public constructor(options?: { runnerOptions?: RunnerOptions }) {
    super(options);
    console.log('ChromeDevToolsProtocolRunner constructor');
  }

  override async start(): Promise<Page> {
    if (!this._runnerOptions._cdp) {
      throw new Error('cannot start connection over Chrome DevTools protocol without cdp options specified.');
    }

    if (this.isRunning()) {
      console.log('Podman Desktop is already running');
      return this.getPage();
    }

    try {
      this._running = true;
      // start the electron binary

      this._browser = await chromium.connectOverCDP(this._runnerOptions._cdp.endpointURL, this._runnerOptions._cdp);
      const contexts = this._browser.contexts();
      if (contexts.length !== 1) {
        throw new Error(`expected browser to have only one contexts, received ${contexts.length}`);
      }
      const pages = contexts[0].pages();
      if (pages.length !== 1) {
        throw new Error(`expected context to have a one page, received ${pages.length}`);
      }
      this._page = pages[0];
    } catch (err: unknown) {
      console.log(`Caught exception in startup: ${err}`);
      throw Error(`Podman Desktop could not be started correctly with error: ${err}`);
    }

    // Direct Electron console to Node terminal.
    this.getPage().on('console', console.log);

    // Start playwright tracing
    await this.startTracing();

    return this._page;
  }

  override async close(): Promise<void> {
    // Stop playwright tracing
    await this.stopTracing();

    if (!this.isRunning()) {
      throw Error('Podman Desktop is not running');
    }

    await this._page?.close();
    await this._browser?.contexts()[0].close();
    await this._browser?.close();

    this._running = false;
    this._browser = undefined;
    RunnerFactory.dispose();

    if (this._videoAndTraceName) {
      const videoPath = join(this._testOutput, 'videos', `${this._videoAndTraceName}.webm`);
      const elapsed = await this.trackTime(async () => await this.saveVideoAs(videoPath));
      console.log(`Saving a video file took: ${elapsed} ms`);
      console.log(`Video file saved as: ${videoPath}`);
    }
    await this.removeTracesOnFinished();
  }
}
