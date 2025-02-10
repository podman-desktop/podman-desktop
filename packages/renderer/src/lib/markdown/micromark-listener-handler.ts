/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import { executeButtonCommand } from './component/micromark-button';
import { executeExpandableToggle } from './component/micromark-expandable-section';

export function createListener(
  inProgressMarkdownCommandExecutionCallback: (
    command: string,
    state: 'starting' | 'failed' | 'successful',
    value?: unknown,
  ) => void,
) {
  return (e: unknown): void => {
    const eventObject: { target?: object } = {};

    if (e && typeof e === 'object' && 'target' in e && e.target && typeof e.target === 'object') {
      eventObject.target = e.target;
    }

    // Retrieve the command and expandable within the dataset
    let command: string | undefined;
    let expandable: string | undefined;

    if (
      eventObject.target &&
      'dataset' in eventObject.target &&
      eventObject.target.dataset &&
      typeof eventObject.target.dataset === 'object'
    ) {
      if ('command' in eventObject.target.dataset && typeof eventObject.target.dataset.command === 'string') {
        command = eventObject.target.dataset.command;
      }
      if ('expandable' in eventObject.target.dataset && typeof eventObject.target.dataset.expandable === 'string') {
        expandable = eventObject.target.dataset.expandable;
      }
    }

    // if the user click on a a href link containing data-pd-jump-in-page attribute
    if (eventObject.target instanceof HTMLAnchorElement) {
      // get a matching attribute ?
      const hrefId = eventObject.target.getAttribute('data-pd-jump-in-page');

      // get a linked ID
      if (hrefId) {
        const matchingElement = document.getElementById(hrefId);
        if (matchingElement) {
          matchingElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });

          return;
        }
      }
    }

    // if the user clicked on the toggle of an expandable section
    if (expandable) {
      executeExpandableToggle(expandable);
      return;
    }

    // if the user clicked on a button (new way)
    if (!command && eventObject.target instanceof HTMLButtonElement) {
      const targetId = eventObject.target.id;
      executeButtonCommand(targetId).catch((err: unknown) => console.error(`Error executing command ${targetId}`, err));
      return;
    }

    // Only check if the command exists and the target is not disabled
    if (command && eventObject.target && 'disabled' in eventObject.target && !eventObject.target.disabled) {
      // If the target is an instance of a button element, we know that we are going to execute either
      // a command or hyperlink
      if (eventObject.target instanceof HTMLButtonElement) {
        const targetButton = eventObject.target as HTMLButtonElement;
        // If the command exists and the button is not disabled, we execute the command
        // we'll also be updating the inProgressMarkdownCommandExecutionCallback so we have
        // real-time updates on the button
        inProgressMarkdownCommandExecutionCallback(command, 'starting');
        targetButton.disabled = true;
        if (targetButton.firstChild && targetButton.firstChild instanceof HTMLElement) {
          targetButton.firstChild.style.display = 'inline-block';
        }
        window
          .executeCommand(command)
          .then(value => inProgressMarkdownCommandExecutionCallback(command, 'successful', value))
          .catch((reason: unknown) => inProgressMarkdownCommandExecutionCallback(command, 'failed', reason))
          .finally(() => {
            targetButton.disabled = false;
            if (targetButton.firstChild && targetButton.firstChild instanceof HTMLElement) {
              targetButton.firstChild.style.display = 'none';
            }
          });
      } else if (eventObject.target instanceof HTMLAnchorElement) {
        // Execute the command since it's a simple "link" to it
        // usually associated with a dialog / quickpick action.
        window.executeCommand(command).catch((reason: unknown) => console.error(String(reason)));
      }
    }
  };
}
