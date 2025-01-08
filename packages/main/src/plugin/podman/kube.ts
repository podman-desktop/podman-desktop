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

/**
 * This function is a re-implementation of the imageNamePrefix on the podman repository
 * https://github.com/containers/podman/blob/de856dab99ef8816392972347678fcb49ae57e50/pkg/domain/infra/abi/play.go#L1606
 * @param content
 */
export function getImageNamePrefix(content: string): string {
  let prefix: string = content;
  let split: string[] = prefix.split(':');
  if (split[0]) {
    prefix = split[0];
  }
  split = prefix.split('/');
  const index = split.length - 1;
  if (split[index]) {
    prefix = split[index];
  }
  split = prefix.split('@');
  if (split[0]) {
    prefix = split[0];
  }
  return prefix;
}
