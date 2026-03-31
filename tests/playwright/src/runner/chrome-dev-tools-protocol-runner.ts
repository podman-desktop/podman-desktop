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

import type { ChildProcess } from 'node:child_process';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

import type { Browser, Page } from '@playwright/test';
import { chromium } from '@playwright/test';

import { Runner } from '/@/runner/podman-desktop-runner';
import { RunnerFactory } from '/@/runner/runner-factory';
import type { RunnerOptions } from '/@/runner/runner-options';
import { waitUntil } from '/@/utility/wait';

interface CDPOptions {
  executablePath: string;
  debugPort: string;
  env: object;
  recordVideo?: object;
  timeout?: number;
  tracesDir?: string;
}

export class ChromeDevToolsProtocolRunner extends Runner {
  private _browser: Browser | undefined;
  private _electronProcess: ChildProcess | undefined;

  public constructor(options?: { runnerOptions?: RunnerOptions }) {
    super(options);
    console.log('ChromeDevToolsProtocolRunner constructor');
    this._options = this.defaultOptions();
  }

  /**
   * Get all pages (windows) from all browser contexts.
   * This is equivalent to ElectronApplication.windows() in ElectronRunner.
   */
  public getWindows(): Page[] {
    if (!this._browser) {
      throw Error('Browser not connected. Call start() first.');
    }

    const allPages: Page[] = [];
    for (const context of this._browser.contexts()) {
      allPages.push(...context.pages());
    }
    return allPages;
  }

  private async waitForCDPEndpoint(port: string, timeout = 30_000): Promise<void> {
    console.log(`Waiting for CDP endpoint at http://127.0.0.1:${port}/json/version`);
    await waitUntil(
      async () => {
        try {
          const response = await fetch(`http://127.0.0.1:${port}/json/version`);
          return response.ok;
        } catch (err) {
          // Connection errors are expected while app is starting
          return false;
        }
      },
      {
        timeout,
        diff: 1000,
        message: `CDP endpoint did not become ready within ${timeout}ms`,
      },
    );
    console.log(`CDP endpoint is ready at http://127.0.0.1:${port}`);
  }

  override async start(): Promise<Page> {
    if (this.isRunning()) {
      console.log('Podman Desktop is already running');
      return this.getPage();
    }

    try {
      // Extract configuration from options
      const { executablePath: pdBinary, debugPort, env } = this._options as CDPOptions;

      // Start the Electron app with CDP enabled
      await this.startAppWithDebug(pdBinary, debugPort, env);

      this._running = true;

      // Connect to the running instance via CDP
      this._browser = await chromium.connectOverCDP(`http://127.0.0.1:${debugPort}`);
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

      // Kill the spawned process before re-throwing
      if (this._electronProcess?.pid) {
        try {
          console.log(`Killing Electron process ${this._electronProcess.pid} due to startup failure`);
          process.kill(this._electronProcess.pid);
        } catch (killErr) {
          console.log(`Failed to kill process: ${killErr}`);
        }
      }

      throw Error(`Podman Desktop could not be started correctly with error: ${err}`);
    }

    // Direct Electron console to Node terminal.
    this.getPage().on('console', console.log);

    // Start playwright tracing
    await this.startTracing();

    return this._page;
  }

  override async close(timeout = 30_000): Promise<void> {
    const pid = this._electronProcess?.pid;
    console.log(`Closing Podman Desktop with timeout of ${timeout}ms, PID: ${pid}`);

    // Stop playwright tracing
    try {
      await this.stopTracing();
    } catch (err) {
      console.log(`Error stopping tracing: ${err}`);
    }

    if (!this.isRunning()) {
      throw Error('Podman Desktop is not running');
    }

    // Close the CDP browser connection
    if (this._browser) {
      try {
        await this.raceWithTimeout(
          this._browser.close(),
          timeout / 2,
          `Browser close timed out after ${timeout / 2}ms`,
        );
      } catch (err) {
        console.log(`Browser close failed: ${err}`);
      }
    }

    // Kill the Electron process
    if (this._electronProcess?.pid) {
      try {
        console.log(`Killing Electron process with PID: ${pid}`);
        process.kill(pid!, 'SIGTERM');

        // Wait briefly for graceful shutdown
        await this.raceWithTimeout(
          new Promise<void>(resolve => {
            this._electronProcess?.on('exit', () => resolve());
          }),
          timeout / 2,
          `Process ${pid} did not exit gracefully`,
        );
      } catch (err) {
        console.log(`Graceful shutdown failed, force killing: ${err}`);
        try {
          process.kill(pid!, 'SIGKILL');
        } catch (killErr) {
          console.log(`Force kill failed: ${killErr}`);
        }
      }
    }

    this._running = false;
    this._browser = undefined;
    this._electronProcess = undefined;
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

  private async startAppWithDebug(executablePath: string, debugPort: string, env: object): Promise<void> {
    console.log(`Starting Podman Desktop with CDP enabled: ${executablePath} on port ${debugPort}`);

    try {
      // Spawn the Electron process with remote debugging enabled
      this._electronProcess = spawn(executablePath, [`--remote-debugging-port=${debugPort}`], {
        env: env as NodeJS.ProcessEnv,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      const pid = this._electronProcess.pid;
      console.log(`Electron process started with PID: ${pid}`);

      // Monitor process output
      this._electronProcess.stdout?.on('data', data => {
        console.log(`STDOUT: ${data}`);
      });

      this._electronProcess.stderr?.on('data', data => {
        console.log(`STDERR: ${data}`);
      });

      this._electronProcess.on('error', error => {
        console.error(`Electron process error: ${error}`);
      });

      this._electronProcess.on('exit', (code, signal) => {
        console.log(`Electron process exited with code ${code} and signal ${signal}`);
      });

      // Wait for the CDP endpoint to become available
      await this.waitForCDPEndpoint(debugPort);
    } catch (err) {
      // Clean up the process if startup fails
      if (this._electronProcess?.pid) {
        console.log(`Startup failed, killing process ${this._electronProcess.pid}`);
        try {
          process.kill(this._electronProcess.pid);
        } catch (killErr) {
          console.log(`Failed to kill process: ${killErr}`);
        }
      }
      throw new Error(`Failed to start Electron app with CDP: ${err}`);
    }
  }
}
