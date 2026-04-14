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

import { get } from 'svelte/store';
import { assert, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  onDidChangeRegisteredFeatures,
  registeredFeatures,
  registeredFeaturesEventStore,
  registeredFeaturesEventStoreInfo,
  setupRegisteredFeaturesListener,
} from './registered-features';

const callbacks = new Map<string, (data?: unknown) => void>();
const eventEmitter = {
  receive: (message: string, callback: (data?: unknown) => void): void => {
    callbacks.set(message, callback);
  },
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal('events', { receive: eventEmitter.receive });
});

describe('registeredFeaturesEventStore', () => {
  test('registered features should be updated after fetch', async () => {
    vi.mocked(window.getRegisteredFeatures).mockResolvedValue(['kubernetes-contexts-manager']);
    registeredFeaturesEventStore.setup();

    let features = get(registeredFeatures);
    expect(features).toEqual([]);

    await registeredFeaturesEventStoreInfo.fetch();

    features = get(registeredFeatures);
    expect(features).toEqual(['kubernetes-contexts-manager']);
  });

  test('registered features should be updated when feature-registry:features-updated fires', async () => {
    vi.mocked(window.getRegisteredFeatures).mockResolvedValue(['kubernetes-contexts-manager']);
    registeredFeaturesEventStore.setup();

    await registeredFeaturesEventStoreInfo.fetch();
    expect(get(registeredFeatures)).toEqual(['kubernetes-contexts-manager']);

    vi.mocked(window.getRegisteredFeatures).mockResolvedValue(['kubernetes-contexts-manager', 'another-feature']);

    const updatedCallback = callbacks.get('feature-registry:features-updated');
    assert(updatedCallback);
    updatedCallback();

    await vi.waitFor(() => expect(get(registeredFeatures)).toEqual(['kubernetes-contexts-manager', 'another-feature']));
  });

  test('new subscriber should receive current features after initial fetch', async () => {
    vi.mocked(window.getRegisteredFeatures).mockResolvedValue(['kubernetes-contexts-manager']);
    registeredFeaturesEventStore.setup();
    await registeredFeaturesEventStoreInfo.fetch();

    const features = get(registeredFeatures);
    expect(features).toEqual(['kubernetes-contexts-manager']);
  });
});

describe('onDidChangeRegisteredFeatures', () => {
  beforeEach(() => {
    callbacks.clear();
    setupRegisteredFeaturesListener();
  });

  test('should dispatch with detail=true when a feature is added', () => {
    const listener = vi.fn();
    onDidChangeRegisteredFeatures.addEventListener('kubernetes-contexts-manager', listener);

    const callback = callbacks.get('feature-registry:features-updated');
    assert(callback);
    callback(['kubernetes-contexts-manager', 'another-feature']);

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ detail: true }));

    onDidChangeRegisteredFeatures.removeEventListener('kubernetes-contexts-manager', listener);
  });

  test('should dispatch with detail=false when a feature is removed', () => {
    const listener = vi.fn();
    onDidChangeRegisteredFeatures.addEventListener('kubernetes-contexts-manager', listener);

    const callback = callbacks.get('feature-registry:features-updated');
    assert(callback);

    // first update: feature is added
    callback(['kubernetes-contexts-manager']);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ detail: true }));

    listener.mockClear();

    // second update: feature is removed (extension disabled)
    callback(['another-feature']);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ detail: false }));

    onDidChangeRegisteredFeatures.removeEventListener('kubernetes-contexts-manager', listener);
  });

  test('should not dispatch when feature list has not changed', () => {
    const listener = vi.fn();
    onDidChangeRegisteredFeatures.addEventListener('kubernetes-contexts-manager', listener);

    const callback = callbacks.get('feature-registry:features-updated');
    assert(callback);

    callback(['kubernetes-contexts-manager']);
    listener.mockClear();

    // same list again — no change
    callback(['kubernetes-contexts-manager']);
    expect(listener).not.toHaveBeenCalled();

    onDidChangeRegisteredFeatures.removeEventListener('kubernetes-contexts-manager', listener);
  });

  test('should not dispatch for features not listened to', () => {
    const listener = vi.fn();
    onDidChangeRegisteredFeatures.addEventListener('kubernetes-contexts-manager', listener);

    const callback = callbacks.get('feature-registry:features-updated');
    assert(callback);
    callback(['another-feature']);

    expect(listener).not.toHaveBeenCalled();

    onDidChangeRegisteredFeatures.removeEventListener('kubernetes-contexts-manager', listener);
  });
});
