/**********************************************************************
 * Copyright (C) 2022 Red Hat, Inc.
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

import type Dockerode from 'dockerode';

// Fields only returned by the Podman libpod API (not by the Docker compatible API)
export interface LibPodImageInspectInfo extends Dockerode.ImageInspectInfo {
  Digest?: string;
  NamesHistory?: string[];
  ManifestType?: string;
  User?: string;
  Version?: string;
  Annotations?: { [key: string]: string };
  History?: {
    created?: string;
    created_by?: string;
    author?: string;
    comment?: string;
    empty_layer?: boolean;
  }[];
}

export interface ImageInspectInfo extends LibPodImageInspectInfo {
  engineId: string;
  engineName: string;
  engineType: 'podman' | 'docker';
}
