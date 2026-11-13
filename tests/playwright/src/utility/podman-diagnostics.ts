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

import { execSync } from 'node:child_process';
import * as os from 'node:os';

import { isWindows } from '/@/utility/platform';

const DIAGNOSTICS_BANNER = 'PODMAN DESKTOP E2E DIAGNOSTICS';
const COMMAND_TIMEOUT_MS = 60_000;

/**
 * Runs a host command and logs stdout/stderr with a clear CI-searchable banner.
 * Never throws — diagnostics must not mask the original test failure.
 */
function logCommand(label: string, command: string, options?: { shell?: boolean }): void {
  const separator = '='.repeat(72);
  console.log(`\n${separator}`);
  console.log(`${DIAGNOSTICS_BANNER}: ${label}`);
  console.log(`command: ${command}`);
  console.log(separator);
  try {
    // eslint-disable-next-line sonarjs/os-command, n/no-sync
    const output = execSync(command, {
      encoding: 'utf8',
      timeout: COMMAND_TIMEOUT_MS,
      shell: options?.shell ?? true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    console.log(output.trimEnd() || '(empty output)');
  } catch (error: unknown) {
    const execError = error as {
      status?: number | null;
      stdout?: string | Buffer;
      stderr?: string | Buffer;
      message?: string;
    };
    const stdout = execError.stdout?.toString().trimEnd() ?? '';
    const stderr = execError.stderr?.toString().trimEnd() ?? '';
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.log(`stderr:\n${stderr}`);
    }
    console.log(
      `command failed (exit ${String(execError.status ?? 'unknown')}): ${execError.message ?? String(error)}`,
    );
  }
  console.log(`${separator}\n`);
}

/**
 * Host + machine diagnostics requested when investigating Windows volume/exec
 * failures (e.g. crun oom_score_adj Permission denied on interactive alpine).
 */
export function logPodmanEnvironmentDiagnostics(context = 'suite-start'): void {
  console.log(`\n>>> ${DIAGNOSTICS_BANNER} BEGIN (${context}) <<<`);
  console.log(`timestamp: ${new Date().toISOString()}`);
  console.log(`platform: ${os.platform()} ${os.release()} (${os.arch()})`);
  console.log(`CI: ${String(process.env.CI)}`);
  console.log(`CONTAINERS_MACHINE_PROVIDER: ${String(process.env.CONTAINERS_MACHINE_PROVIDER ?? '(unset)')}`);

  logCommand('podman version', 'podman version');
  logCommand('podman info', 'podman info');
  logCommand('podman machine ls', 'podman machine ls --format json');
  logCommand('podman machine inspect', 'podman machine inspect');
  logCommand('podman system connection ls', 'podman system connection ls');

  // Machine guest details that matter for rootless/crun regressions.
  logCommand('machine uname', 'podman machine ssh -- uname -a');
  logCommand('machine os-release', 'podman machine ssh -- cat /etc/os-release');
  logCommand('machine id', 'podman machine ssh -- id');
  logCommand('machine crun version', 'podman machine ssh -- crun --version');
  logCommand(
    'machine runtime packages',
    'podman machine ssh -- sh -c "rpm -q crun runc podman containers-common 2>/dev/null || true; command -v crun; command -v runc"',
  );
  logCommand(
    'machine userns/uidmap',
    'podman machine ssh -- sh -c "id; cat /proc/self/uid_map; cat /proc/self/gid_map; ls -l /proc/self/ns/user 2>/dev/null || true"',
  );

  if (isWindows) {
    logCommand('windows ver', 'cmd /c ver');
    // Primary ask from Podman CLI maintainers for WSL CI.
    logCommand('wsl --version', 'wsl --version');
    logCommand('wsl -l -v', 'wsl -l -v');
    logCommand(
      'hyper-v feature state',
      'powershell -NoProfile -Command "Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All | Select-Object FeatureName,State | Format-List"',
    );
  }

  console.log(`>>> ${DIAGNOSTICS_BANNER} END (${context}) <<<\n`);
}

/**
 * Extra diagnostics around a specific container that failed interactive exec / Terminal.
 */
export function logContainerExecDiagnostics(containerName: string, context = 'container-failure'): void {
  console.log(`\n>>> ${DIAGNOSTICS_BANNER} CONTAINER BEGIN (${context}: ${containerName}) <<<`);

  logCommand(`podman inspect ${containerName}`, `podman inspect ${containerName}`);
  logCommand(`podman ps -a filter ${containerName}`, `podman ps -a --filter name=${containerName} --format json`);

  // Non-TTY exec first — isolate whether create/start succeeded vs attach/TTY path.
  logCommand(
    `podman exec (non-tty) ${containerName}`,
    `podman exec ${containerName} /bin/sh -c "id; pwd; ls -la /tmp/mount 2>/dev/null || ls -la / || true"`,
  );
  // Interactive-ish exec similar to Desktop Terminal attach path.
  logCommand(`podman exec -it ${containerName}`, `podman exec -it ${containerName} /bin/sh -c "echo EXEC_OK; pwd"`);

  console.log(`>>> ${DIAGNOSTICS_BANNER} CONTAINER END (${context}: ${containerName}) <<<\n`);
}
