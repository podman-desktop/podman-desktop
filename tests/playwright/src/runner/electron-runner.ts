/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

import type { ElectronApplication, JSHandle, Page } from '@playwright/test';
import { _electron as electron } from '@playwright/test';
import type { BrowserWindow } from 'electron';

import { RunnerFactory } from '/@/runner/runner-factory';
import { waitWhile } from '/@/utility/wait';

import { Runner } from './podman-desktop-runner';
import type { RunnerOptions } from './runner-options';

type WindowState = {
  isVisible: boolean;
  isDevToolsOpened: boolean;
  isCrashed: boolean;
};

export class ElectronRunner extends Runner {
  protected _app: ElectronApplication | undefined;

  public constructor(options?: { runnerOptions?: RunnerOptions }) {
    super(options);
    console.log('ElectronRunner constructor');
  }

  public override async start(): Promise<Page> {
    if (this.isRunning()) {
      console.log('Podman Desktop is already running');
      return this.getPage();
    }

    try {
      // start the app with given properties
      this._running = true;
      console.log('Starting Podman Desktop');
      console.log('Electron app launch options: ');
      Object.keys(this._options).forEach(key => {
        console.log(`${key}: ${(this._options as { [k: string]: string })[key]}`);
      });
      this._app = await electron.launch({
        ...this._options,
      });
      // setup state
      this._page = await this.getElectronApp().firstWindow();
      const exe = this.getElectronApp().evaluate(async ({ app }) => {
        return app.getPath('exe');
      });
      const filePath = await exe;
      console.log(`The Executable Electron app. file: ${filePath}`);

      // Evaluate that the main window is visible
      // at the same time, the function also makes sure that event 'ready-to-show' was triggered
      // keeping this call meeses up communication between playwright and electron app on linux
      // did not have time to investigate why is this occasionally happening
      // const windowState = await this.getBrowserWindowState();
    } catch (err) {
      console.log(`Caught exception in startup: ${err}`);
      throw Error(`Podman Desktop could not be started correctly with error: ${err}`);
    }

    // Direct Electron console to Node terminal.
    this.getPage().on('console', console.log);

    // Start playwright tracing
    await this.startTracing();

    // also get stderr from the node process
    this._app.process().stderr?.on('data', data => {
      console.log(`STDERR: ${data}`);
    });

    return this._page;
  }

  public getElectronApp(): ElectronApplication {
    if (this._app) {
      return this._app;
    }

    throw Error('Application was not started yet');
  }

  public async getBrowserWindow(): Promise<JSHandle<BrowserWindow>> {
    return await this.getElectronApp().browserWindow(this.getPage());
  }

  public async getBrowserWindowState(): Promise<WindowState> {
    return await (await this.getBrowserWindow()).evaluate((mainWindow): Promise<WindowState> => {
      const getState = (): { isVisible: boolean; isDevToolsOpened: boolean; isCrashed: boolean } => {
        return {
          isVisible: mainWindow.isVisible(),
          isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
          isCrashed: mainWindow.webContents.isCrashed(),
        };
      };

      return new Promise(resolve => {
        /**
         * The main window is created hidden, and is shown only when it is ready.
         * See {@link ../packages/main/src/mainWindow.ts} function
         */
        if (mainWindow.isVisible()) {
          resolve(getState());
        } else
          mainWindow.once('ready-to-show', () => {
            resolve(getState());
          });
      });
    });
  }

  public override async close(timeout = 30_000): Promise<void> {
    // Stop playwright tracing
    await this.stopTracing();

    if (!this.isRunning()) {
      throw Error('Podman Desktop is not running');
    }

    if (this.getElectronApp()) {
      const pid = this.getElectronApp()?.process()?.pid;
      console.log(`Closing Podman Desktop with a timeout of ${timeout} ms`);
      try {
        await Promise.race([
          waitWhile(async () => this.isRunning(), { timeout: timeout, diff: 100 }),
          this.getElectronApp().close(),
        ]);
      } catch (err: unknown) {
        console.log(`Caught exception in closing: ${err}`);
        console.log('Trying to kill the electron app process');
        if (pid) {
          console.log(`Killing the electron app process with PID: ${pid}`);
          try {
            process.kill(pid as number);
          } catch (error: unknown) {
            console.log(`Exception thrown when killing the process: ${error}`);
          }
        }
      }
    }
    this._running = false;
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
