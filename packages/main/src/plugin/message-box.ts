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
import type { ButtonsType, DropdownType, MessageBoxOptions, MessageBoxReturnValue } from '@podman-desktop/core-api';
import { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import { inject, injectable } from 'inversify';

type DialogType = 'none' | 'info' | 'error' | 'question' | 'warning';

@injectable()
export class MessageBox {
  private callbackId = 0;

  private callbacksMessageBox = new Map<number, PromiseWithResolvers<MessageBoxReturnValue>>();

  constructor(@inject(ApiSenderType) private apiSender: ApiSenderType) {}

  async showMessageBox(options: MessageBoxOptions): Promise<MessageBoxReturnValue> {
    // keep track of this request
    this.callbackId++;

    // create a promise that will be resolved when the frontend sends the result
    const deferred = Promise.withResolvers<MessageBoxReturnValue>();

    // store the callback that will resolve the promise
    this.callbacksMessageBox.set(this.callbackId, deferred);

    const data = {
      id: this.callbackId,
      title: options.title,
      message: options.message,
      detail: options.detail,
      buttons: options.buttons,
      type: options.type,
      defaultId: options.defaultId,
      cancelId: options.cancelId,
      footerMarkdownDescription: options.footerMarkdownDescription,
    };

    // need to send the options to the frontend
    this.apiSender.send('showMessageBox:open', data);

    // return the promise
    return deferred.promise;
  }

  isDropdownType(response?: ButtonsType): response is DropdownType {
    return (
      typeof response === 'object' &&
      response !== null &&
      'heading' in response &&
      'buttons' in response &&
      Array.isArray((response as DropdownType).buttons)
    );
  }

  async showDialog(
    type: DialogType,
    title: string,
    message: string,
    items: ButtonsType[],
  ): Promise<string | undefined> {
    const result = await this.showMessageBox({
      title: title,
      message: message,
      buttons: items,
      type: type,
    });

    if (result.response !== undefined && result.response >= 0) {
      const response = items[result.response];
      if (result.dropdownIndex !== undefined && result.dropdownIndex >= 0) {
        if (this.isDropdownType(response)) return response.buttons[result.dropdownIndex];
      }
      if (typeof response === 'string') return response;
    }

    return undefined;
  }

  // this method is called by the frontend when the user selected a button
  async onDidSelectButton(id: number, selectedIndex?: number, dropdownIndex?: number): Promise<void> {
    // get the callback
    const callback = this.callbacksMessageBox.get(id);

    // if there is a callback
    if (callback) {
      // grab item
      const val: MessageBoxReturnValue = {
        response: selectedIndex,
        dropdownIndex: dropdownIndex,
      };
      // resolve the promise
      callback.resolve(val);
    }

    // remove the callback
    this.callbacksMessageBox.delete(id);
  }
}
