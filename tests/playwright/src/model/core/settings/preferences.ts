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

enum PreferenceLabels {
  APPEARANCE = 'Appearance',
  FEEDBACK_DIALOG = 'Dialog',
  TOAST = 'Toast',
  ZOOM_LEVEL = 'Zoom Level',
  EXIT_ON_CLOSE = ' Exit On Close',
  LINE_HEIGHT = 'Line Height',
}

export class Preferences {
  static readonly Labels = PreferenceLabels;
  static readonly FEEDBACK_DIALOG_TOGGLE_BUTTON_LABEL = 'Show feedback dialog for experimental features';
  static readonly TOAST_NOTIFICATION_TOGGLE_BUTTON_LABEL = 'Display a notification toast when task is created';
  static readonly EXIT_ON_CLOSE_TOGGLE_BUTTON_LABEL =
    'Quit the app when the close button is clicked instead of minimizing to the tray.';
  static readonly ZOOM_LEVEL_NUMBER_INPUT_LABEL = 'preferences.zoomLevel';
  static readonly TERMINAL_LINE_HEIGHT_INPUT_LABEL = 'terminal.integrated.lineHeight';
}
