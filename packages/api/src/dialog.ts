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

export interface IconButtonType {
  label: string;
  icon: string;
}

export interface DropdownType {
  heading: string;
  buttons: string[];
}

export type ButtonsType = string | DropdownType | IconButtonType;

/**
 * Options to configure the behavior of the message box UI.
 */
export interface MessageBoxOptions {
  /**
   * The title of the message box.
   */
  title: string;
  /**
   * The primary message.
   */
  message: string;
  /**
   * An additional (optional) detailed message.
   */
  detail?: string;
  /**
   * Text for buttons.
   */
  buttons?: ButtonsType[];
  /**
   * The (optional) type, one of 'none' | 'info' | 'error' | 'question' | 'warning'.
   */
  type?: string;
  /**
   * The (optional) index of the default button.
   */
  defaultId?: number;
  /**
   * The (optional) index of the button to be used to cancel the dialog.
   */
  cancelId?: number;
  /**
   * An additional (optional) markdown detailed message aligned to center
   */
  footerMarkdownDescription?: string;
}

export interface MessageBoxReturnValue {
  response: number | undefined;
  dropdownIndex?: number;
}
