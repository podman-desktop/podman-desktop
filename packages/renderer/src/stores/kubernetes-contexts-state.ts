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

import type { CoreV1Event, KubernetesObject } from '@kubernetes/client-node';
import { derived, type Readable, readable, writable } from 'svelte/store';

import type { CheckingState, ContextGeneralState } from '/@api/kubernetes-contexts-states';
import type { ForwardConfig } from '/@api/kubernetes-port-forward-model';

import { findMatchInLeaves } from './search-util';

export const kubernetesContextsCheckingState = readable(new Map<string, CheckingState>(), set => {
  window.events?.receive('kubernetes-contexts-checking-state-update', (value: unknown) => {
    set(value as Map<string, CheckingState>);
  });
});

const previousState = new Map<string, 'waiting' | 'checking' | 'gaveup'>();
const checkingCount = new Map<string, number>();

/**
 * kubernetesContextsCheckingStateDelayed indicates for each context
 * if it is being checked, with a delay of 2 seconds when it is being checked,
 * so each check=true state in input is visible for at least 2 seconds
 *  _    _      _          _
 * | |__| |____| |________| |_____  input
 *  ________    ____       ____
 * |        |__|    |_____|    |__  output
 */
export const kubernetesContextsCheckingStateDelayed = derived<
  Readable<Map<string, CheckingState>>[],
  Map<string, boolean>
>([kubernetesContextsCheckingState], ([$checkingState], set) => {
  for (const [context, state] of $checkingState) {
    if (!previousState.has(context) || previousState.get(context) !== state.state) {
      if (state.state === 'checking') {
        const prev = checkingCount.get(context) ?? 0;
        checkingCount.set(context, prev + 1);
        set(new Map(Array.from(checkingCount, ([key, value]) => [key, value > 0])));
      } else if (state.state === 'waiting' && (checkingCount.get(context) ?? 0) > 0) {
        const prev = checkingCount.get(context) ?? 0;
        checkingCount.set(context, prev - 1);
        setTimeout(() => {
          set(new Map(Array.from(checkingCount, ([key, value]) => [key, value > 0])));
        }, 2000);
      }
      previousState.set(context, state.state);
    }
  }
});

export const kubernetesContextsState = readable(new Map<string, ContextGeneralState>(), set => {
  window
    .kubernetesGetContextsGeneralState()
    .then(value => set(value))
    .catch((err: unknown) => console.log('Error getting Kubernetes contexts generate state initial value', err));
  window.events?.receive('kubernetes-contexts-general-state-update', (value: unknown) => {
    set(value as Map<string, ContextGeneralState>);
  });
});

export const kubernetesCurrentContextState = readable(
  {
    reachable: false,
    error: 'initializing',
    resources: { pods: 0, deployments: 0 },
  } as ContextGeneralState,
  set => {
    window
      .kubernetesGetCurrentContextGeneralState()
      .then(value => set(value))
      .catch((err: unknown) => console.log('Error getting Kubernetes contexts generate state initial value', err));
    window.events?.receive('kubernetes-current-context-general-state-update', (value: unknown) => {
      set(value as ContextGeneralState);
    });
  },
);

export const kubernetesCurrentContextDeployments = readable<KubernetesObject[]>([], set => {
  window
    .kubernetesRegisterGetCurrentContextResources('deployments')
    .then(value => set(value))
    .catch((err: unknown) => console.log('Error registering Kubernetes deployments', err));
  window.events?.receive('kubernetes-current-context-deployments-update', (value: unknown) => {
    set(value as KubernetesObject[]);
  });
  return (): void => {
    window
      .kubernetesUnregisterGetCurrentContextResources('deployments')
      .catch((err: unknown) => console.log('Error unregistering Kubernetes deployments', err));
  };
});

export const deploymentSearchPattern = writable('');

// The deployments in the current context, filtered with `deploymentSearchPattern`
export const kubernetesCurrentContextDeploymentsFiltered = derived(
  [deploymentSearchPattern, kubernetesCurrentContextDeployments],
  ([$searchPattern, $deployments]) =>
    $deployments.filter(deployment => findMatchInLeaves(deployment, $searchPattern.toLowerCase())),
);

// Services

export const kubernetesCurrentContextServices = readable<KubernetesObject[]>([], set => {
  window
    .kubernetesRegisterGetCurrentContextResources('services')
    .then(value => set(value))
    .catch((err: unknown) => console.log('Error registering Kubernetes services', err));
  window.events?.receive('kubernetes-current-context-services-update', (value: unknown) => {
    set(value as KubernetesObject[]);
  });
  return (): void => {
    window
      .kubernetesUnregisterGetCurrentContextResources('services')
      .catch((err: unknown) => console.log('Error unregistering Kubernetes services', err));
  };
});

export const serviceSearchPattern = writable('');

// The services in the current context, filtered with `serviceSearchPattern`
export const kubernetesCurrentContextServicesFiltered = derived(
  [serviceSearchPattern, kubernetesCurrentContextServices],
  ([$searchPattern, $services]) =>
    $services.filter(service => findMatchInLeaves(service, $searchPattern.toLowerCase())),
);

// CronJobs

export const kubernetesCurrentContextCronJobs = readable<KubernetesObject[]>([], set => {
  window
    .kubernetesRegisterGetCurrentContextResources('cronjobs')
    .then(value => set(value))
    .catch((err: unknown) => console.log('Error registering Kubernetes cronjobs', err));
  window.events?.receive('kubernetes-current-context-cronjobs-update', (value: unknown) => {
    set(value as KubernetesObject[]);
  });
  return (): void => {
    window
      .kubernetesUnregisterGetCurrentContextResources('cronjobs')
      .catch((err: unknown) => console.log('Error unregistering Kubernetes cronjobs', err));
  };
});

export const cronJobSearchPattern = writable('');

// Current context of CronJobs
export const kubernetesCurrentContextCronJobsFiltered = derived(
  [cronJobSearchPattern, kubernetesCurrentContextCronJobs],
  ([$searchPattern, $cronJobs]) =>
    $cronJobs.filter(cronJob => findMatchInLeaves(cronJob, $searchPattern.toLowerCase())),
);

// Jobs
export const kubernetesCurrentContextJobs = readable<KubernetesObject[]>([], set => {
  window
    .kubernetesRegisterGetCurrentContextResources('jobs')
    .then(value => set(value))
    .catch((err: unknown) => console.log('Error registering Kubernetes jobs', err));
  window.events?.receive('kubernetes-current-context-jobs-update', (value: unknown) => {
    set(value as KubernetesObject[]);
  });
  return (): void => {
    window
      .kubernetesUnregisterGetCurrentContextResources('jobs')
      .catch((err: unknown) => console.log('Error unregistering Kubernetes jobs', err));
  };
});

export const jobSearchPattern = writable('');

// Current context of jobs
export const kubernetesCurrentContextJobsFiltered = derived(
  [jobSearchPattern, kubernetesCurrentContextJobs],
  ([$searchPattern, $jobs]) => $jobs.filter(job => findMatchInLeaves(job, $searchPattern.toLowerCase())),
);

// Nodes

export const kubernetesCurrentContextNodes = readable<KubernetesObject[]>([], set => {
  window
    .kubernetesRegisterGetCurrentContextResources('nodes')
    .then(value => set(value))
    .catch((err: unknown) => console.log('Error registering Kubernetes nodes', err));
  window.events?.receive('kubernetes-current-context-nodes-update', (value: unknown) => {
    set(value as KubernetesObject[]);
  });
  return (): void => {
    window
      .kubernetesUnregisterGetCurrentContextResources('nodes')
      .catch((err: unknown) => console.log('Error unregistering Kubernetes nodes', err));
  };
});

export const nodeSearchPattern = writable('');

// The nodes in the current context, filtered with `nodeSearchPattern`
export const kubernetesCurrentContextNodesFiltered = derived(
  [nodeSearchPattern, kubernetesCurrentContextNodes],
  ([$searchPattern, $nodes]) => $nodes.filter(node => findMatchInLeaves(node, $searchPattern.toLowerCase())),
);

// Pods

export const kubernetesCurrentContextPods = readable<KubernetesObject[]>([], set => {
  window
    .kubernetesRegisterGetCurrentContextResources('pods')
    .then(value => set(value))
    .catch((err: unknown) => console.log('Error registering Kubernetes pods', err));
  window.events?.receive('kubernetes-current-context-pods-update', (value: unknown) => {
    set(value as KubernetesObject[]);
  });
  return (): void => {
    window
      .kubernetesUnregisterGetCurrentContextResources('pods')
      .catch((err: unknown) => console.log('Error unregistering Kubernetes pods', err));
  };
});

export const podSearchPattern = writable('');

// The pods in the current context, filtered with `podSearchPattern`
export const kubernetesCurrentContextPodsFiltered = derived(
  [podSearchPattern, kubernetesCurrentContextPods],
  ([$searchPattern, $pods]) => $pods.filter(pod => findMatchInLeaves(pod, $searchPattern.toLowerCase())),
);

// PersistentVolumeClaims

export const kubernetesCurrentContextPersistentVolumeClaims = readable<KubernetesObject[]>([], set => {
  window
    .kubernetesRegisterGetCurrentContextResources('persistentvolumeclaims')
    .then(value => set(value))
    .catch((err: unknown) => console.log('Error registering Kubernetes persistentvolumeclaims', err));
  window.events?.receive('kubernetes-current-context-persistentvolumeclaims-update', (value: unknown) => {
    set(value as KubernetesObject[]);
  });
  return (): void => {
    window
      .kubernetesUnregisterGetCurrentContextResources('persistentvolumeclaims')
      .catch((err: unknown) => console.log('Error unregistering Kubernetes persistentvolumeclaims', err));
  };
});

export const persistentVolumeClaimSearchPattern = writable('');

// The persistent volume claims in the current context, filtered with `persistentVolumeClaimSearchPattern`
export const kubernetesCurrentContextPersistentVolumeClaimsFiltered = derived(
  [persistentVolumeClaimSearchPattern, kubernetesCurrentContextPersistentVolumeClaims],
  ([$searchPattern, $persistentVolumeClaims]) =>
    $persistentVolumeClaims.filter(pvc => findMatchInLeaves(pvc, $searchPattern.toLowerCase())),
);

// Ingresses

export const kubernetesCurrentContextIngresses = readable<KubernetesObject[]>([], set => {
  window
    .kubernetesRegisterGetCurrentContextResources('ingresses')
    .then(value => set(value))
    .catch((err: unknown) => console.log('Error registering Kubernetes ingresses', err));
  window.events?.receive('kubernetes-current-context-ingresses-update', (value: unknown) => {
    set(value as KubernetesObject[]);
  });
  return (): void => {
    window
      .kubernetesUnregisterGetCurrentContextResources('ingresses')
      .catch((err: unknown) => console.log('Error unregistering Kubernetes ingresses', err));
  };
});

export const ingressSearchPattern = writable('');

// The ingresses in the current context, filtered with `ingressSearchPattern`
export const kubernetesCurrentContextIngressesFiltered = derived(
  [ingressSearchPattern, kubernetesCurrentContextIngresses],
  ([$searchPattern, $ingresses]) =>
    $ingresses.filter(ingress => findMatchInLeaves(ingress, $searchPattern.toLowerCase())),
);

// Routes

export const kubernetesCurrentContextRoutes = readable<KubernetesObject[]>([], set => {
  window
    .kubernetesRegisterGetCurrentContextResources('routes')
    .then(value => set(value))
    .catch((err: unknown) => console.log('Error registering Kubernetes routes', err));
  window.events?.receive('kubernetes-current-context-routes-update', (value: unknown) => {
    set(value as KubernetesObject[]);
  });
  return (): void => {
    window
      .kubernetesUnregisterGetCurrentContextResources('routes')
      .catch((err: unknown) => console.log('Error unregistering Kubernetes routes', err));
  };
});

export const routeSearchPattern = writable('');

// ConfigMaps

export const kubernetesCurrentContextConfigMaps = readable<KubernetesObject[]>([], set => {
  window
    .kubernetesRegisterGetCurrentContextResources('configmaps')
    .then(value => set(value))
    .catch((err: unknown) => console.log('Error registering Kubernetes configmaps', err));
  window.events?.receive('kubernetes-current-context-configmaps-update', (value: unknown) => {
    set(value as KubernetesObject[]);
  });
  return (): void => {
    window
      .kubernetesUnregisterGetCurrentContextResources('configmaps')
      .catch((err: unknown) => console.log('Error unregistering Kubernetes configmaps', err));
  };
});

export const configmapSearchPattern = writable('');

// The configmaps in the current context, filtered with `configmapSearchPattern`
export const kubernetesCurrentContextConfigMapsFiltered = derived(
  [configmapSearchPattern, kubernetesCurrentContextConfigMaps],
  ([$searchPattern, $configmaps]) =>
    $configmaps.filter(configmap => findMatchInLeaves(configmap, $searchPattern.toLowerCase())),
);

// Secrets

export const kubernetesCurrentContextSecrets = readable<KubernetesObject[]>([], set => {
  window
    .kubernetesRegisterGetCurrentContextResources('secrets')
    .then(value => set(value))
    .catch((err: unknown) => console.log('Error registering Kubernetes secrets', err));
  window.events?.receive('kubernetes-current-context-secrets-update', (value: unknown) => {
    set(value as KubernetesObject[]);
  });
  return (): void => {
    window
      .kubernetesUnregisterGetCurrentContextResources('secrets')
      .catch((err: unknown) => console.log('Error unregistering Kubernetes secrets', err));
  };
});

export const secretSearchPattern = writable('');

// The secrets in the current context, filtered with `secretSearchPattern`
export const kubernetesCurrentContextSecretsFiltered = derived(
  [secretSearchPattern, kubernetesCurrentContextSecrets],
  ([$searchPattern, $secrets]) => $secrets.filter(secret => findMatchInLeaves(secret, $searchPattern.toLowerCase())),
);

// The routes in the current context, filtered with `routeSearchPattern`
export const kubernetesCurrentContextRoutesFiltered = derived(
  [routeSearchPattern, kubernetesCurrentContextRoutes],
  ([$searchPattern, $routes]) => $routes.filter(route => findMatchInLeaves(route, $searchPattern.toLowerCase())),
);

// Events
export const kubernetesCurrentContextEvents = readable<CoreV1Event[]>([], set => {
  window
    .kubernetesRegisterGetCurrentContextResources('events')
    .then(value => set(value as CoreV1Event[]))
    .catch((err: unknown) => console.log('Error registering Kubernetes events', err));
  window.events?.receive('kubernetes-current-context-events-update', (value: unknown) => {
    set(value as CoreV1Event[]);
  });
  return (): void => {
    window
      .kubernetesUnregisterGetCurrentContextResources('events')
      .catch((err: unknown) => console.log('Error unregistering Kubernetes events', err));
  };
});

// Port Forwarding

export const kubernetesCurrentContextPortForwards = readable<ForwardConfig[]>([], set => {
  window
    .getKubernetesPortForwards()
    .then(value => {
      set(value);
    })
    .catch((err: unknown) => console.log('Error getting port forwarding initial value', err));
  window.events?.receive('kubernetes-port-forwards-update', (value: unknown) => {
    set(value as ForwardConfig[]);
  });
});
