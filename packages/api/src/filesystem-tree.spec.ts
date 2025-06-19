/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { expect, test } from 'vitest';

import { FilesystemTree } from './filesystem-tree.js';

interface Typ {
  path: string;
}

test('add paths to filetree', () => {
  const tree = new FilesystemTree<Typ>('tree1')
    .addPath('A', { path: 'A-path' }, 5, false)
    .addPath('a/', { path: 'a/-path' }, 0, false)
    .addPath('a/b/c/d.txt', { path: 'a/b/c/d.txt-path' }, 3, false)
    .addPath('a/b/c/e.txt', { path: 'a/b/c/e.txt-path' }, 4, false);

  const copy = tree.copy();

  for (const t of [tree, copy]) {
    expect(t.size).toBe(12);
    expect(t.root.children).toHaveLength(2);
    expect(t.root.children.get('A')!.children).toHaveLength(0);
    expect(t.root.children.get('A')!.data!.path).toBe('A-path');
    expect(t.root.children.get('A')!.size).toBe(5);

    expect(t.root.children.get('a')!.children).toHaveLength(1);
    expect(t.root.children.get('a')!.data!.path).toBe('a/-path');
    expect(t.root.children.get('a')!.size).toBe(7);

    expect(t.root.children.get('a')!.children.get('b')!.children).toHaveLength(1);
    expect(t.root.children.get('a')!.children.get('b')!.data).toBeUndefined();
    expect(t.root.children.get('a')!.children.get('b')!.size).toBe(7);

    expect(t.root.children.get('a')!.children.get('b')!.children.get('c')!.children).toHaveLength(2);
    expect(t.root.children.get('a')!.children.get('b')!.children.get('c')!.data).toBeUndefined();
    expect(t.root.children.get('a')!.children.get('b')!.children.get('c')!.size).toBe(7);

    expect(
      t.root.children.get('a')!.children.get('b')!.children.get('c')!.children.get('d.txt')!.children,
    ).toHaveLength(0);
    expect(t.root.children.get('a')!.children.get('b')!.children.get('c')!.children.get('d.txt')!.data!.path).toBe(
      'a/b/c/d.txt-path',
    );
    expect(t.root.children.get('a')!.children.get('b')!.children.get('c')!.children.get('d.txt')!.size).toBe(3);

    expect(
      t.root.children.get('a')!.children.get('b')!.children.get('c')!.children.get('e.txt')!.children,
    ).toHaveLength(0);
    expect(t.root.children.get('a')!.children.get('b')!.children.get('c')!.children.get('e.txt')!.data!.path).toBe(
      'a/b/c/e.txt-path',
    );
    expect(t.root.children.get('a')!.children.get('b')!.children.get('c')!.children.get('e.txt')!.size).toBe(4);
  }
});

test('currentSize with existing file', () => {
  const tree = new FilesystemTree<Typ>('tree1').addPath('A/B/C.txt', { path: 'A/B/C.txt' }, 5, false);
  const current = tree.currentSize('A/B/C.txt');
  expect(current).toBe(5);
});

test('currentSize with non existing file', () => {
  const tree = new FilesystemTree<Typ>('tree1').addPath('A/B/C.txt', { path: 'A/B/C.txt' }, 5, false);
  const current = tree.currentSize('A/B/C.log');
  expect(current).toBe(undefined);
});

test('add an existing file', () => {
  const tree = new FilesystemTree<Typ>('tree1')
    .addPath('A/B/C.txt', { path: 'A/B/C.txt ' }, 5, false)
    .addPath('A/B/C.txt', { path: 'A/B/C.txt ' }, 4, false);
  expect(tree.size).toBe(4);
  expect(tree.root.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children.get('B')!.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('C.txt')!.children).toHaveLength(0);
});

test('add an existing directory containing files', () => {
  const tree = new FilesystemTree<Typ>('tree1')
    .addPath('A/B/C.txt', { path: 'A/B/C.txt ' }, 5, false)
    .addPath('A/B/D.txt', { path: 'A/B/D.txt ' }, 4, false)
    .addPath('A/B', { path: 'A/B ' }, 0, false)
    .addPath('A/B/E.txt', { path: 'A/B/E.txt ' }, 1, false);
  expect(tree.size).toBe(10);
  expect(tree.addedCount).toBe(3);
  expect(tree.modifiedCount).toBe(1); // A/B
  expect(tree.removedCount).toBe(0);
  expect(tree.addedSize).toBe(10);
  expect(tree.modifiedSize).toBe(0);
  expect(tree.removedSize).toBe(0);
});

test('remove a non existing file', () => {
  const tree = new FilesystemTree<Typ>('tree1')
    .addPath('A/B/C.txt', { path: 'A/B/C.txt' }, 5, false)
    .hidePath('A/B/D.txt');
  expect(tree.size).toBe(5);
  expect(tree.root.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children.get('B')!.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('C.txt')!.children).toHaveLength(0);
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('C.txt')!.hidden).toBeFalsy();
  expect(tree.addedCount).toBe(1);
  expect(tree.modifiedCount).toBe(0);
  expect(tree.removedCount).toBe(0);
  expect(tree.addedSize).toBe(5);
  expect(tree.modifiedSize).toBe(0);
  expect(tree.removedSize).toBe(0);
});

test('remove an existing file', () => {
  const tree = new FilesystemTree<Typ>('tree1')
    .addPath('A/B/C.txt', { path: 'A/B/C.txt' }, 5, false)
    .hidePath('A/B/C.txt');
  expect(tree.size).toBe(0);
  expect(tree.root.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children.get('B')!.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('C.txt')!.children).toHaveLength(0);
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('C.txt')!.hidden).toBeTruthy();
  expect(tree.addedCount).toBe(1);
  expect(tree.modifiedCount).toBe(0);
  expect(tree.removedCount).toBe(1);
  expect(tree.addedSize).toBe(5);
  expect(tree.modifiedSize).toBe(0);
  expect(tree.removedSize).toBe(-5);
});

test('add a whiteout', () => {
  const tree = new FilesystemTree<Typ>('tree1').addWhiteout('A/B/C.txt');
  expect(tree.size).toBe(0);
  expect(tree.root.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children.get('B')!.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('C.txt')!.children).toHaveLength(0);
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('C.txt')!.hidden).toBeTruthy();
  expect(tree.addedCount).toBe(0);
  expect(tree.modifiedCount).toBe(0);
  expect(tree.removedCount).toBe(0);
  expect(tree.addedSize).toBe(0);
  expect(tree.modifiedSize).toBe(0);
  expect(tree.removedSize).toBe(0);
});

test('hide content of non-existing directory', () => {
  const tree = new FilesystemTree<Typ>('tree1')
    .addPath('A/B/C.txt', { path: 'A/B/C.txt' }, 1, false)
    .addPath('A/B/D.txt', { path: 'A/B/D.txt' }, 2, false)
    .hideDirectoryContent('A/E');
  expect(tree.size).toBe(3);
  expect(tree.root.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children.get('B')!.children).toHaveLength(2);
  expect(tree.root.children.get('A')!.children.get('B')!.hidden).toBeFalsy();
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('C.txt')!.children).toHaveLength(0);
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('C.txt')!.hidden).toBeFalsy();
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('D.txt')!.children).toHaveLength(0);
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('D.txt')!.hidden).toBeFalsy();
});

test('hide directory content', () => {
  const tree = new FilesystemTree<Typ>('tree1')
    .addPath('A/B/C.txt', { path: 'A/B/C.txt' }, 1, false)
    .addPath('A/B/D.txt', { path: 'A/B/D.txt' }, 2, false)
    .hideDirectoryContent('A');
  expect(tree.size).toBe(0);
  expect(tree.root.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children).toHaveLength(1);
  expect(tree.root.children.get('A')!.children.get('B')!.children).toHaveLength(2);
  expect(tree.root.children.get('A')!.children.get('B')!.hidden).toBeTruthy();
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('C.txt')!.children).toHaveLength(0);
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('C.txt')!.hidden).toBeTruthy();
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('D.txt')!.children).toHaveLength(0);
  expect(tree.root.children.get('A')!.children.get('B')!.children.get('D.txt')!.hidden).toBeTruthy();
});

test('isDirectory with children', () => {
  const tree = new FilesystemTree<Typ>('tree1').addPath('A/B/C.txt', { path: 'A/B/C.txt' }, 5, false);
  expect(tree.isDirectory('/A/B')).toBeTruthy();
  expect(tree.isDirectory('/A/C')).toBeFalsy();
  expect(tree.isDirectory('/A/B/C.txt')).toBeFalsy();
  expect(tree.isDirectory('/A/B/D.txt')).toBeFalsy();
});

test('isDirectory without children', () => {
  const tree1 = new FilesystemTree<Typ>('tree1').addPath('A/B', { path: 'A/B' }, 0, true);
  expect(tree1.isDirectory('/A/B')).toBeTruthy();
  const tree2 = new FilesystemTree<Typ>('tree1').addPath('A/B', { path: 'A/B' }, 0, false);
  expect(tree2.isDirectory('/A/B')).toBeFalsy();
});
