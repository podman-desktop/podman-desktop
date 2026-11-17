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

/** Definition of a single UI language. One file per language in ./languages */
export interface LanguageDefinition {
  /** Configuration value stored in preferences.language (BCP 47 language tag, e.g. 'en', 'ja') */
  readonly id: string;
  /** Native-script language name displayed in the language dropdown (e.g. '日本語') */
  readonly label: string;
  /**
   * Translation entries keyed by dot-separated identifiers.
   * Delivered to the renderer for display-time localization with original-text fallback.
   */
  readonly translations: Readonly<Record<string, string>>;
}
