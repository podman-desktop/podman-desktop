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

import * as path from 'node:path';

import type * as api from '@desktop-framework/extension-api';

export interface ExtensionModule {
  path: string;
  api: typeof api;
}

export interface NodeInternalModule {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _load: (request: string, parent: { filename: string; path: string }) => any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OverrideFunction = (ext: ExtensionModule) => any;

// check containment on whole path segments, a plain string prefix would match '/ext/ab' against '/ext/a'
// path.relative ignores case on Windows, so the exact-case prefix check keeps '/ext/Foo' and '/ext/foo' apart
function isInsideDirectory(file: string, directory: string): boolean {
  const normalizedFile = path.normalize(file);
  const normalizedDirectory = path.normalize(directory);
  const relative = path.relative(normalizedDirectory, normalizedFile);
  return (
    relative !== '..' &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative) &&
    normalizedFile.startsWith(normalizedDirectory)
  );
}

export class ModuleLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _internalLoad: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _extModuleCache = new Map<string, any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _overrides = new Map<string, object | OverrideFunction>();

  constructor(
    private _module: NodeInternalModule,
    private _analyzedExtensions: Map<string, ExtensionModule>,
  ) {}

  addOverride(lookup: Record<string, object | OverrideFunction>): void {
    Object.keys(lookup).forEach(entry => {
      this._overrides.set(entry, lookup[entry] ?? {});
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overrideRequire(): void {
    if (!this._internalLoad) {
      // save original load method
      this._internalLoad = this._module._load;
      const overrides = this._overrides;
      const internalLoad = this._internalLoad;
      const extModuleCache = this._extModuleCache;
      const analyzedExtensions = this._analyzedExtensions;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._module._load = function load(request: string, parent: any): any {
        const override = overrides.get(request);
        if (override) {
          if (override instanceof Function) {
            const ext = Array.from(analyzedExtensions.values()).find(extension =>
              isInsideDirectory(parent.filename, extension.path),
            );
            if (ext) {
              return override(ext);
            }
            throw Error(`Cannot find extension for ${parent.path}`);
          }
          let cache = extModuleCache.get(parent.path);
          if (!cache) {
            cache = {};
            extModuleCache.set(parent.path, cache);
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cache[request] ??= <any>{ ...override };
          return cache[request];
        }
        // eslint-disable-next-line prefer-rest-params,prefer-spread
        return internalLoad.apply(this, arguments);
      };
    }
  }
}
