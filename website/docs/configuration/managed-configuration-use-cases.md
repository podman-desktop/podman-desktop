---
sidebar_position: 11
title: Managed configuration use cases
description: Common use cases and examples for enterprise managed configuration.
tags: [podman-desktop, configuration, enterprise, managed, use-cases]
keywords: [podman desktop, configuration, managed, enterprise, examples, use cases]
---

# Managed configuration use cases

As an administrator, you can use managed configuration to enforce specific settings for all users in your organization. Below are some common use cases with example configurations.

## Enforcing proxy settings

Lock proxy configuration to ensure all users route traffic through corporate proxy servers.

```json title="default-settings.json"
{
  "proxy.http": "http://corp-proxy.example.com:8080"
}
```

```json title="locked.json"
{
  "locked": ["proxy.http"]
}
```

## Managing telemetry

Control telemetry settings for compliance or privacy requirements.

```json title="default-settings.json"
{
  "telemetry.enabled": false
}
```

```json title="locked.json"
{
  "locked": ["telemetry.enabled"]
}
```

## Additional resources

- [Configuring a managed user environment](/docs/configuration/managed-configuration)
- [Configuration settings reference](/docs/configuration/settings-reference)
