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

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { FeatureRegistry } from '/@/plugin/feature-registry.js';

class TestFeatureRegistry extends FeatureRegistry {
  public override listFeatures(): string[] {
    return super.listFeatures();
  }
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('FeatureRegistry', () => {
  let featureRegistry: TestFeatureRegistry;

  beforeEach(() => {
    featureRegistry = new TestFeatureRegistry();
  });

  test('should list registered features', () => {
    expect(featureRegistry.listFeatures()).toEqual([]);
    const dispose1 = featureRegistry.registerFeatures('extensionId1', ['feature1', 'feature2']);
    const dispose2 = featureRegistry.registerFeatures('extensionId2', ['feature3', 'feature4']);
    expect(featureRegistry.listFeatures()).toEqual(['feature1', 'feature2', 'feature3', 'feature4']);
    dispose1.dispose();
    expect(featureRegistry.listFeatures()).toEqual(['feature3', 'feature4']);
    dispose2.dispose();
    expect(featureRegistry.listFeatures()).toEqual([]);
  });

  test('handler passed to onFeaturesUpdatedis called when features are registered and unregistered', () => {
    const listener: (features: string[]) => void = vi.fn();
    featureRegistry.onFeaturesUpdated(listener);
    expect(listener).not.toHaveBeenCalled();

    const dispose1 = featureRegistry.registerFeatures('extensionId1', ['feature1', 'feature2']);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(['feature1', 'feature2']);

    vi.mocked(listener).mockClear();
    const dispose2 = featureRegistry.registerFeatures('extensionId2', ['feature3', 'feature4']);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(['feature1', 'feature2', 'feature3', 'feature4']);

    vi.mocked(listener).mockClear();
    dispose1.dispose();
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(['feature3', 'feature4']);

    vi.mocked(listener).mockClear();
    dispose2.dispose();
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith([]);
  });
});
