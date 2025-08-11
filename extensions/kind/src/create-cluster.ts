/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { loadAllYaml } from '@kubernetes/client-node';
import type { AuditRecord, AuditRequestItems, AuditResult, CancellationToken } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
// @ts-expect-error ignore type error https://github.com/janl/mustache.js/issues/797
import mustache from 'mustache';
import type { Tags } from 'yaml';
import { parseAllDocuments, stringify } from 'yaml';

import ingressManifests from '/@/resources/contour.yaml?raw';

import createClusterConfTemplate from './templates/create-cluster-conf.mustache?raw';
import { getKindPath, getMemTotalInfo } from './util';

export function getKindClusterConfig(
  clusterName: string,
  httpHostPort: number,
  httpsHostPort: number,
  controlPlaneImage?: string,
): string {
  return mustache.render(createClusterConfTemplate, {
    clusterName: clusterName,
    httpHostPort: httpHostPort,
    httpsHostPort: httpsHostPort,
    controlPlaneImage: controlPlaneImage,
  });
}

function convertYamlFrom11to12(manifest: string): string {
  const parsedManifests = parseAllDocuments(manifest, { customTags: getTags });
  const manifests = parsedManifests.map(parsedManifest => stringify(parsedManifest)).join('\n');
  return manifests;
}

function getTags(tags: Tags): Tags {
  for (const tag of tags) {
    if (typeof tag === 'object' && 'tag' in tag) {
      if (tag.tag === 'tag:yaml.org,2002:int') {
        const newTag = { ...tag };
        newTag.test = /^(0[0-7][0-7][0-7])$/;
        newTag.resolve = (str: string): number => parseInt(str, 8);
        tags.unshift(newTag);
        break;
      }
    }
  }
  return tags;
}

export async function setupIngressController(clusterName: string): Promise<void> {
  const manifest = convertYamlFrom11to12(ingressManifests);
  const yml = loadAllYaml(manifest);
  await extensionApi.kubernetes.createResources('kind-' + clusterName, yml);
}

export async function connectionAuditor(provider: string, items: AuditRequestItems): Promise<AuditResult> {
  const records: AuditRecord[] = [];
  const auditResult = {
    records: records,
  };

  const image = items['kind.cluster.creation.controlPlaneImage'];
  if (image && !image.includes('@sha256:')) {
    records.push({
      type: 'warning',
      record: 'It is recommend to include the @sha256:{image digest} for the image used.',
    });
  }

  const configFile = items['kind.cluster.creation.configFile'];
  if (configFile) {
    records.push({
      type: 'warning',
      record:
        'By specifying a config file, all other options will be ignored except for ingress controller deployment.',
    });
  }

  const providerSocket = extensionApi.provider
    .getContainerConnections()
    .find(connection => connection.connection.type === provider);

  if (!providerSocket) return auditResult;

  const memTotal = await getMemTotalInfo(providerSocket.connection.endpoint.socketPath);

  // check if configured memory is less than 6GB
  if (memTotal < 6000000000) {
    records.push({
      type: 'info',
      record: 'It is recommend to install Kind on a virtual machine with at least 6GB of memory.',
    });
  }

  return auditResult;
}

export async function createCluster(
  params: { [key: string]: unknown },
  kindCli: string,
  telemetryLogger: extensionApi.TelemetryLogger,
  logger?: extensionApi.Logger,
  token?: CancellationToken,
): Promise<void> {
  // grab config file
  let configFile;
  if (params['kind.cluster.creation.configFile'] && typeof params['kind.cluster.creation.configFile'] === 'string') {
    configFile = String(params['kind.cluster.creation.configFile']);
  }

  let clusterName = 'kind';
  if (params['kind.cluster.creation.name'] && typeof params['kind.cluster.creation.name'] === 'string') {
    clusterName = String(params['kind.cluster.creation.name']);
  }

  // grab provider
  let provider = 'docker';
  if (params['kind.cluster.creation.provider']) {
    provider = String(params['kind.cluster.creation.provider']);
  }

  const env: { [key: string]: string } = {};
  // add KIND_EXPERIMENTAL_PROVIDER env variable if needed
  if (provider === 'podman') {
    env['KIND_EXPERIMENTAL_PROVIDER'] = 'podman';
  }

  // grab http host port
  let httpHostPort = 9090;
  if (
    params['kind.cluster.creation.http.port'] &&
    ['string', 'number'].includes(typeof params['kind.cluster.creation.http.port'])
  ) {
    httpHostPort = Number(params['kind.cluster.creation.http.port']);
  }

  // grab https host port
  let httpsHostPort = 9443;
  if (
    params['kind.cluster.creation.https.port'] &&
    ['string', 'number'].includes(typeof params['kind.cluster.creation.https.port'])
  ) {
    httpsHostPort = Number(params['kind.cluster.creation.https.port']);
  }

  let ingressController = false;
  // The params['kind.cluster.creation.ingress'] can be only "on" or "undefined"
  if (params['kind.cluster.creation.ingress']) {
    ingressController = Boolean(params['kind.cluster.creation.ingress']);
  }

  // grab custom kind node image if defined
  let controlPlaneImage = undefined;
  if (
    params['kind.cluster.creation.controlPlaneImage'] &&
    typeof params['kind.cluster.creation.controlPlaneImage'] === 'string'
  ) {
    controlPlaneImage = String(params['kind.cluster.creation.controlPlaneImage']);
  }

  // create the config file
  const kindClusterConfig = getKindClusterConfig(clusterName, httpHostPort, httpsHostPort, controlPlaneImage);

  // create a temporary file
  const tmpDirectory = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'kind-cluster-config-'));

  // path to the file inside this directory
  const tmpFilePath = path.join(tmpDirectory, 'kind-cluster-config.yaml');

  // ok we need to write the file
  await fs.promises.writeFile(tmpFilePath, kindClusterConfig, 'utf8');

  // update PATH to include kind
  env.PATH = getKindPath() ?? '';

  const telemetryOptions: Record<string, unknown> = {
    configFile,
    provider,
    httpHostPort,
    httpsHostPort,
    ingressController,
  };

  const kubeConfigPath = extensionApi.kubernetes.getKubeconfig().path;
  const startTime = performance.now();
  try {
    // Add listener for kubeconfig change
    let kubeconfigUpdated = false;
    const disposeOnDidUpdate = extensionApi.kubernetes.onDidUpdateKubeconfig(
      async (_event: extensionApi.KubeconfigUpdateEvent) => {
        kubeconfigUpdated = true;
      },
    );

    // Execute the command to create the cluster
    await extensionApi.process.exec(
      kindCli,
      ['create', 'cluster', '--config', configFile ?? tmpFilePath, '--kubeconfig', kubeConfigPath],
      {
        env,
        logger,
        token,
      },
    );

    // Wait at most 30s for Podman Desktop to recognize the change to kubeconfig
    let timeout = 0;
    while (!kubeconfigUpdated && timeout < 300) {
      await new Promise(f => setTimeout(f, 100));
      timeout++;
    }

    disposeOnDidUpdate.dispose();

    // Create ingress controller resources depending on whether a configFile was provided or not
    if (ingressController && configFile) {
      const configClusterName = await getClusterNameFromConfigFile(configFile);
      logger?.log('Creating ingress controller from config file namespace: ', configClusterName);
      await setupIngressController(configClusterName);
    } else if (ingressController) {
      logger?.log('Creating ingress controller resources on namespace: ', clusterName);
      await setupIngressController(clusterName);
    }
  } catch (error) {
    telemetryOptions.error = error;
    let errorMessage: string = '';

    if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    throw new Error(`Failed to create kind cluster. ${errorMessage}`);
  } finally {
    const endTime = performance.now();
    telemetryOptions.duration = endTime - startTime;
    telemetryLogger.logUsage('createCluster', telemetryOptions);

    // delete temporary directory/file
    await fs.promises.rm(tmpDirectory, { recursive: true });
  }
}

// Function reads a path name, opens the yaml file and returns "name" from the kind configuration file
// if no name is provided, we just use 'kind' which is the default.
async function getClusterNameFromConfigFile(configFilePath: string): Promise<string> {
  const configFile = await fs.promises.readFile(configFilePath, 'utf8');

  // We use parseAllDocument as there may be "multiple" yaml documents in the file,
  // we simply get the first name we find.
  const documents = parseAllDocuments(configFile);
  for (const doc of documents) {
    const config = doc.toJSON();
    if (config && typeof config === 'object' && 'name' in config && typeof config.name === 'string') {
      return config.name;
    }
  }

  // If no name is found, we return the default name
  return 'kind';
}
