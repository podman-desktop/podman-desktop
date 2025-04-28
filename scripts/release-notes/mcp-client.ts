/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import readline from 'readline/promises';
import dotenv from 'dotenv';

dotenv.config();

class MCPClient {
  private githubClient: Client;
  private aiLabClient: Client;
  private githubTransport?: StdioClientTransport;
  private aiLabTransport?: StreamableHTTPClientTransport;
  private githubTools = [] as { name: string; description?: string }[];

  constructor() {
    this.githubClient = new Client({ name: 'github-mcp-client', version: '1.0.0' });
    this.aiLabClient = new Client({ name: 'ai-lab-mcp-client', version: '1.0.0' });
  }

  async connectGithub() {
    this.githubTransport = new StdioClientTransport({
      command: 'podman',
      args: [
        'run',
        '-i',
        '--rm',
        '-e',
        `GITHUB_PERSONAL_ACCESS_TOKEN=${process.env.GITHUB_TOKEN}`,
        'ghcr.io/github/github-mcp-server',
      ],
    });
    await this.githubClient.connect(this.githubTransport);

    const { tools } = await this.githubClient.listTools();
    this.githubTools = tools.map(t => ({ name: t.name, description: t.description }));
    console.log(
      'GitHub MCP tools:',
      this.githubTools.map(t => t.name),
    );
  }

  async connectAiLab() {
    const url = process.env.AI_LAB_URL ?? 'http://localhost:45621/v1/chat/completions';
    this.aiLabTransport = new StreamableHTTPClientTransport(new URL(url));
    await this.aiLabClient.connect(this.aiLabTransport);
    console.log(`Connected to AI Lab MCP at ${url}`);
  }

  async processQuery(query: string) {
    const llmResponse = await this.aiLabClient.callTool({
      name: 'chat',
      arguments: { messages: [{ role: 'user', content: query }], tools: this.githubTools },
    });

    let answer = '';
    for (const part of llmResponse.content) {
      if (part.type === 'text') {
        answer += part.text;
      } else if (part.type === 'tool_use') {
        const toolName = part.name!;
        const args = part.input as Record<string, unknown>;
        const toolResult = await this.githubClient.callTool({ name: toolName, arguments: args });
        answer += `\n[Called ${toolName}: ${JSON.stringify(toolResult)}]\n`;
      }
    }
    return answer;
  }

  async chatLoop() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log("MCP CLI (AI Lab + GitHub) ready. Enter request or 'quit'.");

    while (true) {
      const query = await rl.question('\nQuery: ');
      if (query.trim().toLowerCase() === 'quit') break;
      const res = await this.processQuery(query);
      console.log('\nResponse:\n', res);
    }

    rl.close();
  }

  async cleanup() {
    if (this.githubTransport) await this.githubClient.close();
    if (this.aiLabTransport) await this.aiLabClient.close();
  }
}

async function main() {
  const cli = new MCPClient();
  try {
    await cli.connectGithub();
    await cli.connectAiLab();
    await cli.chatLoop();
  } catch (err) {
    console.error(err);
  } finally {
    await cli.cleanup();
    process.exit(0);
  }
}

main();
