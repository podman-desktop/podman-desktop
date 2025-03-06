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

type Issue = components['schemas']['issue'];
type Milestone = components['schemas']['milestone'];

interface HighlitedPR {
  title: string;
  shortDesc: string;
  longDesc: string;
}

interface Author {
  username: string;
  link: string;
}

interface PRInfo {
  title: string;
  author: Author;
  number: number;
  link: string;
}

interface PRCategory {
  category: string;
  prs: PRInfo[];
}

class ReleaseNotesPreparator {
  private octokit;
  constructor(
    private token: string,
    private organization: string,
    private repo: string,
    private milestone: string,
    private api_key: string,
    private api_url: string,
    private username: string,
  ) {
    this.octokit = new Octokit({ auth: token });
  }

  private async generateMD(
    changelog: PRCategory[],
    firstTimeContributors: PRInfo[],
    highlighted: HighlitedPR[],
  ): Promise<void> {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    const version = this.milestone.slice(0, -2);
    const releaseNotesTemplate = fs.readFileSync('./scripts/release-notes/release-notes.mustache', 'utf8');
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

  private async isFirstTimeContributor(username: string): Promise<boolean> {
    const { data: commits } = await this.octokit.rest.repos.listCommits({
      owner: this.organization,
      repo: this.repo,
      author: username,
      per_page: 1,
    });

    return commits.length === 0;
  }

  private async getFirstTimeContributors(prs: Issue[]): Promise<PRInfo[]> {
    const firstTimeContributors: PRInfo[] = [];

    for (const pr of prs) {
      if (!pr.user) continue;
      const username = pr.user.login;

      const isFirstTime = await this.isFirstTimeContributor(username);
      if (isFirstTime) {
        firstTimeContributors.push({
          title: pr.title,
          author: {
            username: username,
            link: pr.user.html_url,
          },
          number: pr.number,
          link: pr.html_url,
        });
      }
    }

    return firstTimeContributors ?? undefined;
  }

  private async getPRsByMilestone(owner: string, repo: string, milestoneTitle: string): Promise<Issue[]> {
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
        issue.pull_request && issue.user && issue.user.type !== 'Bot' && issue.user.login !== 'podman-desktop-bot',
    );

    return prs;
  }

  public async generate(): Promise<void> {
    let prs: Issue[] = await this.getPRsByMilestone(this.organization, this.repo, this.milestone);
    const firstTimeContributorPRs = await this.getFirstTimeContributors(prs);

    const categorizedPRsMap: Record<string, PRCategory> = {};

    for (const pr of prs) {
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

      categorizedPRsMap[category].prs.push(prInfo);
    }

    const changelog: PRCategory[] = Object.values(categorizedPRsMap);

    // If the key is not existing skip generating highlited features
    if (!this.api_key) await this.generateMD(changelog, firstTimeContributorPRs, []);

    // Generating highlited features
    prs = prs.map(pr => ({ ...pr, body: pr.body ? pr.body.replace(/### Screenshot \/ video of UI[\s\S]*/, '') : '' }));
    const features = prs.filter(issue => issue.pull_request && issue.title.startsWith('feat'));
    const content = features.map((pr, index) => `PR${index + 1}: ${pr.title} - ${pr.body}\n}`).join('');

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'granite-8b-code-instruct-128k',
        messages: [
          {
            role: 'system',
            content:
              'Instruction: Identify the 3 most interesting PRs from the list provided. For each of them, generate the following: A title (do not copy the original PR title). A short description of exactly 2 sentences. A long description of exactly 3 to 5 sentences. Output format: Return the result in the following JSON structure: [{"title": "Your generated title here","shortDesc": "Your short 2-sentence description here.","longDesc": "Your longer 3–5 sentence description here."},...]',
          },
          { role: 'user', content: content },
        ],
      }),
    };

    await fetch(`${this.api_url}/v1/chat/completions`, requestOptions)
      .then(async response => {
        // We get a valid response
        if (response.ok) {
          try {
            // Here it is pure luck if we get data from right format
            const content = (await response.json()).choices[0].message.content;
            // try to extract the JSON from message
            const match = content.match(/\{[\s\S]*\}/);
            if (match) {
              // We can use the first one, since the AI shoud return just one JSON onject in the text
              console.log('AI model returned JSON in the response, trying to parse it');
              return JSON.parse(match[0]);
            }
            return [];
          } catch (e: unknown) {
            //   // We didn't get data from correct JSON format
            console.error(
              `Got error ${e}.\nGenerated data from AI was not valid JSON format, generating release notes without highlights.`,
            );
            return [];
          }
        }
        return [];
      })
      .then(async result => {
        // Generate the output with highlited features
        await this.generateMD(changelog, firstTimeContributorPRs, result as HighlitedPR[]);
      })
      .catch(async error => {
        // Generate the output without highlited features
        console.error(`Fetch error: ${error}\nGenerating release notes without highlights.`);
        await this.generateMD(changelog, firstTimeContributorPRs, []);
      });
  }
}

async function run(): Promise<void> {
  let token = process.env.GITHUB_TOKEN;
  if (!token) {
    token = process.env.GH_TOKEN;
  }
  const args = process.argv.slice(2);
  let organization = 'podman-desktop';
  let repo = 'podman-desktop';
  let api_key = process.env.API_KEY ?? '';
  let api_url = 'https://granite-8b-code-instruct-maas-apicast-production.apps.prod.rhoai.rh-aiservices-bu.com:443';
  let milestone: string = '';
  let username = process.env.GITHUB_USERNAME;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--token') {
      token = args[++i];
    } else if (args[i] === '--org') {
      organization = args[++i];
    } else if (args[i] === '--api_key') {
      api_key = args[++i];
    } else if (args[i] === '--api_url') {
      api_url = args[++i];
    } else if (args[i] === '--repo') {
      repo = args[++i];
    } else if (args[i] === '--username') {
      username = args[++i];
    } else if (args[i] === '--milestone') {
      milestone = args[++i];
    }
  }
  if (token && username) {
    await new ReleaseNotesPreparator(token, organization, repo, milestone, api_key, api_url, username).generate();
  } else {
    console.log('No token or username found. Use either GITHUB_TOKEN, GITHUB_USERNAME or pass it as an argument');
  }
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
