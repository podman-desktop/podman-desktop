/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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
type ConfirmationVariant = 'default' | 'delete';

export interface ConfirmationOptions {
  variant?: ConfirmationVariant;
  title?: string;
  buttonLabel?: string;
}

/**
 * Utility method to create a confirmation dialog for a given action.
 * This method follow the common error-first callback style, therefore you
 * can use {@link node:util:promisify} to use it as a promise.
 *
 * @param func the function to call on confirmation or error
 * @param action the action label to use
 * @param options the options to use for the confirmation dialog
 */
export function withConfirmation(
  func: (err?: unknown) => unknown,
  action: string,
  options?: ConfirmationOptions,
): void {
  const isDelete = options?.variant === 'delete';
  const activationButton = isDelete ? 'Delete' : (options?.buttonLabel ?? 'Yes');
  const title = options?.title ?? 'Confirmation';
  window
    .showMessageBox({
      title,
      message: 'Are you sure you want to ' + action + '?',
      buttons: [activationButton, 'Cancel'],
      type: isDelete ? 'danger' : 'question',
    })
    .then(result => {
      if (result?.response === 0) {
        func();
      }
    })
    .catch(func);
}
