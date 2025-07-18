#!/usr/bin/env tsx
/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { Octokit } from '@octokit/rest';
import { components } from '@octokit/openapi-types';
import * as fs from 'fs';
import mustache from 'mustache';

export type Issue = components['schemas']['issue'];
export type Milestone = components['schemas']['milestone'];

export interface HighlightedPR {
  title: string;
  shortDesc: string;
  longDesc: string;
}

export interface Author {
  username: string;
  link: string;
}

export interface PRInfo {
  title: string;
  author: Author;
  number: number;
  link: string;
  created_at?: string;
}

export interface PRCategory {
  category: string;
  prs: PRInfo[];
}

export class ReleaseNotesPreparator {
  private octokit;
  constructor(
    private token: string,
    private organization: string,
    private repo: string,
    private milestone: string,
    private username: string,
    private model: string | undefined,
    private port: string,
    private endpoint: string,
    private useOllama: boolean,
  ) {
    this.octokit = new Octokit({ auth: token });
  }

  protected async generateMD(
    changelog: PRCategory[],
    firstTimeContributors: PRInfo[],
    highlighted: HighlightedPR[],
  ): Promise<void> {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    const version = this.milestone.slice(0, -2);
    const releaseNotesTemplate = await fs.promises.readFile('./scripts/release-notes/release-notes.mustache', 'utf8');

    // Sorting changelog
    const priorityOrder = ['feat', 'fix', 'chore'];
    changelog = changelog.sort((a, b) => {
      const priorityA = priorityOrder.indexOf(a.category) === -1 ? Infinity : priorityOrder.indexOf(a.category);

      const priorityB = priorityOrder.indexOf(b.category) === -1 ? Infinity : priorityOrder.indexOf(b.category);

      return priorityA - priorityB;
    });

    const renderedMarkdown = mustache.render(releaseNotesTemplate, {
      firstTimeContributors: firstTimeContributors,
      changelog: changelog,
      highlighted: highlighted,
      version: version,
      username: this.username,
    });
    const filename = `website/blog/${formattedDate}-release-${version}.md`;
    await fs.promises.writeFile(filename, renderedMarkdown, {
      flag: 'w+',
    });
    console.log(`${filename} was created!`);
  }

  // Count all PRs in given milestone for each user
  protected async getMilestonePRs(prs: Issue[]): Promise<{ [key: string]: number }> {
    const result: { [key: string]: number } = {};
    for (const issue of prs) {
      if (issue.pull_request) {
        const author = issue.user?.login;
        if (author) {
          if (!result[author]) result[author] = 0;
          result[author]++;
        }
      }
    }
    return result;
  }

  protected async isNewContributor(username: string, contributorsMap, milestoneCommits): Promise<boolean> {
    const totalCommits = contributorsMap[username] || 0;
    const milestoneCount = milestoneCommits[username] || 0;
    return totalCommits === milestoneCount && totalCommits > 0;
  }

  protected async getFirstTimeContributors(prs: Issue[]): Promise<PRInfo[]> {
    const firstTimeContributorsMap: { [username: string]: PRInfo } = {};
    // Get all contibutors in repo
    const contributors = await this.octokit.rest.repos.listContributors({
      owner: this.organization,
      repo: this.repo,
      per_page: 100,
    });

    const contributorsMap = contributors.data.reduce((acc: { [key: string]: number }, contributor) => {
      if (contributor.login) {
        acc[contributor.login] = contributor.contributions;
      }
      return acc;
    }, {});

    const usersMilestonePRs = await this.getMilestonePRs(prs);

    for (const pr of prs) {
      if (!pr.user) continue;
      const username = pr.user.login;

      const isNewContributor = await this.isNewContributor(username, contributorsMap, usersMilestonePRs);
      if (!isNewContributor) continue;

      const newPRInfo: PRInfo = {
        title: pr.title,
        author: {
          username: username,
          link: pr.user.html_url,
        },
        number: pr.number,
        link: pr.html_url,
        created_at: pr.created_at,
      };

      if (firstTimeContributorsMap[username]) {
        // Get only the oldest one
        if (
          new Date(newPRInfo.created_at as string) > new Date(firstTimeContributorsMap[username].created_at as string)
        ) {
          firstTimeContributorsMap[username] = newPRInfo;
        }
      } else {
        firstTimeContributorsMap[username] = newPRInfo;
      }
    }

    return Object.values(firstTimeContributorsMap);
  }

  protected async getPRsByMilestone(owner: string, repo: string, milestoneTitle: string): Promise<Issue[]> {
    // Get all Milestones
    const { data: milestones } = await this.octokit.rest.issues.listMilestones({
      owner,
      repo,
    });

    const milestone: Milestone = milestones.find(m => m.title === milestoneTitle);
    if (!milestone) {
      throw new Error(
        `Milestone '${milestoneTitle}' was not found in: [${milestones.map(milestone => milestone.title)}]`,
      );
    }

    let page = 1;
    let prs: Issue[] = [];
    while (true) {
      const { data: issues } = await this.octokit.rest.issues.listForRepo({
        owner,
        repo,
        milestone: milestone.number.toString(),
        state: 'closed',
        per_page: 100,
        page: page,
      });

      if (issues.length === 0) break;
      prs.push(...issues);
      page++;
    }

    // Filter our only PRs and PRs created by an user
    prs = prs.filter(
      issue =>
        issue.pull_request &&
        issue.user &&
        issue.user.type !== 'Bot' &&
        issue.user.login !== 'podman-desktop-bot' &&
        issue.user.login !== 'step-security-bot',
    );

    return prs;
  }

  protected async fetchDataFromService(content: string): Promise<HighlightedPR[]> {
    const schema = {
      type: 'object',
      properties: {
        prs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              shortDesc: { type: 'string' },
              longDesc: { type: 'string' },
            },
            required: ['title', 'shortDesc', 'longDesc'],
          },
        },
      },
      required: ['prs'],
    };

    const prompt = `You are given a changelog or release note text that includes multiple product updates or features.

Your task is to extract and rewrite the most notable individual features from the text. For each of them, generate a new JSON object with the following structure:

{
  "title": string,             // A short and original title (no colons or prefix like "Title:" or "Feature:")
  "shortDesc": string,         // A short summary of the feature in 1–2 sentences
  "longDesc": string           // A more detailed explanation in 2–4 sentences
}

Be concise, creative, and do not repeat the same phrases across multiple items. Do not refer to the original PR or changelog directly. Rewrite in a natural user-facing tone, suitable for a changelog or release blog post.

If the input contains bullet points or grouped features, extract each as a separate feature when relevant.

⚠️ Return **a JSON array of at most 5 objects** — choose the 5 most interesting, relevant, or user-impacting items.

Here are a few examples of the expected output format:

[
  {
    "title": "Kubernetes improvements with a new dashboard",
    "shortDesc": "A new landing screen for Kubernetes has been added with UI changes that gives an overview of your entire cluster.",
    "longDesc": "We have updated the Kubernetes dashboard page to provide a quick overview of a user's Kubernetes cluster, alongside with multiple changes to Kubernetes backend."
  },
  {
    "title": "Port forwarding for pods",
    "shortDesc": "This new feature allows users to configure port forwarding in their Kubernetes environment.",
    "longDesc": "Podman Desktop now supports port forwarding for pods in Kubernetes environments. Port forwarding can be done from the pod detail page and then visible in the Port forwarding page."
  },
  {
    "title": "Experimental Features",
    "shortDesc": "A new 'Experimental' section in the Settings provides the list of current experiments, and links to related discussions.",
    "longDesc": "In Podman Desktop v1.16, experimental features are now grouped into a dedicated section in the Settings, making them easier to discover and manage. Each experiment includes a link to its discussion page for feedback and iteration."
  },
  {
    "title": "Providers appear in the Status Bar",
    "shortDesc": "Providers are moved from Dashboard to Status Bar, to increase their visibility (experimental feature).",
    "longDesc": "When this experimental option is enabled, provider status is shown directly in the status bar. This helps users see at a glance whether a provider is active and whether it’s running or stopped."
  },
  {
    "title": "Prune only untagged images",
    "shortDesc": "Choose to prune 'All untagged images' or 'All unused images' when pruning images.",
    "longDesc": "Image pruning is now more flexible. Users can decide whether to remove only untagged images or all unused ones, providing more control over cleanup operations."
  }
]

DATA:
${content}
`;
    let body;
    if (this.useOllama) {
      body = {
        model: this.model,
        stream: false,
        prompt: prompt,
        format: schema,
      };
    } else {
      body = {
        model: 'AI Lab model',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that returns only JSON containing exactly with the provided schema with property "prs" which is an array of objects descirbed in the prompt. In the response dont adress the content as a "This PR" etc. adress it like it is a feature or fix',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: {
          type: 'json_object',
          schema: schema,
        },
      };
    }

    return await fetch(`http://localhost:${this.port}${this.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(async response => {
        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          return [];
        }

        try {
          if (this.useOllama) {
            return JSON.parse((await response.json()).response).prs;
          } else {
            return JSON.parse((await response.json()).choices[0].message.content).prs;
          }
        } catch (e: unknown) {
          // We didn't get data from correct JSON format
          console.error(
            `Got error ${e}.\nGenerated data from AI was not valid JSON format, generating release notes without highlights.`,
          );
          return [];
        }
      })
      .then(async result => {
        return result as HighlightedPR[];
      })
      .catch(async (error: unknown) => {
        console.error(
          `Got error ${error}.\nThere was a problem when generating highlited PRs. Generating release notes without highlights.`,
        );
        return [];
      });
  }

  protected async includeDataFromIssue(owner: string, repo: string, pr: Issue): Promise<Issue> {
    // Tries to find "Closes #12345" or "Fixes #42"
    const issueMatch = pr.body?.match(/(Closes|Fixes)\s#\d+/i);
    if (!issueMatch) return pr;

    const issueNumber = issueMatch[0].split('#')[1];
    const response = await this.octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    if (response && response.data) return { ...pr, body: response.data.body + pr.body };
    return pr;
  }

  async generate(): Promise<void> {
    let prs: Issue[] = await this.getPRsByMilestone(this.organization, this.repo, this.milestone);
    const firstTimeContributorPRs = await this.getFirstTimeContributors(prs);
    const categorizedPRsMap: Record<string, PRCategory> = {};

    for (let i = 0; i < prs.length; i++) {
      const pr = prs[i];
      const match = pr.title.match(/^\s*(chore|feat|docs|fix|refactor|test|ci)/i);
      if (!match) {
        // Skip others
        continue;
      }

      if (!pr.user) {
        continue;
      }

      let category = match[1].toLowerCase();

      // e.g. chore(test): or feat(tests):
      const matchTest = pr.title.match(/\(test/i);
      if (matchTest) {
        category = 'test';
      }

      const prInfo: PRInfo = {
        title: pr.title,
        author: {
          username: pr.user.login,
          link: pr.user.html_url,
        },
        number: pr.number,
        link: pr.html_url,
      };

      if (!categorizedPRsMap[category]) {
        categorizedPRsMap[category] = {
          category: category,
          prs: [],
        };
      }

      // Update PR bodu with desc from issue which it closes/fixes
      prs[i] = await this.includeDataFromIssue(this.organization, this.repo, pr);

      categorizedPRsMap[category].prs.push(prInfo);
    }

    const changelog: PRCategory[] = Object.values(categorizedPRsMap);

    // Generating highlighted features
    prs = prs.map(pr => ({ ...pr, body: pr.body ? pr.body.replace(/### Screenshot \/ video of UI[\s\S]*/, '') : '' }));
    const features = prs.filter(
      issue => (issue.pull_request && issue.title.startsWith('feat')) || issue.title.startsWith('chore'),
    );
    const content = features.map((pr, index) => `PR${index + 1}: ${pr.title} - ${pr.body}\n}`).join('');

    let result: HighlightedPR[] = await this.fetchDataFromService(content);
    await this.generateMD(changelog, firstTimeContributorPRs, result);
  }
}
