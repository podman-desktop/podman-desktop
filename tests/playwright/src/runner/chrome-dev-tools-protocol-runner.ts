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
    this._options = this.defaultOptions();
  }

  override async start(): Promise<Page> {
    if (this.isRunning()) {
      console.log('Podman Desktop is already running');
      return this.getPage();
    }

    try {
      // start the app on PODMAN_DESKTOP_BINARY + DEBUGGING_PORT
      // const electronProcess = spawn
      this._running = true;

      // connect to the running instance
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

  protected override defaultOptions(): object {
    const pdArgs = process.env.PODMAN_DESKTOP_ARGS;
    const pdBinary = process.env.PODMAN_DESKTOP_BINARY;
    const debugPort = process.env.DEBUGGING_PORT;
    if (pdArgs) {
      throw new Error(
        'PODMAN_DESKTOP_ARGS and PODMAN_DESKTOP_BINARY are both set, cannot run tests in development and production mode at the same time...',
      );
    }
    if (!pdBinary || !debugPort) {
      throw new Error('Cannot run app over CDP without DEBUGGING_PORT or PODMAN_DESKTOP_BINARY...');
    }
    const directory = join(this._testOutput, 'videos');
    const tracesDir = join(this._testOutput, 'traces', 'raw');
    console.log(`video will be written to: ${directory}`);
    const env = this.setupPodmanDesktopCustomFolder();
    const recordVideo = {
      dir: directory,
      size: {
        width: 1050,
        height: 700,
      },
    };
    // executablePath defaults to this package's installation location: node_modules/.bin/electron
    const executablePath = pdBinary;
    const timeout = 45000;
    return {
      executablePath,
      env,
      recordVideo,
      timeout,
      tracesDir,
      debugPort,
    };
  }
}
