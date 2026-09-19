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

import { describe, expect, test } from 'vitest';

import { ImageReference } from './image-reference';

const DIGEST = 'sha256:2b9e1b2a1f1c1d1e1f2a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80';

describe('repositoryOf', () => {
  test.each([
    ['nginx', 'nginx'],
    ['nginx:latest', 'nginx'],
    ['nginx:', 'nginx'],
    ['docker.io/library/nginx:latest', 'docker.io/library/nginx'],
    // the ':' of a registry port comes before the last '/', so it separates nothing
    ['localhost:5000/nginx', 'localhost:5000/nginx'],
    ['localhost:5000/nginx:v1', 'localhost:5000/nginx'],
    ['localhost:5000/team/nginx:v1', 'localhost:5000/team/nginx'],
    // the ':' of a digest belongs to it
    [`nginx@${DIGEST}`, 'nginx'],
    [`nginx:latest@${DIGEST}`, 'nginx'],
    [`localhost:5000/nginx@${DIGEST}`, 'localhost:5000/nginx'],
    [`localhost:5000/nginx:v1@${DIGEST}`, 'localhost:5000/nginx'],
  ])('%s is in repository %s', (reference, expected) => {
    expect(ImageReference.repositoryOf(reference)).toBe(expected);
  });
});

describe('tagOf', () => {
  test.each([
    ['nginx', undefined],
    ['nginx:latest', 'latest'],
    // a name is still being typed right after its ':'
    ['nginx:', ''],
    ['localhost:5000/nginx', undefined],
    ['localhost:5000/nginx:v1', 'v1'],
    [`nginx@${DIGEST}`, undefined],
    [`nginx:latest@${DIGEST}`, 'latest'],
    [`localhost:5000/nginx@${DIGEST}`, undefined],
  ])('%s has tag %s', (reference, expected) => {
    expect(ImageReference.tagOf(reference)).toBe(expected);
  });
});

describe('hasDigest', () => {
  test.each([
    ['nginx', false],
    ['nginx:latest', false],
    ['localhost:5000/nginx:v1', false],
    [`nginx@${DIGEST}`, true],
    [`localhost:5000/nginx:v1@${DIGEST}`, true],
  ])('%s pinned by digest: %s', (reference, expected) => {
    expect(ImageReference.hasDigest(reference)).toBe(expected);
  });
});

describe('hasUnresolvableComponent', () => {
  test.each(['.', '..', '/nginx', 'nginx/', 'quay.io//nginx', 'localhost:5000/./nginx', 'localhost:5000/../nginx'])(
    '%s cannot be looked up',
    name => {
      expect(ImageReference.hasUnresolvableComponent(name)).toBe(true);
    },
  );

  test.each(['nginx', 'quay.io/podman/hello', 'localhost:5000/nginx', '...', 'a.b', 'nginx.'])(
    '%s can be looked up',
    name => {
      expect(ImageReference.hasUnresolvableComponent(name)).toBe(false);
    },
  );
});

describe('canSearch', () => {
  test.each(['.', '..', '/nginx', 'quay.io//nginx', 'localhost:5000/./nginx', 'localhost:5000/../nginx', 'nginx/:'])(
    '%s is not worth searching',
    value => {
      expect(ImageReference.canSearch(value)).toBe(false);
    },
  );

  // a trailing '/' only means the name is not finished, and the registry before it is searchable
  test.each(['nginx', 'quay.io/', 'quay.io/podman/hello', 'localhost:5000/nginx:v1', `nginx@${DIGEST}`])(
    '%s is worth searching',
    value => {
      expect(ImageReference.canSearch(value)).toBe(true);
    },
  );
});
