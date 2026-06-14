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

export type ExtensionDetailsWarningSeverity = 'warning' | 'error';

export interface ExtensionDetailsWarning {
  key: string;
  severity: ExtensionDetailsWarningSeverity;
  title: string;
  detail: string;
  fix: string;
}

export function formatExtensionDetailsWarningLine(warning: ExtensionDetailsWarning): string {
  return `${warning.title}: ${warning.detail} ${warning.fix}`;
}

export function formatExtensionDetailsWarningTooltip(warning: ExtensionDetailsWarning): string {
  return formatExtensionDetailsWarningLine(warning);
}
