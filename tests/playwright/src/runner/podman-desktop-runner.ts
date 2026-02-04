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
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import type { Page } from '@playwright/test';
import { test } from '@playwright/test';

import { RunnerOptions } from '/@/runner/runner-options';
import { isLinux } from '/@/utility/platform';

export abstract class Runner {
  protected _options: object;
  protected _running: boolean;
  protected _page: Page | undefined;
  protected readonly _profile: string;
  protected readonly _customFolder;
  protected readonly _testOutput: string;
  protected _videoAndTraceName: string | undefined;
  protected _runnerOptions: RunnerOptions;
  protected _saveTracesOnPass: boolean;
  protected _saveVideosOnPass: boolean;

  protected constructor(options?: { runnerOptions?: RunnerOptions }) {
    this._running = false;
    this._runnerOptions = options?.runnerOptions ?? new RunnerOptions();
    this._profile = this._runnerOptions._profile;
    this._saveTracesOnPass = this._runnerOptions._saveTracesOnPass;
    this._saveVideosOnPass = this._runnerOptions._saveVideosOnPass;
    this._testOutput = join(this._runnerOptions._customOutputFolder, this._profile);
    this._customFolder = join(this._testOutput, this._runnerOptions._customFolder);
    this._videoAndTraceName = undefined;

    // Options setting always needs to be last action in constructor in order to apply settings correctly
    this._options = this.defaultOptions();
  }

  abstract start(): Promise<Page>;
  abstract close(timeout?: number): Promise<void>;

  public getPage(): Page {
    if (this._page) {
      return this._page;
    }

    throw Error('Application was not started yet');
  }

  public get options(): object {
    return this._options;
  }

  public setOptions(value: object): void {
    this._options = value;
  }

  public isRunning(): boolean {
    return this._running;
  }

  protected setupPodmanDesktopCustomFolder(): object {
    const env: { [key: string]: string } = process.env as { [key: string]: string };
    const dir = join(this._customFolder);
    console.log(`podman desktop custom config will be written to: ${dir}`);
    env.PODMAN_DESKTOP_HOME_DIR = dir;

    // required to get dashboard opened, https://github.com/podman-desktop/podman-desktop/issues/15220
    if (isLinux) {
      env.XDG_SESSION_TYPE = 'x11';
    }

    // add a custom config file by disabling OpenDevTools
    const settingsFile = resolve(dir, 'configuration', 'settings.json');

    // create parent folder if missing
    const parentDir = dirname(settingsFile);
    if (!existsSync(parentDir)) {
      mkdirSync(parentDir, { recursive: true });
    }

    const settingsContent = this._runnerOptions.createSettingsJson();

    // write the file
    console.log(`disabling OpenDevTools in configuration file ${settingsFile}`);
    writeFileSync(settingsFile, settingsContent);

    return env;
  }

  private defaultOptions(): object {
    const pdArgs = process.env.PODMAN_DESKTOP_ARGS;
    const pdBinary = process.env.PODMAN_DESKTOP_BINARY;
    if (pdArgs && pdBinary) {
      throw new Error(
        'PODMAN_DESKTOP_ARGS and PODMAN_DESKTOP_BINARY are both set, cannot run tests in development and production mode at the same time...',
      );
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
    const args = pdArgs ? [pdArgs] : ['.'];
    // executablePath defaults to this package's installation location: node_modules/.bin/electron
    const executablePath = pdArgs ? join(pdArgs, 'node_modules', '.bin', 'electron') : (pdBinary ?? undefined);
    const timeout = 45000;
    return {
      args,
      executablePath,
      env,
      recordVideo,
      timeout,
      tracesDir,
    };
  }

  async saveVideoAs(path: string): Promise<void> {
    const video = this.getPage().video();
    if (video) {
      try {
        await video.saveAs(path);
      } catch (error) {
        console.log(`Caught exception when saving video: ${error}`);
      } finally {
        try {
          await video.delete();
        } catch (error) {
          console.log(`Caught exception when deleting video: ${error}`);
        }
      }
    } else {
      console.log('Video file associated was not found');
    }
  }

  public async startTracing(): Promise<void> {
    await this.getPage().context().tracing.start({ screenshots: true, snapshots: true, sources: true });
  }

  public async stopTracing(): Promise<void> {
    let name = '';
    if (this._videoAndTraceName) name = this._videoAndTraceName;

    name = name + '_trace.zip';
    await this.getPage()
      .context()
      .tracing.stop({ path: join(this._testOutput, 'traces', name) });
  }

  async removeTracesOnFinished(): Promise<void> {
    const rawTracesPath = join(this._testOutput, 'traces', 'raw');

    if (existsSync(rawTracesPath)) {
      console.log(`Removing raw traces folder: ${rawTracesPath}`);
      rmSync(rawTracesPath, { recursive: true, force: true, maxRetries: 5 });
    }

    try {
      const testStatus = test.info().status;
      console.log(`Test finished with status:${testStatus}`);
      if (testStatus !== 'passed' && testStatus !== 'skipped') return;
    } catch (err) {
      console.log(`Caught exception in removing traces: ${err}`);
      return;
    }

    if (!process.env.KEEP_TRACES_ON_PASS && !this._saveTracesOnPass) {
      const tracesPath = join(this._testOutput, 'traces', `${this._videoAndTraceName}_trace.zip`);
      if (existsSync(tracesPath)) {
        console.log(`Removing traces folder: ${tracesPath}`);
        rmSync(tracesPath, { recursive: true, force: true, maxRetries: 5 });
      }
    }

    if (!process.env.KEEP_VIDEOS_ON_PASS && !this._saveVideosOnPass) {
      const videoPath = join(this._testOutput, 'videos', `${this._videoAndTraceName}.webm`);
      if (existsSync(videoPath)) {
        console.log(`Removing video folder: ${videoPath}`);
        rmSync(videoPath, { recursive: true, force: true, maxRetries: 5 });
      }
    }
  }

  protected async trackTime(fn: () => Promise<void>): Promise<number> {
    const start = performance.now();
    return await fn
      .call(() => {
        /* no actual logic */
      })
      .then(() => {
        return performance.now() - start;
      });
  }

  public setVideoAndTraceName(name: string): void {
    this._videoAndTraceName = name;

    if (test.info().retry > 0) {
      this._videoAndTraceName += `_retry-${test.info().retry}`;
    }
  }

  public getTestOutput(): string {
    return this._testOutput;
  }

  public async screenshot(filename: string): Promise<void> {
    await this.getPage().screenshot({ path: join(this._testOutput, 'screenshots', filename) });
  }
}
