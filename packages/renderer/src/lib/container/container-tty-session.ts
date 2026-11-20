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

import type { IDisposable, Terminal } from '@xterm/xterm';
import { writable } from 'svelte/store';

interface Attachment {
  active: boolean;
}

export class ContainerTtySession {
  readonly status = writable<'connecting' | 'connected' | 'disconnected'>('connecting');
  #terminal: Terminal | undefined;
  #engineId: string | undefined;
  #containerId: string | undefined;
  #state: string | undefined;
  #input: IDisposable | undefined;
  #attachment: Attachment | undefined;
  #callbackId: number | undefined;
  #retryTimer: number | undefined;
  #connectedAt: number | undefined;
  #failures = 0;
  #pendingInput: string[] = [];

  update(terminal: Terminal | undefined, engineId: string, containerId: string, state: string): void {
    const changed = terminal !== this.#terminal || engineId !== this.#engineId || containerId !== this.#containerId;
    // Unpause uses STARTING without replacing the paused process or its attachment.
    if (!changed && this.#state === 'PAUSED' && state === 'STARTING') state = 'PAUSED';
    const wasRunning = this.#state === 'RUNNING';
    this.#state = state;
    if (changed || (state !== 'RUNNING' && state !== 'PAUSED')) {
      this.dispose();
      this.#terminal = terminal;
      this.#engineId = engineId;
      this.#containerId = containerId;
    }
    if (!terminal || state !== 'RUNNING') {
      window.clearTimeout(this.#retryTimer);
      this.#retryTimer = undefined;
      return;
    }
    if (!wasRunning) this.#failures = 0;
    this.#input ??= terminal.onData(data => {
      if (this.#state !== 'RUNNING' || this.#failures >= 5) return;
      this.#pendingInput.push(data);
      this.flushInput();
    });
    if (!this.#attachment && this.#retryTimer === undefined && this.#failures < 5) this.attach();
    this.flushInput();
  }

  private flushInput(): void {
    if (this.#callbackId === undefined || this.#state !== 'RUNNING' || this.#pendingInput.length === 0) return;
    const attachment = this.#attachment;
    const data = this.#pendingInput.join('');
    this.#pendingInput = [];
    window.attachContainerSend(this.#callbackId, data).catch(() => {
      if (attachment) this.retry(attachment);
    });
  }

  private attach(): void {
    const terminal = this.#terminal;
    if (!terminal || this.#engineId === undefined || this.#containerId === undefined) return;
    const attachment: Attachment = { active: true };
    this.#attachment = attachment;
    window
      .attachContainer(
        this.#engineId,
        this.#containerId,
        data => {
          if (attachment.active) terminal.write(data.toString());
        },
        () => this.retry(attachment),
        () => this.retry(attachment),
      )
      .then(id => {
        if (!attachment.active) return;
        this.#callbackId = id;
        this.#connectedAt = Date.now();
        this.status.set('connected');
        this.flushInput();
      })
      .catch(() => this.retry(attachment));
  }

  private retry(attachment: Attachment): void {
    if (!attachment.active) return;
    attachment.active = false;
    this.#attachment = undefined;
    this.#callbackId = undefined;
    // A successful handshake alone does not mean the stream recovered.
    if (this.#connectedAt !== undefined && Date.now() - this.#connectedAt >= 10000) this.#failures = 0;
    this.#connectedAt = undefined;
    this.#failures++;
    if (this.#state !== 'RUNNING') return;
    if (this.#failures >= 5) {
      this.#pendingInput = [];
      this.status.set('disconnected');
      return;
    }
    this.status.set('connecting');
    // Keep the terminal visible during a bounded reconnect, with delays of 2, 4, 8 and 8 seconds.
    this.#retryTimer = window.setTimeout(
      () => {
        this.#retryTimer = undefined;
        this.attach();
      },
      Math.min(2000 * 2 ** (this.#failures - 1), 8000),
    );
  }

  dispose(): void {
    if (this.#attachment) this.#attachment.active = false;
    this.#attachment = undefined;
    this.#callbackId = undefined;
    this.#connectedAt = undefined;
    window.clearTimeout(this.#retryTimer);
    this.#retryTimer = undefined;
    this.#input?.dispose();
    this.#input = undefined;
    this.#failures = 0;
    this.#pendingInput = [];
  }
}
