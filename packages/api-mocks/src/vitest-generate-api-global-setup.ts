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

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Mustache from 'mustache';
import typescript from 'typescript';

type Namespaces = { [key: string]: string[] };
type Classes = { [key: string]: string[] };

async function extractNamespacesAndClassesFromAPI(
  filePath: string,
): Promise<{ namespaces: Namespaces; classes: Classes }> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const sourceFile = typescript.createSourceFile(filePath, fileContent, typescript.ScriptTarget.Latest, true);

  const namespaces: Namespaces = {};
  const classes: Classes = {};

  const visit = (node: typescript.Node): void => {
    if (typescript.isModuleDeclaration(node) && node.name.text) {
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
        // Deduplicate to handle function overloads
        namespaces[namespaceName] = Array.from(new Set(functions));
      }
    }

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
        // Deduplicate to handle method overloads
        classes[className] = Array.from(new Set(methods));
      }
    }

    typescript.forEachChild(node, visit);
  };

  visit(sourceFile);
  return { namespaces, classes };
}

function toTemplateData(data: { namespaces: Namespaces; classes: Classes; appName: string }): {
  namespaces: { name: string; functions: string[] }[];
  classes: { name: string; methods: string[] }[];
  appName: string;
} {
  const namespaces = Object.entries(data.namespaces).map(([name, functions]) => ({ name, functions }));
  // EventEmitter is defined explicitly in the template; exclude it from the dynamic classes section
  const classes = Object.entries(data.classes)
    .filter(([name]) => name !== 'EventEmitter')
    .map(([name, methods]) => ({ name, methods }));
  return { namespaces, classes, appName: data.appName };
}

export default async function setup(): Promise<void> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // this file lives in packages/api-mocks/src/
  const packageRoot = path.resolve(__dirname, '..');
  const repoRoot = path.resolve(packageRoot, '..', '..');
  const extensionApiTypePath = path.join(repoRoot, 'packages', 'extension-api', 'src', 'extension-api.d.ts');
  const podmanDesktopApiMocksDir = path.join(packageRoot, 'src', '@podman-desktop');
  const apiGeneratedFile = path.join(podmanDesktopApiMocksDir, 'api.ts');
  const templatePath = path.join(packageRoot, 'src', 'api.mustache');
  const productJsonPath = path.join(repoRoot, 'product.json');

  // skip if api.ts is already newer than all inputs
  const extensionApiPathStats = await fs.stat(extensionApiTypePath);
  const templatePathStats = await fs.stat(templatePath);
  const generatorPathStats = await fs.stat(__filename);
  const productJsonStats = await fs.stat(productJsonPath);
  try {
    const outputStats = await fs.stat(apiGeneratedFile);
    const newestInputMtime = Math.max(
      extensionApiPathStats.mtimeMs,
      templatePathStats.mtimeMs,
      generatorPathStats.mtimeMs,
      productJsonStats.mtimeMs,
    );
    if (outputStats.mtimeMs >= newestInputMtime) {
      console.debug(' 🚀 packages/api-mocks/src/@podman-desktop/api.ts up-to-date; skipping regeneration');
      return;
    }
  } catch {
    console.debug(' ⚙️ packages/api-mocks/src/@podman-desktop/api.ts does not exist yet; generating it now…');
  }
  const productJson = JSON.parse(await fs.readFile(productJsonPath, 'utf-8')) as { name: string };
  const data = await extractNamespacesAndClassesFromAPI(extensionApiTypePath);
  const template = await fs.readFile(templatePath, 'utf-8');
  const content = Mustache.render(template, toTemplateData({ ...data, appName: productJson.name }));

  await fs.mkdir(podmanDesktopApiMocksDir, { recursive: true });
  await fs.writeFile(apiGeneratedFile, content, 'utf-8');
  console.debug(' ✅ packages/api-mocks/src/@podman-desktop/api.ts has been generated.');
}
