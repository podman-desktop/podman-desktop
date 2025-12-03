/**********************************************************************
 * Copyright (C) 2022-2025 Red Hat, Inc.
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

import path from 'node:path';

import typescript from 'typescript';
import { beforeEach, vi } from 'vitest';

// use importActual to get non-mocked fs/promises (as in some tests node:fs is mocked and then we would not be able to read the API file)
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const nonMockedFsPromises = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');

/**
 * Mock the extension API for vitest.
 * This file is referenced from vitest.config.js file.
 */

// Extract namespaces and their functions from extension-api.d.ts
async function extractNamespacesAndClassesFromAPI(
  filePath: string,
): Promise<{ namespaces: { [key: string]: string[] }; classes: { [key: string]: string[] } }> {
  const fileContent = await nonMockedFsPromises.readFile(filePath, 'utf-8');
  const sourceFile = typescript.createSourceFile(filePath, fileContent, typescript.ScriptTarget.Latest, true);

  const namespaces: { [key: string]: string[] } = {};
  const classes: { [key: string]: string[] } = {};

  const visit = (node: typescript.Node): void => {
    // Extract namespace functions
    if (typescript.isModuleDeclaration(node) && node.name.text) {
      // skip @podman-desktop/api declaration
      if (node.name.text === '@podman-desktop/api') {
        typescript.forEachChild(node, visit);
        return;
      }

      const namespaceName = node.name.text;
      const functions: string[] = [];

      if (node.body && typescript.isModuleBlock(node.body)) {
        for (const statement of node.body.statements) {
          if (typescript.isFunctionDeclaration(statement) && statement.name) {
            functions.push(statement.name.text);
          } else if (typescript.isVariableStatement(statement)) {
            for (const declaration of statement.declarationList.declarations) {
              if (typescript.isIdentifier(declaration.name)) {
                functions.push(declaration.name.text);
              }
            }
          }
        }
      }

      if (functions.length > 0) {
        namespaces[namespaceName] = functions;
      }
    }

    // Extract exported classes and their methods
    if (typescript.isClassDeclaration(node) && node.name) {
      const modifiers = typescript.getModifiers(node);
      const isExported = modifiers?.some(m => m.kind === typescript.SyntaxKind.ExportKeyword);
      if (isExported) {
        const className = node.name.text;
        const methods: string[] = [];

        for (const member of node.members) {
          if (typescript.isMethodDeclaration(member) && member.name && typescript.isIdentifier(member.name)) {
            methods.push(member.name.text);
          }
        }

        classes[className] = methods;
      }
    }
    typescript.forEachChild(node, visit);
  };

  visit(sourceFile);

  return { namespaces, classes };
}

// Generate mocks from the API definition
const apiPath = path.resolve(__dirname, '../../packages/extension-api/src/extension-api.d.ts');
const { namespaces, classes } = await extractNamespacesAndClassesFromAPI(apiPath);

// Create namespace mocks dynamically
// For each function of a namespace, use vi.fn()
const namespaceMocks: { [key: string]: Record<string, unknown> } = {};
for (const [namespaceName, functions] of Object.entries(namespaces)) {
  namespaceMocks[namespaceName] = {};
  for (const functionName of functions) {
    namespaceMocks[namespaceName][functionName] = vi.fn();
  }
}

// Create class mocks dynamically. For each method of a class, use vi.fn()
const classesMocks: { [key: string]: unknown } = {};
for (const [className, methods] of Object.entries(classes)) {
  const instance: { [key: string]: unknown } = {};
  for (const methodName of methods) {
    instance[methodName] = vi.fn();
  }
  classesMocks[className] = instance;
}

// Simple EventEmitter that allows to register listeners and fire events
const eventEmitterListeners: Array<(data: unknown) => unknown> = [];
// reset listeners before each test
beforeEach(() => {
  eventEmitterListeners.length = 0;
});
class EventEmitter {
  event(callback: (e: unknown) => unknown): void {
    eventEmitterListeners.push(callback);
  }

  fire(data: unknown): void {
    for (const listener of eventEmitterListeners) {
      listener(data);
    }
  }

  dispose(): void {}
}
EventEmitter.prototype.dispose = vi.fn();

// override env values rather than use vi.fn()
namespaceMocks.env.isWindows = false;
namespaceMocks.env.isMac = false;
namespaceMocks.env.isLinux = false;

// Merge with existing manually defined mocks
const extensionAPI = {
  ...namespaceMocks,
  ...classesMocks,

  EventEmitter,

  // override some enums/constants
  ProgressLocation: {
    APP_ICON: 1,
    TASK_WIDGET: 2,
  },

  StatusBarAlignLeft: 'LEFT',
  StatusBarAlignRight: 'RIGHT',
  StatusBarItemDefaultPriority: 0,

  InputBoxValidationSeverity: {
    Info: 1,
    Warning: 2,
    Error: 3,
  },

  QuickPickItemKind: {
    Separator: -1,
    Default: 0,
  },
};

// export the extension api
module.exports = extensionAPI;
