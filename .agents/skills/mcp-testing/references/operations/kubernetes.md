# Kubernetes Operations

## Navigation

| Target          | Selector                                                     |
| --------------- | ------------------------------------------------------------ |
| Kubernetes page | `nav[aria-label="AppNavigation"] a[aria-label="Kubernetes"]` |

## Page Structure

### KubernetesBar (sidebar)

```
nav[aria-label="Kubernetes Navigation Bar"]
├── a:has-text("Dashboard")
├── a:has-text("Nodes")
├── a:has-text("Pods")
├── a:has-text("Deployments")
├── a:has-text("Services")
├── a:has-text("Ingresses & Routes")
├── a:has-text("Persistent Volume Claims")
├── a:has-text("ConfigMaps & Secrets")
├── a:has-text("Jobs")
├── a:has-text("CronJobs")
└── a:has-text("Port Forwarding")
```

### KubernetesResourcePage (shared for all resource types)

```
[role="region"][aria-label="{resourceType}"]
├── [role="region"][aria-label="header"]
│   ├── [role="heading"]
│   └── [role="group"][aria-label="additionalActions"]
│       └── button:has-text("Apply YAML")
└── [role="region"][aria-label="content"]
    └── [role="table"]
        └── [role="row"][aria-label="{resourceName}"]
```

## Locators

### KubernetesBar

| Element     | Selector                                                                             |
| ----------- | ------------------------------------------------------------------------------------ |
| Kube nav    | `nav[aria-label="Kubernetes Navigation Bar"]`                                        |
| Dashboard   | `nav[aria-label="Kubernetes Navigation Bar"] a:has-text("Dashboard")`                |
| Nodes       | `nav[aria-label="Kubernetes Navigation Bar"] a:has-text("Nodes")`                    |
| Pods        | `nav[aria-label="Kubernetes Navigation Bar"] a:has-text("Pods")`                     |
| Deployments | `nav[aria-label="Kubernetes Navigation Bar"] a:has-text("Deployments")`              |
| Services    | `nav[aria-label="Kubernetes Navigation Bar"] a:has-text("Services")`                 |
| Ingresses   | `nav[aria-label="Kubernetes Navigation Bar"] a:has-text("Ingresses & Routes")`       |
| PVCs        | `nav[aria-label="Kubernetes Navigation Bar"] a:has-text("Persistent Volume Claims")` |
| ConfigMaps  | `nav[aria-label="Kubernetes Navigation Bar"] a:has-text("ConfigMaps & Secrets")`     |
| Jobs        | `nav[aria-label="Kubernetes Navigation Bar"] a:has-text("Jobs")`                     |
| CronJobs    | `nav[aria-label="Kubernetes Navigation Bar"] a:has-text("CronJobs")`                 |
| Port Fwd    | `nav[aria-label="Kubernetes Navigation Bar"] a:has-text("Port Forwarding")`          |

### KubernetesContextPage

| Element           | Selector                                                             |
| ----------------- | -------------------------------------------------------------------- |
| Title             | `[aria-label="Title"]`                                               |
| Contexts table    | `[aria-label="Contexts"]`                                            |
| Context row       | `[aria-label="Contexts"] [aria-label="{contextName}"]`               |
| Current context   | `[aria-label="{contextName}"] [aria-label="Current Context"]`        |
| Context reachable | `[aria-label="{contextName}"] [aria-label="Context Reachable"]`      |
| Set as current    | `[aria-label="{contextName}"] [aria-label="Set as Current Context"]` |
| Delete context    | `[aria-label="{contextName}"] [aria-label="Delete Context"]`         |
| Duplicate context | `[aria-label="{contextName}"] [aria-label="Duplicate Context"]`      |
| Edit context      | `[aria-label="{contextName}"] [aria-label="Edit Context"]`           |
| No contexts       | `[role="heading"]:has-text("No Kubernetes contexts found")`          |

### Edit Context Dialog

| Element            | Selector                                                                |
| ------------------ | ----------------------------------------------------------------------- |
| Dialog             | `[role="dialog"][aria-label="Edit Context"]`                            |
| Context name input | `[role="dialog"][aria-label="Edit Context"] [aria-label="contextName"]` |
| Save button        | `[role="dialog"][aria-label="Edit Context"] button:has-text("Save")`    |

### KubernetesDashboardPage

| Element              | Selector                                                           |
| -------------------- | ------------------------------------------------------------------ |
| Namespace dropdown   | `[aria-label="Kubernetes Namespace"]`                              |
| Namespace button     | `[aria-label="Kubernetes Namespace"] button:has-text("Namespace")` |
| Hidden input (value) | `[aria-label="Kubernetes Namespace"] [aria-label="hidden input"]`  |

### KubernetesResourcePage (shared)

| Element           | Selector                                                              |
| ----------------- | --------------------------------------------------------------------- |
| Apply YAML button | `[aria-label="additionalActions"] button:has-text("Apply YAML")`      |
| Resource row      | `[role="row"][aria-label="{resourceName}"]`                           |
| Delete (row)      | `[role="row"][aria-label="{resourceName}"] button:has-text("Delete")` |

## Operations

### Navigate to Kubernetes

1. Navigate: `click('nav[aria-label="AppNavigation"] a[aria-label="Kubernetes"]')`
2. Wait for kube nav: `wait('nav[aria-label="Kubernetes Navigation Bar"]')`

### Navigate to Kubernetes section

1. Navigate to Kubernetes (steps 1-2)
2. Click section: `click('nav[aria-label="Kubernetes Navigation Bar"] a:has-text("{sectionName}")')`

### View Kubernetes contexts

Contexts are NOT in the Kubernetes sidebar nav. Access them via the status bar:

1. Click context in status bar: `click('[title="Current Kubernetes context"]')`
2. Wait for contexts: `wait('[aria-label="Contexts"]')`

### Set current context

1. View Kubernetes contexts (steps 1-3)
2. Click Set as current: `click('[aria-label="{contextName}"] [aria-label="Set as Current Context"]')`

### Edit context

1. View Kubernetes contexts
2. Click Edit: `click('[aria-label="{contextName}"] [aria-label="Edit Context"]')`
3. Wait for dialog: `wait('[role="dialog"][aria-label="Edit Context"]')`
4. Fill name: `fill('[role="dialog"][aria-label="Edit Context"] [aria-label="contextName"]', '{newName}')`
5. Click Save: `click('[role="dialog"][aria-label="Edit Context"] button:has-text("Save")')`

### Delete context

1. View Kubernetes contexts
2. Click Delete: `click('[aria-label="{contextName}"] [aria-label="Delete Context"]')`

### Change namespace

1. Navigate to Kubernetes Dashboard
2. Click namespace dropdown: `click('[aria-label="Kubernetes Namespace"] button:has-text("Namespace")')`
3. Click the namespace option: `click('[aria-label="Kubernetes Namespace"] button:has-text("{namespace}")')`

### Apply YAML to cluster

1. Navigate to any Kubernetes resource page
2. Click Apply YAML: `click('[aria-label="additionalActions"] button:has-text("Apply YAML")')`

### Check current namespace

```
getAttribute('[aria-label="Kubernetes Namespace"] [aria-label="hidden input"]', 'value')
```

## Gotchas

- Kubernetes page has its own sub-navigation (`Kubernetes Navigation Bar`), separate from main nav and settings nav
- Context operations require a valid kubeconfig — without one, the page shows "No Kubernetes contexts found"
- The namespace dropdown uses a hidden input to store the selected value
- Resource pages (Pods, Deployments, etc.) share the same structure — only the data differs
- "Set as Current Context" is only visible on non-current contexts
- Contexts page is NOT in the Kubernetes sidebar nav — access it from the status bar
