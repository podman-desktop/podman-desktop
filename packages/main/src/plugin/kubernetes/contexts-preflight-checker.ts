/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import path from 'node:path';

import { isWindows } from '/@/util.js';

import type { Exec } from '../util/exec.js';
import type { KubeConfigSingleContext } from './kubeconfig-single-context.js';

export interface PreflightCheckContextResults {
  contextName: string;
  results: PreflightCheckResult[];
}

export interface PreflightCheckResult {
  description: string;
}

export class ContextsPreflightChecker {
  #exec: Exec;

  #registry = new PreflightCheckRegistry();

  constructor(exec: Exec) {
    this.#exec = exec;
  }

  async check(contextName: string, config: KubeConfigSingleContext): Promise<void> {
    // reset all results for this context
    this.#registry.reset(contextName);
    await this.frelightCheckUserExecCommand(contextName, config);
  }

  delete(contextName: string): void {
    this.#registry.delete(contextName);
  }

  getResults(): PreflightCheckContextResults[] {
    return this.#registry.getAll();
  }

  private isBasename(command: string): boolean {
    return path.basename(command) === command;
  }

  private async isCommandInPath(command: string): Promise<boolean> {
    const checkCommand = isWindows() ? 'where.exe' : 'which';
    try {
      await this.#exec.exec(checkCommand, [command]);
      return true;
    } catch {
      return false;
    }
  }

  // frelightCheckUserExecCommand checks that the exec command is in the user's path (if the command does not contain any path)
  private async frelightCheckUserExecCommand(contextName: string, config: KubeConfigSingleContext): Promise<void> {
    const kubeconfig = config.getKubeConfig();
    if (kubeconfig.users?.length === 0) {
      return;
    }
    const user = kubeconfig.users[0];
    if (!user?.exec?.command) {
      return;
    }
    const command = user.exec.command;
    if (!this.isBasename(command)) {
      return;
    }
    if (await this.isCommandInPath(command)) {
      return;
    }
    let description = `the command "${command}" is not in the PATH. Consider using the full path of the command in the kubeconfig file`;
    if (user?.exec?.installHint) {
      description += `\n${user.exec.installHint}`;
    }
    this.#registry.addResult(contextName, {
      description,
    });
  }
}

export class PreflightCheckRegistry {
  #registry = new Map<string, PreflightCheckResult[]>();

  public reset(contextName: string): void {
    this.#registry.set(contextName, []);
  }

  public addResult(contextName: string, result: PreflightCheckResult): void {
    this.#registry.set(contextName, [...(this.#registry.get(contextName) ?? []), result]);
  }

  public delete(contextName: string): void {
    this.#registry.delete(contextName);
  }

  getAll(): PreflightCheckContextResults[] {
    return Array.from(this.#registry.entries()).flatMap(([contextName, results]) => ({
      contextName,
      results,
    }));
  }
}
