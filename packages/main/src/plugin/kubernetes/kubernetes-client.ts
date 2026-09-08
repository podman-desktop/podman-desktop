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

import * as fs from 'node:fs';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

import type {
  Cluster,
  Context,
  KubernetesObject,
  User,
  V1APIGroup,
  V1APIResource,
  V1ConfigMap,
  V1Deployment,
  V1Ingress,
  V1NamespaceList,
  V1ObjectMeta,
  V1Pod,
  V1PodList,
  V1Service,
  V1Status,
} from '@kubernetes/client-node';
import {
  ApiException,
  ApisApi,
  AppsV1Api,
  CoreV1Api,
  CustomObjectsApi,
  Health,
  KubeConfig,
  KubernetesObjectApi,
  NetworkingV1Api,
  Watch,
} from '@kubernetes/client-node';
import type * as containerDesktopAPI from '@podman-desktop/api';
import type {
  ContextGeneralState,
  ContextHealth,
  ContextPermission,
  ForwardConfig,
  KubeContext,
  KubernetesContextResources,
  KubernetesTroubleshootingInformation,
  ResourceCount,
  ResourceName,
  V1Route,
} from '@podman-desktop/core-api';
import { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import { type IConfigurationNode, IConfigurationRegistry } from '@podman-desktop/core-api/configuration';
import { inject, injectable } from 'inversify';
import * as jsYaml from 'js-yaml';
import type { Tags } from 'yaml';
import { parseAllDocuments } from 'yaml';

import { Emitter } from '/@/plugin/events/emitter.js';
import { ExperimentalConfigurationManager } from '/@/plugin/experimental-configuration-manager.js';
import { FeatureRegistry } from '/@/plugin/feature-registry.js';
import { FilesystemMonitoring } from '/@/plugin/filesystem-monitoring.js';
import type { KubernetesPortForwardService } from '/@/plugin/kubernetes/kubernetes-port-forward-service.js';
import { KubernetesPortForwardServiceProvider } from '/@/plugin/kubernetes/kubernetes-port-forward-service.js';
import { Telemetry } from '/@/plugin/telemetry/telemetry.js';
import { Uri } from '/@/plugin/types/uri.js';

import { ContextsManager } from './contexts-manager.js';
import { ContextsManagerExperimental } from './contexts-manager-experimental.js';
import { ContextsStatesDispatcher } from './contexts-states-dispatcher.js';

interface ContextsManagerInterface {
  // indicate to the manager that the kubeconfig has changed
  update(kubeconfig: KubeConfig): Promise<void>;
  // get the general state of contexts
  getContextsGeneralState(): Map<string, ContextGeneralState>;
  // get the general state of the current context
  getCurrentContextGeneralState(): ContextGeneralState;
  // register for `resource` state in current context
  registerGetCurrentContextResources(resourceName: ResourceName): KubernetesObject[];
  // unregister from `resource` state in current context
  unregisterGetCurrentContextResources(resourceName: ResourceName): KubernetesObject[];
  // dispose resources created by the manager
  dispose(): void;
  // force the manager to refresh the state for the given context
  refreshContextState(contextName: string): Promise<void>;
}

interface V1ObjectMetaWithName extends V1ObjectMeta {
  name: string;
}

function isV1ObjectMetaWithName(m: unknown): m is V1ObjectMetaWithName {
  return !!m && typeof m === 'object' && 'name' in m;
}

interface KubernetesObjectWithKindAndName extends KubernetesObject {
  kind: string;
  metadata: V1ObjectMetaWithName;
  status?: V1Status;
}

function isKubernetesObjectWithKindAndName(o: unknown): o is KubernetesObjectWithKindAndName {
  return !!o && typeof o === 'object' && 'kind' in o && 'metadata' in o && isV1ObjectMetaWithName(o['metadata']);
}

const OPENSHIFT_PROJECT_API_GROUP = 'project.openshift.io';

const DEFAULT_NAMESPACE = 'default';

const FIELD_MANAGER = 'podman-desktop';

const CHECK_CONNECTION_TIMEOUT_MS = 1_000;

function sanitizeMetadata(spec: KubernetesObjectWithKindAndName): void {
  delete spec.metadata?.resourceVersion;
  delete spec.metadata?.uid;
  delete spec.metadata?.selfLink;
  delete spec.metadata?.creationTimestamp;
  delete spec.metadata?.managedFields;
  delete spec.status; // status is usually updated by the system, ignore it
}

/**
 * Handle calls to kubernetes API
 */
@injectable()
export class KubernetesClient {
  protected kubeConfig;

  private static readonly DEFAULT_KUBECONFIG_PATH = resolve(homedir(), '.kube', 'config');

  // Custom path to the location of the kubeconfig file
  private kubeconfigPath: string = KubernetesClient.DEFAULT_KUBECONFIG_PATH;

  protected currentNamespace: string | undefined;
  protected currentContextName: string | undefined;

  private kubeConfigWatcher: containerDesktopAPI.FileSystemWatcher | undefined;

  private apiGroups = new Array<V1APIGroup>();

  /*
   a Cache of API resources for the cluster. This is used to compute the plural when dealing
   with custom resources. The key is the apiGroup (including version) like 'networking.k8s.io/v1'
   */
  private apiResources = new Map<string, Array<V1APIResource>>();

  private contextsState?: ContextsManagerInterface;
  private contextsStatesDispatcher: ContextsStatesDispatcher | undefined;

  private readonly _onDidUpdateKubeconfig = new Emitter<containerDesktopAPI.KubeconfigUpdateEvent>();
  readonly onDidUpdateKubeconfig: containerDesktopAPI.Event<containerDesktopAPI.KubeconfigUpdateEvent> =
    this._onDidUpdateKubeconfig.event;

  static readonly portForwardServiceProvider = new KubernetesPortForwardServiceProvider();

  #portForwardService?: KubernetesPortForwardService;

  #managerStarted: boolean = true;

  constructor(
    @inject(ApiSenderType)
    private readonly apiSender: ApiSenderType,
    @inject(IConfigurationRegistry)
    private readonly configurationRegistry: IConfigurationRegistry,
    @inject(FilesystemMonitoring)
    private readonly fileSystemMonitoring: FilesystemMonitoring,
    @inject(Telemetry)
    private readonly telemetry: Telemetry,
    @inject(ExperimentalConfigurationManager)
    private readonly experimentalConfigurationManager: ExperimentalConfigurationManager,
    @inject(FeatureRegistry)
    private readonly featureRegistry: FeatureRegistry,
  ) {
    this.kubeConfig = new KubeConfig();
    this.contextsState = new ContextsManager(this.apiSender);
  }

  async init(): Promise<void> {
    // default
    const defaultKubeconfigPath = resolve(homedir(), '.kube', 'config');

    // add configuration
    const kubeconfigConfigurationNode: IConfigurationNode = {
      id: 'preferences.kubernetes',
      title: 'Kubernetes',
      type: 'object',
      properties: {
        ['kubernetes.Kubeconfig']: {
          description: 'Path to the Kubeconfig file for accessing clusters. (Default is usually ~/.kube/config)',
          type: 'string',
          default: defaultKubeconfigPath,
          format: 'file',
          readonly: false,
        },
        ['kubernetes.statesExperimental']: {
          description: 'Use new version of Kubernetes contexts monitoring (needs restart)',
          type: 'boolean',
          default: true,
        },
        ['kubernetes.useInternalKubernetes']: {
          description: 'Use internal Kubernetes',
          hidden: true,
          type: 'boolean',
          default: true,
        },
      },
    };

    this.configurationRegistry.registerConfigurations([kubeconfigConfigurationNode]);

    // grab the value from the configuration
    const kubernetesConfiguration = this.configurationRegistry.getConfiguration('kubernetes');
    const userKubeconfigPath = kubernetesConfiguration.get<string>('Kubeconfig');
    if (userKubeconfigPath) {
      this.kubeconfigPath = userKubeconfigPath;
      this.setupWatcher(userKubeconfigPath);
      // check if path exists
      if (existsSync(userKubeconfigPath)) {
        this.refresh().catch(() => console.error('Refresh of kube resources on startup failed'));
      } else {
        console.error(`Kubeconfig path ${userKubeconfigPath} provided does not exist. Skipping.`);
      }
    }

    const statesExperimental = this.experimentalConfigurationManager.isExperimentalConfigurationEnabled(
      'kubernetes.statesExperimental',
    );
    this.telemetry.track('kubernetesExperimentalMode', { enabled: statesExperimental });

    if (statesExperimental) {
      const manager = new ContextsManagerExperimental();
      this.contextsState = manager;
      this.contextsStatesDispatcher = new ContextsStatesDispatcher(manager, this.apiSender);
      this.contextsStatesDispatcher.init();
    }

    // Update the property on change
    this.configurationRegistry.onDidChangeConfiguration(async e => {
      if (e.key === 'kubernetes.Kubeconfig') {
        let val = e.value as string;
        if (!val?.trim()) {
          val = defaultKubeconfigPath;
        }
        await this.setKubeconfig(Uri.file(val));
        this.setupWatcher(val);
      }
    });

    this.#managerStarted = true;
    this.featureRegistry.onFeaturesUpdated(async features => {
      const kubeDashboardRegistered = features.includes('kubernetes-dashboard');
      if (kubeDashboardRegistered) {
        if (this.#managerStarted) {
          await this.KubernetesManagerStop();
          this.#managerStarted = false;
        }
      } else {
        if (!this.#managerStarted) {
          await this.KubernetesManagerStart();
          this.#managerStarted = true;
        }
      }
    });
  }

  // The below methods (update, create, delete)
  // help send information to the renderer process to notify any
  // stores (in particular kube context store) as well as extensions (extensions/kube-context)
  setupWatcher(kubeconfigFile: string): void {
    // cancel the previous one (if any)
    this.kubeConfigWatcher?.dispose();

    // monitor the kube config file for changes
    this.kubeConfigWatcher = this.fileSystemMonitoring.createFileSystemWatcher(kubeconfigFile);

    const location = Uri.file(kubeconfigFile);
    const notifyKubeConfigExist = async (): Promise<void> => {
      await this.refresh();
      this._onDidUpdateKubeconfig.fire({ type: 'CREATE', location });
      this.apiSender.send('kubernetes-context-update');
    };

    if (fs.existsSync(kubeconfigFile)) {
      notifyKubeConfigExist().catch((error: unknown) => {
        console.error('Error while checking kubeconfig', error);
      });
    }

    // needs to refresh
    this.kubeConfigWatcher.onDidChange(async () => {
      await this.refresh();
      this._onDidUpdateKubeconfig.fire({ type: 'UPDATE', location });
      this.apiSender.send('kubernetes-context-update');
    });

    this.kubeConfigWatcher.onDidCreate(async () => {
      await notifyKubeConfigExist();
    });

    this.kubeConfigWatcher.onDidDelete(() => {
      this.kubeConfig = new KubeConfig();
      this._onDidUpdateKubeconfig.fire({ type: 'DELETE', location });
      this.apiSender.send('kubernetes-context-update');
    });
  }

  protected createWatchObject(): Watch {
    return new Watch(this.kubeConfig);
  }

  async fetchAPIGroups(): Promise<void> {
    this.apiGroups = [];
    try {
      if (this.kubeConfig) {
        const result = await this.kubeConfig.makeApiClient(ApisApi).getAPIVersions();
        this.apiGroups = result?.groups;
      }
    } catch (err) {
      console.log(`Error while fetching API groups: ${err}`);
    }
  }

  async isAPIGroupSupported(group: string): Promise<boolean> {
    return this.apiGroups.filter(g => g.name === group).length > 0;
  }

  getContexts(): Context[] {
    return this.kubeConfig.contexts;
  }

  getCurrentContextName(): string | undefined {
    return this.currentContextName;
  }

  getClusters(): Cluster[] {
    return this.kubeConfig.clusters;
  }

  getUsers(): User[] {
    return this.kubeConfig.users;
  }

  getCurrentNamespace(): string | undefined {
    return this.currentNamespace;
  }

  getDetailedContexts(): KubeContext[] {
    const kubeContexts: KubeContext[] = [];

    // Go through each context
    this.kubeConfig.contexts.forEach(context => {
      // Try and find the cluster
      const cluster = this.kubeConfig.clusters.find(c => c.name === context.cluster);

      // If the cluster is not found, just return undefined for clusterInfo
      // as sometimes in the context we have information, but nothing about
      // the cluster.
      kubeContexts.push({
        name: context.name,
        cluster: context.cluster,
        user: context.user,
        namespace: context.namespace,
        currentContext: context.name === this.currentContextName, // Set the current context to true if the name matches the current context name
        clusterInfo: cluster
          ? {
              name: cluster.name,
              server: cluster.server,
              skipTLSVerify: cluster.skipTLSVerify,
              tlsServerName: cluster.tlsServerName,
            }
          : undefined,
      });
    });
    return kubeContexts;
  }

  findNewContextName(contextName: string): string {
    let counter = 1;
    let newName = `${contextName}-${counter}`;
    // Keep creating new name by adding 1 to name until not existing name is found
    while (this.kubeConfig.contexts.find(context => context.name === newName)) {
      counter += 1;
      newName = `${contextName}-${counter}`;
    }
    return newName;
  }

  async duplicateContext(contextName: string): Promise<void> {
    const newConfig = new KubeConfig();
    const newName = this.findNewContextName(contextName);
    const originalContext = this.kubeConfig.contexts.find(context => context.name === contextName);
    if (!originalContext) return;

    newConfig.loadFromOptions({
      clusters: this.kubeConfig.clusters,
      users: this.kubeConfig.users,
      currentContext: this.kubeConfig.currentContext,
      contexts: [
        ...this.kubeConfig.contexts,
        {
          ...originalContext,
          name: newName,
        },
      ],
    });

    await this.saveKubeConfig(newConfig);
    // the config is saved back only if saving the file succeeds
    this.kubeConfig = newConfig;
    // We send an update event here, even if another one will be sent after the file change is detected,
    // because that one can get some time to be sent (as cluster connectivity will be tested)
    this.apiSender.send('kubernetes-context-update');
  }

  async updateContext(
    contextName: string,
    newContextName: string,
    newContextNamespace: string,
    newContextCluster: string,
    newContextUser: string,
  ): Promise<void> {
    const newConfig = new KubeConfig();

    const originalContext = this.kubeConfig.contexts.find(context => context.name === contextName);
    const newContexts = this.kubeConfig.contexts.filter(ctx => ctx.name !== contextName);
    if (!originalContext) throw new Error('Context name was not found in kube config');

    const namespaceField = newContextNamespace !== '' ? { namespace: newContextNamespace } : {};

    const editedContext = {
      ...originalContext,
      name: newContextName,
      cluster: newContextCluster,
      user: newContextUser,
      ...namespaceField,
    };

    if (newContextNamespace === '') {
      delete editedContext.namespace;
    }

    newConfig.loadFromOptions({
      clusters: this.kubeConfig.clusters,
      users: this.kubeConfig.users,
      currentContext: this.currentContextName === contextName ? newContextName : this.kubeConfig.currentContext,
      contexts: [editedContext, ...newContexts],
    });

    await this.saveKubeConfig(newConfig);
    // the config is saved back only if saving the file succeeds
    this.kubeConfig = newConfig;
    // We send an update event here, even if another one will be sent after the file change is detected,
    // because that one can get some time to be sent (as cluster connectivity will be tested)
    this.apiSender.send('kubernetes-context-update');
  }

  async deleteContext(contextName: string): Promise<Context[]> {
    const previousContexts = this.kubeConfig.contexts;
    const newContexts = this.kubeConfig.contexts.filter(ctx => ctx.name !== contextName);
    const newConfig = new KubeConfig();
    const newCurrentContextName: string | undefined =
      contextName !== this.currentContextName ? this.currentContextName : undefined;
    newConfig.loadFromOptions({
      contexts: newContexts,
      clusters: this.kubeConfig.clusters.filter(cluster => {
        // remove clusters not referenced anymore, except if there were already not referenced before
        return (
          newContexts.some(ctx => ctx.cluster === cluster.name) ||
          !previousContexts.some(ctx => ctx.cluster === cluster.name)
        );
      }),
      users: this.kubeConfig.users.filter(user => {
        // remove users not referenced anymore, except if there were already not referenced before
        return newContexts.some(ctx => ctx.user === user.name) || !previousContexts.some(ctx => ctx.user === user.name);
      }),
      currentContext: newCurrentContextName ?? '',
    });
    await this.saveKubeConfig(newConfig);
    // the config is saved back only if saving the file succeeds
    this.kubeConfig = newConfig;
    this.currentContextName = newCurrentContextName;
    // We send an update event here, even if another one will be sent after the file change is detected,
    // because that one can get some time to be sent (as cluster connectivity will be tested)
    this.apiSender.send('kubernetes-context-update');
    return this.getContexts();
  }

  // setContext takes a context name and sets it as the current context within the kubeconfig
  async setContext(contextName: string): Promise<void> {
    const newConfig = new KubeConfig();

    // Load the configuration with all the standard contexts, clusters, users, etc.
    // but change the currentContext to the provided contextName.
    newConfig.loadFromOptions({
      contexts: this.kubeConfig.contexts,
      clusters: this.kubeConfig.clusters,
      users: this.kubeConfig.users,
      currentContext: contextName,
    });

    // Save the configuration to the kubeconfig file and set the current context to the context name.
    await this.saveKubeConfig(newConfig);

    // If saving the file succeeds then set the kubeConfig to the newConfig & set the current context name.
    this.kubeConfig = newConfig;
    this.currentContextName = contextName;
    // We send an update event here, even if another one will be sent after the file change is detected,
    // because that one can get some time to be sent (as cluster connectivity will be tested)
    this.apiSender.send('kubernetes-context-update');
  }

  async saveKubeConfig(config: KubeConfig): Promise<void> {
    const jsonString = config.exportConfig();
    const yamlString = jsYaml.dump(JSON.parse(jsonString));
    await fs.promises.writeFile(this.kubeconfigPath, yamlString);
  }

  getKubeConfig(): KubeConfig {
    return this.kubeConfig;
  }

  private async getDefaultNamespace(context: Context): Promise<string> {
    if (context.namespace) {
      return context.namespace;
    }
    const ctx = new KubeConfig();
    ctx.loadFromOptions({
      currentContext: context.name,
      clusters: this.kubeConfig.clusters,
      contexts: this.kubeConfig.contexts,
      users: this.kubeConfig.users,
    });
    let namespace;

    try {
      const projectGroupSupported = await this.isAPIGroupSupported(OPENSHIFT_PROJECT_API_GROUP);
      if (projectGroupSupported) {
        const projects = await ctx
          .makeApiClient(CustomObjectsApi)
          .listClusterCustomObject({ group: OPENSHIFT_PROJECT_API_GROUP, version: 'v1', plural: 'projects' });
        if (projects?.body?.items.length > 0) {
          namespace = projects?.body?.items[0].metadata?.name;
        }
      }
    } catch (err) {
      try {
        const namespaces = await ctx.makeApiClient(CoreV1Api).listNamespace();
        if (namespaces?.items.length > 0) {
          namespace = namespaces?.items[0]?.metadata?.name;
        }
      } catch (error) {
        // unable to list namespaces, can be due to a connection refused (cluster not up)
        console.trace('unable to list namespaces', error);
      }
    }
    namespace ??= 'default';
    return namespace;
  }

  async refresh(): Promise<void> {
    // check the file is empty
    const fileContent = await fs.promises.readFile(this.kubeconfigPath);
    if (fileContent.length === 0) {
      console.error(`Kubeconfig file at ${this.kubeconfigPath} is empty. Skipping.`);
      return;
    }

    // perform it under a try/catch block as the file may not be valid for the kubernetes-javascript client library
    try {
      this.kubeConfig.loadFromFile(this.kubeconfigPath);
    } catch (error) {
      console.error(`An error happened when loading kubeconfig file at ${this.kubeconfigPath}`, error);
      return;
    }

    // get the current context
    this.currentContextName = this.kubeConfig.getCurrentContext();
    const currentContext = this.kubeConfig.contexts.find(context => context.name === this.currentContextName);
    // Only update the namespace if we're able to actually connect to the cluster, otherwise we'll end up with a connection error.
    const connected = await this.checkConnection();
    if (currentContext && connected) {
      this.currentNamespace = await this.getDefaultNamespace(currentContext);
    }
    this.apiResources.clear();
    this.#portForwardService?.dispose();
    this.#portForwardService = KubernetesClient.portForwardServiceProvider.getService(this, this.apiSender);
    await this.fetchAPIGroups();
    this.apiSender.send('kubeconfig-update');
    const configCopy = new KubeConfig();
    configCopy.loadFromString(this.kubeConfig.exportConfig());
    await this.contextsState?.update(configCopy);
  }

  newError(message: string, cause: Error): Error {
    const error = new Error(message);
    error.stack += `\nCause: ${cause.stack}`;
    return error;
  }

  async createPod(namespace: string, body: V1Pod): Promise<V1Pod> {
    let telemetryOptions = {};
    const k8sCoreApi = this.kubeConfig.makeApiClient(CoreV1Api);

    try {
      return await k8sCoreApi.createNamespacedPod({ namespace, body });
    } catch (error) {
      telemetryOptions = { error: error };
      throw this.wrapK8sClientError(error);
    } finally {
      this.telemetry.track('kubernetesCreatePod', telemetryOptions);
    }
  }

  async createService(namespace: string, body: V1Service): Promise<V1Service> {
    let telemetryOptions = {};
    const k8sCoreApi = this.kubeConfig.makeApiClient(CoreV1Api);

    try {
      return await k8sCoreApi.createNamespacedService({ namespace, body });
    } catch (error) {
      telemetryOptions = { error: error };
      throw this.wrapK8sClientError(error);
    } finally {
      this.telemetry.track('kubernetesCreateService', telemetryOptions);
    }
  }

  async createIngress(namespace: string, body: V1Ingress): Promise<V1Ingress> {
    let telemetryOptions = {};
    const k8sCoreApi = this.kubeConfig.makeApiClient(NetworkingV1Api);

    try {
      return await k8sCoreApi.createNamespacedIngress({ namespace, body });
    } catch (error) {
      telemetryOptions = { error: error };
      throw this.wrapK8sClientError(error);
    } finally {
      this.telemetry.track('kubernetesCreateIngress', telemetryOptions);
    }
  }

  async createOpenShiftRoute(namespace: string, body: V1Route): Promise<V1Route> {
    let telemetryOptions = {};
    const k8sCustomObjectsApi = this.kubeConfig.makeApiClient(CustomObjectsApi);

    try {
      return await k8sCustomObjectsApi.createNamespacedCustomObject({
        group: 'route.openshift.io',
        version: 'v1',
        namespace,
        plural: 'routes',
        body,
      });
    } catch (error) {
      telemetryOptions = { error: error };
      throw this.wrapK8sClientError(error);
    } finally {
      this.telemetry.track('kubernetesCreateRoute', telemetryOptions);
    }
  }

  async listNamespacedPod(namespace: string, fieldSelector?: string, labelSelector?: string): Promise<V1PodList> {
    const k8sApi = this.kubeConfig.makeApiClient(CoreV1Api);
    try {
      return await k8sApi.listNamespacedPod({
        namespace,
        fieldSelector,
        labelSelector,
      });
    } catch (error) {
      throw this.wrapK8sClientError(error);
    }
  }

  async readNamespacedPod(name: string, namespace: string): Promise<V1Pod> {
    const k8sApi = this.kubeConfig.makeApiClient(CoreV1Api);
    try {
      const res = await k8sApi.readNamespacedPod({ name, namespace });
      if (res?.metadata?.managedFields) {
        delete res.metadata.managedFields;
      }
      return res;
    } catch (error) {
      throw this.wrapK8sClientError(error);
    }
  }

  async readNamespacedDeployment(name: string, namespace: string): Promise<V1Deployment> {
    const k8sAppsApi = this.kubeConfig.makeApiClient(AppsV1Api);
    try {
      const res = await k8sAppsApi.readNamespacedDeployment({ name, namespace });
      if (res?.metadata?.managedFields) {
        delete res.metadata.managedFields;
      }
      return res;
    } catch (error) {
      this.telemetry.track('kubernetesReadNamespacedDeployment.error', error);
      throw this.wrapK8sClientError(error);
    }
  }

  async readNamespacedService(name: string, namespace: string): Promise<V1Service> {
    const k8sApi = this.kubeConfig.makeApiClient(CoreV1Api);
    try {
      const res = await k8sApi.readNamespacedService({ name, namespace });
      if (res?.metadata?.managedFields) {
        delete res.metadata.managedFields;
      }
      return res;
    } catch (error) {
      this.telemetry.track('kubernetesReadNamespacedService.error', error);
      throw this.wrapK8sClientError(error);
    }
  }

  async readNamespacedConfigMap(name: string, namespace: string): Promise<V1ConfigMap | undefined> {
    const k8sApi = this.kubeConfig.makeApiClient(CoreV1Api);
    try {
      const res = await k8sApi.readNamespacedConfigMap({ name, namespace });
      if (res?.metadata?.managedFields) {
        delete res.metadata.managedFields;
      }
      return res;
    } catch (error) {
      this.telemetry.track('kubernetesReadNamespacedConfigMap.error', error);
      throw this.wrapK8sClientError(error);
    }
  }

  async listNamespaces(): Promise<V1NamespaceList> {
    try {
      const k8sApi = this.kubeConfig.makeApiClient(CoreV1Api);
      return await k8sApi.listNamespace();
    } catch (error) {
      throw this.wrapK8sClientError(error);
    }
  }

  // Check that we can connect to the cluster and return a Promise<boolean> of true or false depending on the result.
  // We will check via the health check on the cluster of the current context, with a short timeout.
  async checkConnection(): Promise<boolean> {
    try {
      const health = new Health(this.kubeConfig);
      return await health.readyz({ timeout: CHECK_CONNECTION_TIMEOUT_MS });
    } catch {
      return false;
    }
  }

  private wrapK8sClientError(e: unknown): Error {
    if (
      e &&
      e instanceof Error &&
      'response' in e &&
      e.response &&
      typeof e.response === 'object' &&
      'body' in e.response &&
      e?.response?.body
    ) {
      if (
        typeof e.response.body === 'object' &&
        'message' in e.response.body &&
        typeof e.response.body.message === 'string'
      ) {
        return this.newError(e.response.body.message, e);
      } else if (typeof e.response.body === 'string') {
        return this.newError(e.response.body, e);
      }
    }
    return e instanceof Error ? e : new Error(`${e}`);
  }

  getKubeconfig(): containerDesktopAPI.Uri {
    return Uri.file(this.kubeconfigPath);
  }

  async setKubeconfig(location: containerDesktopAPI.Uri): Promise<void> {
    this.kubeconfigPath = location.fsPath;
    await this.refresh();
    // notify change
    this._onDidUpdateKubeconfig.fire({ type: 'UPDATE', location });
  }

  async stop(): Promise<void> {
    this.kubeConfigWatcher?.dispose();
  }

  getTags(tags: Tags): Tags {
    for (const tag of tags) {
      if (typeof tag === 'object' && 'tag' in tag && tag.tag === 'tag:yaml.org,2002:int') {
        const newTag = { ...tag };
        newTag.test = /^(0[0-7][0-7][0-7])$/;
        newTag.resolve = (str: string): number => parseInt(str, 8);
        tags.unshift(newTag);
        break;
      }
    }
    return tags;
  }

  // load yaml file and extract manifests
  async loadManifestsFromFile(file: string): Promise<KubernetesObject[]> {
    // throw exception if file does not exist
    if (!fs.existsSync(file)) {
      throw new Error(`File ${file} does not exist`);
    }

    // load file and create resources
    const content = await fs.promises.readFile(file, 'utf-8');

    const manifests = parseAllDocuments(content, { customTags: this.getTags });
    // filter out null manifests
    return manifests.map(manifest => manifest.toJSON()).filter(manifest => !!manifest);
  }

  /**
   * Create a given yaml file on a context, i.e. 'kubectl create -f'. If the resources exists
   * an error will be thrown.
   *
   * @param context a context
   * @param filePath file system path to a YAML Kubernetes spec
   * @param namespace the namespace to use for any resources that don't include one
   */
  async createResourcesFromFile(context: string, filePath: string, namespace?: string): Promise<void> {
    const manifests = await this.loadManifestsFromFile(filePath);
    if (manifests.filter(s => s?.kind).length === 0) {
      throw new Error('No valid Kubernetes resources found in file');
    }
    await this.syncResources(context, manifests, 'create', namespace);
  }

  /**
   * Create Kubernetes resources on the specified cluster. Resources are created sequentially.
   *
   * @param context the context name to use
   * @param manifests the list of Kubernetes resources to create
   * @param namespace the namespace to use for any resources that don't include one
   */
  async createResources(context: string, manifests: unknown[], namespace?: string): Promise<void> {
    await this.syncResources(context, manifests, 'create', namespace);
  }

  /**
   * Apply a given yaml file to a context, i.e. 'kubectl apply -f'. Resources that exist
   * on the context are patched, and any new resources are created.
   *
   * @param context a context
   * @param filePath file system path to a YAML Kubernetes spec
   * @param namespace the namespace to use for any resources that don't include one
   * @return an array of resources created
   */
  async applyResourcesFromFile(
    context: string,
    filePath: string | string[],
    namespace?: string,
  ): Promise<KubernetesObject[]> {
    const manifests: KubernetesObject[] = [];
    if (typeof filePath === 'string') {
      manifests.push(...(await this.loadManifestsFromFile(filePath)));
    } else {
      for (const path of filePath) {
        manifests.push(...(await this.loadManifestsFromFile(path)));
      }
    }
    if (manifests.filter(s => s?.kind).length === 0) {
      throw new Error('No valid Kubernetes resources found');
    }
    return this.syncResources(context, manifests, 'apply', namespace);
  }

  /**
   * Load manifests from a YAML string.
   * @param yaml the YAML string
   * @return an array of Kubernetes resources
   */
  async loadManifestsFromYAML(yaml: string): Promise<KubernetesObject[]> {
    const manifests = parseAllDocuments(yaml, { customTags: this.getTags });
    // filter out any null manifests
    return manifests.map(manifest => manifest.toJSON()).filter(manifest => !!manifest);
  }

  /**
   * Similar to applyResourcesFromFile, but instead you can pass in a string that contains the YAML
   *
   * @param context a context
   * @param yaml content consisting of a stringified YAML
   * @return an array of resources created
   */
  async applyResourcesFromYAML(context: string, yaml: string): Promise<KubernetesObject[]> {
    const manifests = await this.loadManifestsFromYAML(yaml);
    return this.applyResources(context, manifests);
  }

  /**
   * Apply a given yaml file to a context, i.e. 'kubectl apply -f'. Resources that exist
   * on the context are patched, and any new resources are created.
   *
   * @param context a context
   * @param filePath file system path to a YAML Kubernetes spec
   * @param namespace the namespace to use for any resources that don't include one
   * @return an array of resources created
   */
  async applyResources(
    context: string,
    manifests: KubernetesObject[],
    namespace?: string,
  ): Promise<KubernetesObject[]> {
    return this.syncResources(context, manifests, 'apply', namespace);
  }

  /**
   * Applies or creates a set of resources to a context, via creation or patching.
   *
   * @param context a context
   * @param manifests a set of Kubernetes spec manifests
   * @param action 'create' (only create new resources, do not overwrite existing) or 'apply' (create or patch as necessary)
   * @param namespace the namespace to use for any resources that don't include one
   * @return an array of resources created
   *
   * Heavily influenced by the API example:
   * https://github.com/kubernetes-client/javascript/blob/0fbfd8fc2dcc7f4ec3e6fcd64a5c55169b6ef0b8/examples/typescript/apply/apply-example.ts
   */
  async syncResources(
    context: string,
    manifests: unknown[],
    action: 'create' | 'apply',
    namespace?: string,
  ): Promise<KubernetesObject[]> {
    const telemetryOptions: Record<string, unknown> = {
      manifestsSize: manifests?.length,
      action: action,
    };
    if (namespace) {
      telemetryOptions['namespace'] = namespace;
    }

    try {
      const configCopy = new KubeConfig();
      configCopy.loadFromString(this.kubeConfig.exportConfig());
      configCopy.currentContext = context;
      const validSpecs = manifests.filter(s => isKubernetesObjectWithKindAndName(s));

      const client = configCopy.makeApiClient(KubernetesObjectApi);
      const created: KubernetesObject[] = [];
      for (const spec of validSpecs) {
        // this is to convince TypeScript that metadata exists
        spec.metadata = spec.metadata ?? {};
        spec.metadata.annotations = spec.metadata.annotations ?? {};

        delete spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'];
        spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'] = JSON.stringify(spec);

        spec.metadata.namespace ??= namespace ?? DEFAULT_NAMESPACE;

        // When patching a resource or creating a new one, we do not need certain metadata fields to be present such as resourceVersion, uid, selfLink, and creationTimestamp
        // these cause conflicts when patching a resource since client.patch will serialize these fields and the server will reject the request
        // this change is due to changes on how client.patch / client.create works with the latest serialization changes in:
        // https://github.com/kubernetes-client/javascript/pull/1695 with regards to date
        // we also remove resourceVersion so we may apply multiple edits to the same resource without having to entirely retrieve and reload the YAML
        // from the server before applying.
        sanitizeMetadata(spec);

        try {
          // try to get the resource, if it does not exist an error will be thrown and we will
          // end up in the catch block
          await client.read(spec);
          // we got the resource, so it exists: patch it
          //
          // Note that this could fail if the spec refers to a custom resource. For custom resources
          // you may need to specify a different patch merge strategy in the content-type header
          //
          // See: https://github.com/kubernetes/kubernetes/issues/97423
          if (action === 'apply') {
            const response = await client.patch(
              spec,
              undefined /* pretty */,
              undefined /* dryRun */,
              FIELD_MANAGER /* fieldManager */,
            );
            created.push(response);
          }
        } catch (error) {
          // we did not get the resource, so it does not exist: create it
          const response = await client.create(spec);
          created.push(response);
        }
      }
      return created;
    } catch (error: unknown) {
      telemetryOptions['error'] = error;
      if (error instanceof ApiException) {
        const statusError = error as ApiException<string>;
        let status: unknown;
        try {
          status = JSON.parse(statusError.body);
        } catch {
          throw error;
        }
        if (
          status &&
          typeof status === 'object' &&
          'message' in status &&
          status.message &&
          typeof status.message === 'string'
        ) {
          throw new Error(status.message);
        }
      }
      throw error;
    } finally {
      this.telemetry.track('kubernetesSyncResources', telemetryOptions);
    }
  }

  public getContextsGeneralState(): Map<string, ContextGeneralState> {
    return this.contextsState?.getContextsGeneralState() ?? new Map();
  }

  public getCurrentContextGeneralState(): ContextGeneralState {
    return (
      this.contextsState?.getCurrentContextGeneralState() ?? {
        reachable: false,
        resources: { pods: 0, deployments: 0 },
      }
    );
  }

  public registerGetCurrentContextResources(resourceName: ResourceName): KubernetesObject[] {
    return this.contextsState?.registerGetCurrentContextResources(resourceName) ?? [];
  }

  public unregisterGetCurrentContextResources(resourceName: ResourceName): KubernetesObject[] {
    return this.contextsState?.unregisterGetCurrentContextResources(resourceName) ?? [];
  }

  public dispose(): void {
    this.kubeConfigWatcher?.dispose();
    this.contextsState?.dispose();
    this.contextsStatesDispatcher?.dispose();
    this.#portForwardService?.dispose();
  }

  /**
   * Ask for getting the state of the context as soon as possible.
   *
   * Because the connection to a context is tested with a backoff,
   * it can take time to know if a context is reachable or not.
   * By calling this method, the connection will be tested immediately,
   * and the result sent as soon as the connection status is known.
   *
   * @param context name of the context for which we want to get state ASAP
   * @returns
   */
  public async refreshContextState(context: string): Promise<void> {
    return this.contextsState?.refreshContextState(context);
  }

  protected ensurePortForwardService(): KubernetesPortForwardService {
    if (!this.#portForwardService) {
      this.#portForwardService = KubernetesClient.portForwardServiceProvider.getService(this, this.apiSender);
    }
    return this.#portForwardService;
  }

  public async getPortForwards(): Promise<ForwardConfig[]> {
    return this.ensurePortForwardService().listForwards();
  }

  public getContextsHealths(): ContextHealth[] {
    return this.contextsStatesDispatcher?.getContextsHealths() ?? [];
  }

  public getContextsPermissions(): ContextPermission[] {
    return this.contextsStatesDispatcher?.getContextsPermissions() ?? [];
  }

  public getResourcesCount(): ResourceCount[] {
    return this.contextsStatesDispatcher?.getResourcesCount() ?? [];
  }

  public getActiveResourcesCount(): ResourceCount[] {
    return this.contextsStatesDispatcher?.getActiveResourcesCount() ?? [];
  }

  public getResources(contextNames: string[], resourceName: string): KubernetesContextResources[] {
    return this.contextsStatesDispatcher?.getResources(contextNames, resourceName) ?? [];
  }

  public getTroubleshootingInformation(): KubernetesTroubleshootingInformation {
    return (
      this.contextsStatesDispatcher?.getTroubleshootingInformation() ?? {
        healthCheckers: [],
        permissionCheckers: [],
        informers: [],
      }
    );
  }

  // This method is called when an extension providing the Kubernetes feature is enabled
  protected async KubernetesManagerStop(): Promise<void> {
    const emptyKubeConfig = new KubeConfig();
    await this.contextsState?.update(emptyKubeConfig);
    this.contextsState?.dispose();
    this.contextsState = undefined;
    this.contextsStatesDispatcher?.dispose();
    this.contextsStatesDispatcher = undefined;
    await this.configurationRegistry.updateConfigurationValue('kubernetes.useInternalKubernetes', false);
  }

  // This method is called when an extension providing Kubernetes feature is disabled
  protected async KubernetesManagerStart(): Promise<void> {
    const statesExperimental = this.experimentalConfigurationManager.isExperimentalConfigurationEnabled(
      'kubernetes.statesExperimental',
    );
    if (statesExperimental) {
      const manager = new ContextsManagerExperimental();
      this.contextsState = manager;
      this.contextsStatesDispatcher = new ContextsStatesDispatcher(manager, this.apiSender);
      this.contextsStatesDispatcher.init();
    } else {
      this.contextsState = new ContextsManager(this.apiSender);
    }
    await this.contextsState?.update(this.kubeConfig);
    await this.configurationRegistry.updateConfigurationValue('kubernetes.useInternalKubernetes', true);
  }
}
