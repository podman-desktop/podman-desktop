import type { KubernetesContextResources } from '/@api/kubernetes-resources';

import type { IDisposable } from '../../../../main/src/plugin/types/disposable';

export interface KubernetesContextResourcesState {
  [key: string]: KubernetesContextResources[];
}

export async function listenResources(
  resourceNames: string[],
  resources: KubernetesContextResourcesState,
): Promise<IDisposable[]> {
  const disposables: IDisposable[] = [];
  for (const resourceName of resourceNames) {
    disposables.push(
      window.events.receive(`kubernetes-update-${resourceName}`, () => {
        window
          .kubernetesGetResources(resourceName)
          .then(result => {
            resources[resourceName] = result;
          })
          .catch(() => {
            console.log(`error getting ${resourceName}`);
          });
      }),
    );
    resources[resourceName] = await window.kubernetesGetResources(resourceName);
  }
  return disposables;
}
