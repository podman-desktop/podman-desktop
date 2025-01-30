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
import net from 'node:net';

import type { V1Deployment, V1Pod, V1Service } from '@kubernetes/client-node';
import { PortForward } from '@kubernetes/client-node';

import type { KubernetesClient } from '/@/plugin/kubernetes/kubernetes-client.js';
import type { ForwardConfigRequirements } from '/@/plugin/kubernetes/kubernetes-port-forward-validation.js';
import type { IDisposable } from '/@/plugin/types/disposable.js';
import { Disposable } from '/@/plugin/types/disposable.js';
import { requireNonUndefined } from '/@/util.js';
import type { ForwardConfig, PortMapping } from '/@api/kubernetes-port-forward-model.js';
import { WorkloadKind } from '/@api/kubernetes-port-forward-model.js';

/**
 * Internal type for holding forwarding setup information.
 */
export interface ForwardingSetup {
  name: string;
  namespace: string;
  forward: PortMapping;
}

/**
 * A service that manages port forwarding connections in a Kubernetes environment.
 * The class is not intended for direct use. For proper usage, use the
 * {@link KubernetesPortForwardServiceProvider.getService} method, which returns a {@link KubernetesPortForwardService}.
 */
export class PortForwardConnectionService {
  /**
   * Creates an instance of PortForwardConnectionService.
   * @param kubeClient - The Kubernetes client.
   * @param configRequirementsChecker - Optional configuration requirements checker.
   */
  constructor(
    protected kubeClient: KubernetesClient,
    protected configRequirementsChecker?: ForwardConfigRequirements,
  ) {}

  /**
   * Starts the port forwarding based on the provided configuration.
   * @param config - The forwarding configuration.
   * @returns A promise that resolves to a disposable resource to stop the forwarding.
   * @throws If any of the port forwarding fail.
   */
  async startForward(config: ForwardConfig): Promise<IDisposable> {
    if (this.configRequirementsChecker) {
      await this.configRequirementsChecker.checkRuntimeRequirements(config);
    }

    const resource = await this.getWorkloadResource(config.kind, config.name, config.namespace);

    const forwardSetup = await this.getForwardingSetup(resource, config.forward);
    return this.performForward(forwardSetup);
  }

  /**
   * Performs the port forwarding setup and returns a disposable to stop it.
   * @param forwardSetup - The forwarding setup information.
   * @returns A promise that resolves to a disposable resource to stop the forwarding.
   * @throws If the server fails to initialize or listen.
   */
  protected async performForward(forwardSetup: ForwardingSetup): Promise<IDisposable> {
    const server = this.createServer(forwardSetup);
    const disposable = Disposable.create(() => server.close());

    return new Promise<IDisposable>((resolve, reject) => {
      server.listen(forwardSetup.forward.localPort, 'localhost');
      server.on('error', (error: NodeJS.ErrnoException) => this.onServerError(error, reject, forwardSetup));
      resolve(disposable);
    });
  }

  /**
   * Creates a server to handle the port forwarding.
   * @param forwardSetup - The forwarding setup information.
   * @returns The created server.
   */
  protected createServer(forwardSetup: ForwardingSetup): net.Server {
    return net.createServer(socket => {
      const kubernetesPortForward = new PortForward(this.kubeClient.getKubeConfig());
      kubernetesPortForward
        .portForward(
          forwardSetup.namespace,
          forwardSetup.name,
          [forwardSetup.forward.remotePort],
          socket,
          null,
          socket,
          3,
        )
        .catch(console.error);
    });
  }

  /**
   * Handles the server error event.
   * @param error - The error instance.
   * @param reject - The reject function of the promise.
   * @param forwardSetup - The forwarding setup information.
   * @throws If the port is already in use, the operation requires administrative privileges, or the server fails to initialize.
   */
  protected onServerError(
    error: NodeJS.ErrnoException,
    reject: (reason?: Error) => void,
    forwardSetup: ForwardingSetup,
  ): void {
    if (error.code === 'EADDRINUSE') {
      reject(new Error(`Port ${forwardSetup.forward.localPort} is already in use.`));
    } else if (error.code === 'EACCES') {
      reject(new Error('Operation requires administrative privileges.'));
    } else {
      reject(new Error(`Failed to initialize port forwarding server: ${error.message}`));
    }
  }

  /**
   * Retrieves the Kubernetes resource for the specified workload.
   * @param kind - The kind of the workload.
   * @param name - The name of the workload.
   * @param namespace - The namespace of the workload.
   * @returns The Kubernetes resource.
   * @throws If the workload kind is not supported.
   */
  protected async getWorkloadResource(
    kind: WorkloadKind,
    name: string,
    namespace: string,
  ): Promise<V1Pod | V1Deployment | V1Service> {
    if (kind === WorkloadKind.POD) {
      return this.getPod(name, namespace);
    } else if (kind === WorkloadKind.DEPLOYMENT) {
      return this.getDeployment(name, namespace);
    } else if (kind === WorkloadKind.SERVICE) {
      return this.getService(name, namespace);
    }

    throw new Error(`Workload kind '${kind}' currently not supported.`);
  }

  /**
   * Retrieves a pod by name and namespace.
   * @param name - The name of the pod.
   * @param namespace - The namespace of the pod.
   * @returns The pod.
   * @throws If the pod cannot be retrieved.
   */
  protected async getPod(name: string, namespace: string): Promise<V1Pod> {
    return this.kubeClient.readNamespacedPod(name, namespace);
  }

  /**
   * Retrieves a deployment by name and namespace.
   * @param name - The name of the deployment.
   * @param namespace - The namespace of the deployment.
   * @returns The deployment.
   * @throws If the deployment cannot be retrieved.
   */
  protected async getDeployment(name: string, namespace: string): Promise<V1Deployment> {
    return this.kubeClient.readNamespacedDeployment(name, namespace);
  }

  /**
   * Retrieves a service by name and namespace.
   * @param name - The name of the service.
   * @param namespace - The namespace of the service.
   * @returns The service.
   * @throws If the service cannot be retrieved.
   */
  protected async getService(name: string, namespace: string): Promise<V1Service> {
    return this.kubeClient.readNamespacedService(name, namespace);
  }

  /**
   * Retrieves the forwarding setup for a given resource and port mapping.
   * @param resource - The Kubernetes resource.
   * @param forward - The port mapping.
   * @returns The forwarding setup.
   * @throws If the resource type is invalid.
   */
  protected async getForwardingSetup(
    resource: V1Pod | V1Deployment | V1Service,
    forward: PortMapping,
  ): Promise<ForwardingSetup> {
    if (this.isPodResource(resource)) {
      return this.getForwardSetupFromPod(resource as V1Pod, forward);
    } else if (this.isDeploymentResource(resource)) {
      return this.getForwardSetupFromDeployment(resource as V1Deployment, forward);
    } else if (this.isServiceResource(resource)) {
      return this.getForwardSetupFromService(resource as V1Service, forward);
    }

    throw new Error('Found invalid resource type.');
  }

  /**
   * Determines if a resource is a pod.
   * @param resource - The Kubernetes resource.
   * @returns True if the resource is a pod, otherwise false.
   * @throws If the resource kind is undefined.
   */
  protected isPodResource(resource: V1Pod | V1Deployment | V1Service): boolean {
    return requireNonUndefined(resource.kind, 'Resource is undefined.') === 'Pod';
  }

  /**
   * Determines if a resource is a deployment.
   * @param resource - The Kubernetes resource.
   * @returns True if the resource is a deployment, otherwise false.
   * @throws If the resource kind is undefined.
   */
  protected isDeploymentResource(resource: V1Pod | V1Deployment | V1Service): boolean {
    return requireNonUndefined(resource.kind, 'Resource is undefined.') === 'Deployment';
  }

  /**
   * Determines if a resource is a service.
   * @param resource - The Kubernetes resource.
   * @returns True if the resource is a service, otherwise false.
   * @throws If the resource kind is undefined.
   */
  protected isServiceResource(resource: V1Pod | V1Deployment | V1Service): boolean {
    return requireNonUndefined(resource.kind, 'Resource is undefined.') === 'Service';
  }

  /**
   * Retrieves the forwarding setup from a pod.
   * @param pod - The pod.
   * @param forward - The port mapping.
   * @returns The forwarding setup.
   * @throws If the pod name or namespace is undefined.
   */
  protected getForwardSetupFromPod(pod: V1Pod, forward: PortMapping): ForwardingSetup {
    return {
      name: requireNonUndefined(pod.metadata?.name, 'Found undefined Pod name.'),
      namespace: requireNonUndefined(pod.metadata?.namespace, 'Found undefined namespace.'),
      forward: forward,
    } as ForwardingSetup;
  }

  /**
   * Retrieves the forwarding setup from a deployment.
   * @param deployment - The deployment.
   * @param forward - The port mapping.
   * @returns The forwarding setup.
   * @throws If the deployment namespace, selector, or pod name is undefined.
   */
  protected async getForwardSetupFromDeployment(
    deployment: V1Deployment,
    forward: PortMapping,
  ): Promise<ForwardingSetup> {
    const namespace = requireNonUndefined(deployment.metadata?.namespace, 'Found undefined namespace.');
    const matchLabels = requireNonUndefined(deployment.spec?.selector.matchLabels, 'Found undefined selector');
    const selectorKey = requireNonUndefined(Object.keys(matchLabels)[0]);
    const labelSelector = `${selectorKey}=${matchLabels[selectorKey]}`;
    const podList = await this.kubeClient.listNamespacedPod(namespace, undefined, labelSelector);
    const podName = requireNonUndefined(podList.items[0]?.metadata?.name, 'Found undefined Pod name.');

    return {
      name: podName,
      namespace: namespace,
      forward: forward,
    } as ForwardingSetup;
  }

  /**
   * Retrieves the forwarding setup from a service.
   * @param service - The service.
   * @param forward - The port mapping.
   * @returns The forwarding setup.
   * @throws If the service namespace, selector, pod, or target port is undefined.
   */
  protected async getForwardSetupFromService(service: V1Service, forward: PortMapping): Promise<ForwardingSetup> {
    const namespace = requireNonUndefined(service.metadata?.namespace, 'Found undefined namespace.');
    const selectorObj = requireNonUndefined(service.spec?.selector, 'Found undefined selector.');
    const labelSelector = this.toLabelSelector(selectorObj);
    const podList = await this.kubeClient.listNamespacedPod(namespace, undefined, labelSelector);
    const pod = requireNonUndefined(podList.items[0], 'Found undefined Pod.');
    const podName = requireNonUndefined(pod.metadata?.name, 'Found undefined Pod name.');
    const targetRemotePort = this.getTargetPort(service, pod, forward.remotePort);

    return {
      name: podName,
      namespace: namespace,
      forward: {
        localPort: forward.localPort,
        remotePort: targetRemotePort,
      } as PortMapping,
    };
  }

  /**
   * Retrieves the target port for a service.
   * @param service - The service.
   * @param pod - The pod.
   * @param port - The port number.
   * @returns The target port number.
   * @throws If the service ports, target port, or container port is undefined.
   */
  protected getTargetPort(service: V1Service, pod: V1Pod, port: number): number {
    const servicePorts = requireNonUndefined(service.spec?.ports, 'Found undefined ports.');
    const seekPort = servicePorts.find(servicePort => servicePort.port === port);
    const targetPort = requireNonUndefined(seekPort?.targetPort, 'Failed to map remote port to target Service port.');

    if (typeof targetPort === 'number') {
      return targetPort;
    } else {
      const containers = requireNonUndefined(pod.spec?.containers, 'Found undefined containers');
      const container = containers.find(container => container.ports?.some(port => port.name === targetPort));
      return requireNonUndefined(
        container?.ports?.find(port => port.name === targetPort)?.containerPort,
        'Failed to locate Service port in container spec.',
      );
    }
  }

  /**
   * Converts a selector object to a label selector string.
   * @param selectorObj - The selector object.
   * @returns The label selector string.
   */
  protected toLabelSelector(selectorObj: { [key: string]: string }): string {
    const strings = new Array<string>();
    for (const key of Object.keys(selectorObj)) {
      strings.push(`${key}=${selectorObj[key]}`);
    }
    return strings.join(',');
  }
}
