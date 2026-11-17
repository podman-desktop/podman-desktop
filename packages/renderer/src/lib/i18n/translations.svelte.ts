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

/**
 * Active-language translation entries provided by the main process.
 * Keys identify navigation labels, shared settings UI, and configuration fields.
 * Callers retain their original text when an entry is not localized.
 */
let activeTranslations: Record<string, string> = $state({});

let subscribed = false;

/** Subscribes to language updates and fetches the translations of the active language. */
export async function initTranslations(): Promise<void> {
  if (!subscribed) {
    subscribed = true;
    window.events?.receive('i18n-updated', (data: unknown) => {
      activeTranslations = (data as Record<string, string>) ?? {};
    });
  }
  await refreshTranslations();
}

async function refreshTranslations(): Promise<void> {
  try {
    activeTranslations = (await window.i18nGetActiveTranslations()) ?? {};
  } catch (error) {
    console.error('Unable to fetch the active translations', error);
  }
}

/** Returns the translation of the given key, or undefined when the entry is not localized. */
export function t(key: string, parameters?: Record<string, string | number>): string | undefined {
  const translation = activeTranslations[key];
  if (translation === undefined || !parameters) {
    return translation;
  }

  // Replace in one pass so resource names containing placeholders are kept verbatim.
  return translation.replace(/\{(\w+)\}/g, (placeholder: string, name: string) =>
    Object.hasOwn(parameters, name) ? String(parameters[name]) : placeholder,
  );
}
