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

// an image reference is '[registry[:port]/]name[:tag][@digest]', so neither ':' nor '@' can be
// looked for from the start of the reference: 'localhost:5000' is a host and a port, and the ':'
// of '@sha256:...' belongs to the digest. both only separate once they come after the last '/'.

// where the digest starts, or -1
function digestIndex(reference: string): number {
  return reference.indexOf('@', reference.lastIndexOf('/') + 1);
}

// where the tag starts, or -1
function tagIndex(reference: string): number {
  const digest = digestIndex(reference);
  const name = digest === -1 ? reference : reference.slice(0, digest);
  return name.indexOf(':', name.lastIndexOf('/') + 1);
}

/**
 * The registry and name of a reference, without its tag and digest.
 */
export function repositoryOf(reference: string): string {
  const tag = tagIndex(reference);
  if (tag !== -1) {
    return reference.slice(0, tag);
  }
  const digest = digestIndex(reference);
  return digest === -1 ? reference : reference.slice(0, digest);
}

/**
 * The tag of a reference, or undefined when it carries none. A reference pinned by digest has no
 * tag to look for, and an empty tag is what a name being typed has right after its ':'.
 */
export function tagOf(reference: string): string | undefined {
  const tag = tagIndex(reference);
  if (tag === -1) {
    return undefined;
  }
  const digest = digestIndex(reference);
  return digest === -1 ? reference.slice(tag + 1) : reference.slice(tag + 1, digest);
}

/**
 * Whether a reference is pinned by digest, which makes a tag lookup pointless.
 */
export function hasDigest(reference: string): boolean {
  return digestIndex(reference) !== -1;
}

/**
 * Whether a name holds a path component that cannot be looked up. An empty, '.' or '..' component
 * is rejected by the engine and cannot be put in a request path either. This is not about the name
 * being a valid reference, which only the engine decides.
 */
export function hasUnresolvableComponent(name: string): boolean {
  return name.split('/').some(component => component === '' || component === '.' || component === '..');
}

/**
 * Whether a name being typed is worth sending to a registry. It is still incomplete, so a trailing
 * '/' only means more is coming and 'quay.io/' is a registry whose images are worth listing.
 */
export function canSearch(value: string): boolean {
  const searched = value.trim();
  const repository = repositoryOf(searched);
  return !hasUnresolvableComponent(searched.endsWith('/') ? repository.slice(0, -1) : repository);
}
