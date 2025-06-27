---
sidebar_position: 8
title: Testcontainers with Podman
description: Learn how to use Testcontainers with Podman and how to create basic tests using Testcontainers technology!
keywords: [podman, podman-desktop, containers, testcontainers]
tags: [podman, podman-desktop, containers, testcontainers, tests]
---

![plane](img/testcontainers.png)

# What are Testcontainers

[Testcontainers](https://testcontainers.com/) is an open source library that allows you to test any containerized dependencies, such as databases, various cloud technologies, or message brokers. For ease of use, Testcontainers has many preconfigured dependencies called modules.

Besides that, Testcontainers supports various languages in which you can easily write your tests, such as Python, Go, Rust, Ruby, JavaScript, .NET, Java, and others.

## Common use cases with Testcontainers

Thanks to the container technology, you can obtain fresh, clean instances without any complex setup for use cases such as:

- Data access layer integration tests
- UI/Acceptance tests
- Application integration tests

## Setup Testcontainers with Podman

Before we start, you need to have installed [Podman](https://podman.io/) and run it in socket listening:

```shell
$ podman system service --time=0 &
```

Set Testcontainers runtime to Podman by using one of the following options:

- Enable the [Docker Compatibility](https://podman-desktop.io/docs/migrating-from-docker/managing-docker-compatibility) feature.

- Create a `.testcontainers.properties` file in your home directory for global configuration of your Testcontainers and add the following line to the configuration file:
  - MacOS

    ```title=".testcontainers.properties"
    docker.host=unix://$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')
    ```

    Run the following command after configuration:

    ```bash
    $ export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
    ```

  - Linux:

    ```title=".testcontainers.properties"
    docker.host=unix://${XDG_RUNTIME_DIR}/podman/podman.sock
    ```

    :::note

    Every language supported by Testcontainers has different properties supported by the .testcontainers.properties file.

    :::

> **_OPTIONAL:_** If you are running Podman in rootless mode, you must disable Ryuk by defining this environment variable:
>
> ```bash
> $ export TESTCONTAINERS_RYUK_DISABLED=true
> ```

## Creating a project

This example uses the Redis service and Redis module from Testcontainers. You can create a project and install all the dependencies by following the procedure.

1. Initialize a project.

   ```bash
   $ npm init -y
   ```

2. Installing dependencies.

   ```bash
   $ npm install testcontainers vitest @testcontainers/redis redis typescript --save-dev
   ```

3. Update `package.json` file.

   ```json title="package.json"
   ...
       "scripts": {
       "test": "vitest"
       },
   ...
   ```

4. Create basic CRUD operations using the Redis Node.js library.

   ```ts title="index.ts"
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

5. Create basic tests for CRUD operations.

   ```ts title="index.spec.ts"
   import { afterAll, beforeAll, beforeEach, expect, test } from 'vitest';
   import { connectRedis, deleteValue, disconnectRedis, getValue, setValue } from '.';
   import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
   import { Wait } from 'testcontainers';
   import { createClient } from 'redis';

   let container: StartedRedisContainer;

   beforeAll(async () => {
     container = await new RedisContainer()
       .withExposedPorts(6379)
       .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
       .start();

     await connectRedis(`redis://localhost:${container.getMappedPort(6379)}`);
   });

   afterAll(async () => {
     await disconnectRedis();
   });

   beforeEach(async () => {
     // Flushind DB and adding to Redis some values before each test
     const client = createClient({ url: `redis://localhost:${container.getMappedPort(6379)}` });
     await client.connect();

     await client.flushDb();
     await client.set('preset-key', 'preset-value');
     await client.set('preset-key1', 'preset-value1');
     await client.quit();
   });

   test('set value on server', async () => {
     // Set value
     const ret = await setValue('key', 'value');
     expect(ret).toBe('OK');

     // Update value
     const ret1 = await setValue('key', 'updated-value');
     expect(ret1).toBe('OK');
   });

   test('get value from server', async () => {
     // Get preset value
     const value = await getValue('preset-key');
     expect(value).toBe('preset-value');

     // Get not existing value
     const value1 = await getValue('key');
     expect(value1).toBeNull();
   });

   test('delete value on server', async () => {
     // Delete two records in a same time
     const res = await deleteValue(['preset-key', 'preset-key1']);
     expect(res).toBe(2);

     // Delete not existing record
     const res1 = await deleteValue(['key']);
     expect(res1).toBe(0);
   });
   ```

## Running tests

When running Testcontainers for the first time, ensure that you run your tests in `DEBUG` mode by using this command:

```bash
$ DEBUG=testcontainers* npm test
```

Then, you should be able to see lines similar to the ones below:

```
testcontainers [DEBUG] Loading ".testcontainers.properties" file...
testcontainers [DEBUG] Loaded ".testcontainers.properties" file
testcontainers [DEBUG] Found custom configuration: dockerHost: "unix:///run/user/1000//podman/podman.sock
```

Those lines indicate that Testcontainers found the configuration file, and the containers are created on the Podman engine instead of Docker.

## Conclusion

This tutorial provides a basic step-by-step walkthrough using the Testcontainers technology to run a [Redis](https://redis.io/) server with Podman. More examples can be found in the guides of [Testcontainers](https://testcontainers.com/guides/). If you encounter any problems, feel free to open an issue on Podman Desktop's [GitHub](https://github.com/podman-desktop/podman-desktop/issues).
