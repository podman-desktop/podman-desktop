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

// Below is the location of the managed defaults file on different OS'
// this will be the Managed by profile which will show some "suggested defaults" by
// the system administrator.
export const SYSTEM_DEFAULTS_FILE_MAC = '/Library/Application Support/com.podman.desktop/default-settings.json';
export const SYSTEM_DEFAULTS_FILE_WINDOWS_DIR = 'PodmanDesktop';
export const SYSTEM_DEFAULTS_FILE_WINDOWS_FILE = 'default-settings.json';
export const SYSTEM_DEFAULTS_FILE_LINUX = '/usr/share/podman-desktop/default-settings.json';

// Below is the location of the managed locked file on different OS'
// this will be the Managed by profile which will contain configuration keys that are "locked"
// and cannot be changed by the user.
export const SYSTEM_LOCKED_FILE_MAC = '/Library/Application Support/com.podman.desktop/locked.json';
export const SYSTEM_LOCKED_FILE_WINDOWS_DIR = 'PodmanDesktop';
export const SYSTEM_LOCKED_FILE_WINDOWS_FILE = 'locked.json';
export const SYSTEM_LOCKED_FILE_LINUX = '/usr/share/podman-desktop/locked.json';
