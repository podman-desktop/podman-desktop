---
sidebar_position: 8
title: Testcontainer with Podman
description: Learn how to use Testcontainers with Podman and how to create basic tests using this techonology!
keywords: [podman, containers, testcontainers]
tags: [podman, containers, testcontainers, tests]
---

![plane](img/testcontainers.png)

# What are Testcontainer

[Testcontainer](https://testcontainers.com/) is an open source library that allows you to test anything that you can create container of modules. Those modules are preconfigured dependencies such as Databses, various Cloud technologies, or Message Brookers.

Besides that, Testcontainer support various languages in which you can easily write your tests, such as Python, Go, Rust, Ruby, JavaScript, .NET, Java and others.

## Common use cases with Testcontainer

Thanks to container, you are able to get fresh, clean instance without any complex setup for use cases such as:

- Data access layer integration tests
- UI/Acceptance tests
- Application integration tests

# Setup Testcontainers with Podman

First step is creating `.testcontainers.properities` file in your home directory for global congifuration, or in current directory as a local configuration. This file is the config file for your Testcontainers, in order to use Podman insted of Docker (works out of the box), you just need pass those line into the config file:

```.testcontainers.properties
testcontainers.container.runtime=podman
```

and exporting `DOCKER_HOST` env variable by running:

- MacOS

```shell-shession
export DOCKER_HOST=unix://$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
```

- Linux:

```shell-shession
export DOCKER_HOST=unix://${XDG_RUNTIME_DIR}/podman/podman.sock
```

## Creating project

In this example I'm going to use Redis service and Redis module form Testcontainers. You can create project and installing all the dependencies by running those commands:

- Initializing project

```shell-shession
$ npm init -y
```

- Installing dependencies

```shell-shession
$ npm install testcontainers vitest @testcontainers/redis redis --save-dev
```

- Updating package.json file

```package.json
...
  "scripts": {
    "test": "vitest"
  },
...
```

- Creating basic CRUD operations using Redis NodeJS library

```index.ts
import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | undefined = undefined;

export async function connectRedis(url: string) {
    redisClient = createClient({ url });
    await redisClient.connect();
    return redisClient;
}

export async function setValue(key: string, value: string): Promise<string | null> {
    if (!redisClient) {
        throw new Error('Redis client is not connected');
    }
    return await redisClient.set(key, value);
}

export async function getValue(key: string): Promise<string | null> {
    if (!redisClient) {
        throw new Error('Redis client is not connected');
    }
    return redisClient.get(key);
}

export async function deleteValue(key: string[]): Promise<number> {
    if (!redisClient) {
        throw new Error('Redis client is not connected');
    }
    return await redisClient.del(key);
}

export async function disconnectRedis() {
    if (redisClient) {
        await redisClient.quit();
        redisClient = undefined;
    }
}
```

- Creating basic tests for CRUD operations

```index.spec.ts
import { afterAll, beforeAll, beforeEach, expect, test } from "vitest";
import { connectRedis, deleteValue, disconnectRedis, getValue, setValue } from ".";
import { RedisContainer } from "@testcontainers/redis";
import { Wait } from "testcontainers";
import { createClient } from "redis";

beforeAll(() => {
    new RedisContainer()
        .withExposedPorts(6379)
        .withWaitStrategy(Wait.forLogMessage("Ready to accept connections"))
        .start();

    connectRedis(`redis://localhost:6379`);
});

afterAll(() => {
    disconnectRedis();
});

beforeEach(async () => {
    // Flushind DB and adding to Redis some values before each test
    const client = createClient({ url:`redis://localhost:6379` });
    await client.connect();

    await client.flushDb();
    await client.set('preset-key', 'preset-value');
    await client.set('preset-key1', 'preset-value1');
    await client.quit();
});

test("set value on server", async () => {
    // Set value
    const ret = await setValue("key", "value");
    expect(ret).toBe("OK");

    // Update value
    const ret1 = await setValue("key", "updated-value");
    expect(ret1).toBe("OK");
});

test("get value from server", async () => {
    // Get preset value
    const value = await getValue("preset-key");
    expect(value).toBe("preset-value");

    // Get not existing value
    const value1 = await getValue("key");
    expect(value1).toBeNull();
});

test("delete value on server", async () => {
    // Delete two records in a same time
    const res = await deleteValue(["preset-key", "preset-key1"]);
    expect(res).toBe(2);

    // Delete not existing record
    const res1 = await deleteValue(["key"]);
    expect(res1).toBe(0);
});
```

## Running tests

When runnig Testcontainers for a first time I hightly advice to run the tests in DEBUG mode using this command:

```shell-shession
$ DEBUG=testcontainers* npm test
```

Then you should be able to see lines such as:

```console
testcontainers [DEBUG] Loading ".testcontainers.properties" file...
testcontainers [DEBUG] Loaded ".testcontainers.properties" file
testcontainers [DEBUG] Found custom configuration: dockerHost: "unix:///run/user/1000//podman/podman.sock
```

Those lines means that the config file was found by Testcontainers and that containers are using Podman engine instead of Docker.
