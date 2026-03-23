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

import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { isLinux, isMac, isWindows } from './platform';

export type ContainerAuthConfigEntry = {
  [key: string]: {
    auth: string;
    podmanDesktopAlias?: string;
  };
};

export type ContainersAuthConfigFile = {
  auths?: ContainerAuthConfigEntry;
};

/**
 * Get the auth.json file location based on the platform and environment.
 * This replicates the logic from registry-setup.ts in the Podman extension.
 */
export function getAuthFileLocation(): string {
  let podmanConfigContainersPath = '';

  // Check if PODMAN_DESKTOP_HOME_DIR is set (used in E2E tests)
  const podmanDesktopHomeDir = process.env.PODMAN_DESKTOP_HOME_DIR;

  if (isMac || isWindows) {
    const baseDir = podmanDesktopHomeDir ?? os.homedir();
    podmanConfigContainersPath = path.resolve(baseDir, '.config/containers');
  } else if (isLinux) {
    const xdgRuntimeDirectory = process.env.XDG_RUNTIME_DIR ?? '';
    podmanConfigContainersPath = path.resolve(xdgRuntimeDirectory, 'containers');
  }

  return path.resolve(podmanConfigContainersPath, 'auth.json');
}

/**
 * Read the auth.json file and return its contents.
 * Creates an empty auth file if it doesn't exist.
 */
export async function readAuthFile(): Promise<ContainersAuthConfigFile> {
  const authFilePath = getAuthFileLocation();

  // Create empty auth file if it doesn't exist (writeAuthFile handles dir creation)
  if (!fs.existsSync(authFilePath)) {
    const emptyAuthFile = { auths: {} } as ContainersAuthConfigFile;
    await writeAuthFile(emptyAuthFile);
    return emptyAuthFile;
  }

  try {
    const data = await fsPromises.readFile(authFilePath, 'utf-8');
    return JSON.parse(data) as ContainersAuthConfigFile;
  } catch (error) {
    console.error('Error reading or parsing auth file', error);
    return { auths: {} };
  }
}

/**
 * Write data to the auth.json file.
 */
export async function writeAuthFile(authConfig: ContainersAuthConfigFile): Promise<void> {
  const authFilePath = getAuthFileLocation();
  const authFileDir = path.dirname(authFilePath);

  // Ensure directory exists
  if (!fs.existsSync(authFileDir)) {
    fs.mkdirSync(authFileDir, { recursive: true });
  }

  await fsPromises.writeFile(authFilePath, JSON.stringify(authConfig, undefined, 2), 'utf8');
}

/**
 * Inject invalid registry credentials directly into the auth.json file.
 * This is used for testing registry validation scenarios.
 *
 * @param registryUrl - The registry URL (e.g., 'default-route-openshift-image-registry.apps-crc.testing')
 * @param username - The username (will be base64-encoded with the password)
 * @param password - The password (will be base64-encoded with the username)
 */
export async function injectInvalidCredentials(registryUrl: string, username: string, password: string): Promise<void> {
  const authFile = await readAuthFile();
  authFile.auths ??= {};

  authFile.auths[registryUrl] = {
    auth: Buffer.from(`${username}:${password}`).toString('base64'),
  };

  await writeAuthFile(authFile);
  console.log(`Injected invalid credentials for ${registryUrl}`);
}

/**
 * Remove specific registry credentials from the auth.json file.
 */
export async function removeRegistryCredentials(registryUrl: string): Promise<void> {
  const authFile = await readAuthFile();

  if (authFile.auths?.[registryUrl]) {
    delete authFile.auths[registryUrl];
    await writeAuthFile(authFile);
    console.log(`Removed credentials for ${registryUrl}`);
  }
}

/**
 * Backup the current auth.json file.
 * Returns the path to the backup file.
 */
export async function backupAuthFile(): Promise<string | undefined> {
  const authFilePath = getAuthFileLocation();

  if (!fs.existsSync(authFilePath)) {
    return undefined;
  }

  const backupPath = `${authFilePath}.backup-${Date.now()}`;
  await fsPromises.copyFile(authFilePath, backupPath);
  console.log(`Backed up auth file to ${backupPath}`);
  return backupPath;
}

/**
 * Restore auth.json from a backup file.
 */
export async function restoreAuthFile(backupPath: string): Promise<void> {
  const authFilePath = getAuthFileLocation();

  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }

  await fsPromises.copyFile(backupPath, authFilePath);
  console.log(`Restored auth file from ${backupPath}`);
  await fsPromises.unlink(backupPath).catch((err: unknown) => {
    console.warn(`Failed to remove backup file: ${err}`);
  });
}
