/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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
 * It allows to create a spinner to be associated to another object ('owner') so the spinner state is changed based on its owner behavior
 * E.g if a button (owner) is clicked and the action start executing we can enabled the spinner
 */
import { type MicromarkSpinner } from '/@/lib/markdown/micromark-utils';

let spinnerCount = 0;
const spinners = new Map<string, MicromarkSpinner>();

/**
 * it creates a new spinner id, associate the command to it and returns the spinner icon
 * @param ownerId id of the element which the spinner belong to
 * @returns spinner icon
 */
export function createSpinner(ownerId: string): string {
  // create new id
  const spinnerId = newSpinnerId();
  // generate new spinner icon
  const icon = generateSpinnerIcon(spinnerId);
  // save spinner and associate it to the owner element
  // e.g a button, when this will be clicked, by using its id we can retrieve the spinner and toggle its state
  spinners.set(ownerId, {
    id: spinnerId,
    icon,
    enabled: false,
  });
  return icon;
}

/**
 * generate the new spinner id
 * @returns spinner id
 */
function newSpinnerId(): string {
  // update spinner number and create a new id
  ++spinnerCount;
  return `micromark-spinner-${spinnerCount}`;
}

/**
 * make the spinner visible
 * @param ownerId id of the element which the spinner belong to
 */
export function enableSpinner(ownerId: string): void {
  toggleElementSpinner(ownerId, true);
}

/**
 * hide the spinner
 * @param ownerId id of the element which the spinner belong to
 */
export function disableSpinner(ownerId: string): void {
  toggleElementSpinner(ownerId, false);
}

/**
 * it changes the visibility of the spinner based on its owner id
 * @param ownerId id of the element which the spinner belong to
 * @param enabled if must be visible
 */
function toggleElementSpinner(ownerId: string, enabled: boolean): void {
  const spinner = spinners.get(ownerId);
  if (spinner) {
    const spinnerElement = document.getElementById(spinner.id);
    if (spinnerElement) {
      spinnerElement.style.display = enabled ? 'inline-block' : 'none';
    }
    spinner.enabled = !spinner.enabled;
  }
}

/**
 * generate a new spinner icon with a custom id
 * @param id id of the new spinner
 * @returns the spinner icon
 */
function generateSpinnerIcon(id: string): string {
  return `
        <i id='${id}' class='flex justify-center items-center mr-2' style='display: none;'>
            <svg width='1em' height='1em' viewBox='0 0 64 64' aria-hidden='true'>
            <g>
                <line x1='32' y1='4' x2='32' y2='16' transform='rotate(0, 32, 32)' stroke='currentColor' stroke-width='8' stroke-linecap='round' opacity='0.4' />
                <line x1='32' y1='4' x2='32' y2='16' transform='rotate(45, 32, 32)' stroke='currentColor' stroke-width='8' stroke-linecap='round' opacity='0.08' />
                <line x1='32' y1='4' x2='32' y2='16' transform='rotate(90, 32, 32)' stroke='currentColor' stroke-width='8' stroke-linecap='round' opacity='0.16' />
                <line x1='32' y1='4' x2='32' y2='16' transform='rotate(135, 32, 32)' stroke='currentColor' stroke-width='8' stroke-linecap='round' opacity='0.24' />
                <line x1='32' y1='4' x2='32' y2='16' transform='rotate(180, 32, 32)' stroke='currentColor' stroke-width='8' stroke-linecap='round' opacity='0.32' />
                <line x1='32' y1='4' x2='32' y2='16' transform='rotate(225, 32, 32)' stroke='currentColor' stroke-width='8' stroke-linecap='round' opacity='0.36' />
                <line x1='32' y1='4' x2='32' y2='16' transform='rotate(270, 32, 32)' stroke='currentColor' stroke-width='8' stroke-linecap='round' opacity='0.4' />
                <line x1='32' y1='4' x2='32' y2='16' transform='rotate(315, 32, 32)' stroke='currentColor' stroke-width='8' stroke-linecap='round' opacity='0.4' />
                <animateTransform
                attributeName='transform'
                type='rotate'
                calcMode='discrete'
                values='0 32 32;45 32 32;90 32 32;135 32 32;180 32 32;225 32 32;270 32 32;315 32 32'
                keyTimes='0;0.125;0.25;0.375;0.5;0.625;0.75;0.875'
                dur='720ms'
                repeatCount='indefinite' />
            </g>
            </svg>
        </i>`;
}
