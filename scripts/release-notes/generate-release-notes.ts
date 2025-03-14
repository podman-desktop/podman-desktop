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
import dotenv from 'dotenv';
import * as fs from 'fs';
import mustache from 'mustache';

dotenv.config();

const { GITHUB_TOKEN, GITHUB_USER } = process.env;
const REPO_OWNER = 'podman-desktop';
const REPO_NAME = 'podman-desktop';
const MILESTONE = '1.18.0';
const BRANCH_NAME = '';
const BASE_BRANCH = '';

interface HighlitedPR {
  name: string;
  shortDesc: string;
  longDesc: string;
}

interface PRInfo {
  prTitle: string;
  prAuthor: string;
  prNumber: number;
  prLink: string;
}

interface PRCategory {
  prCategory: string;
  prs: PRInfo;
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function generateMD(content: HighlitedPR[]): Promise<void> {
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];

  const version = MILESTONE.slice(0, -2);
  const releaseNotesTemplate = fs.readFileSync('./scripts/release-notes/release-notes.mustache', 'utf8');
  console.log(releaseNotesTemplate);
  const renderedMarkdown = mustache.render(releaseNotesTemplate, { content, version: version, username: GITHUB_USER });

  await fs.promises.writeFile(`website/blog/${formattedDate}-release-${version}.md`, renderedMarkdown, {
    flag: 'w+',
  });
}

async function isFirstTimeContributor(owner: string, repo: string, username: string) {
  const { data: commits } = await octokit.rest.repos.listCommits({
    owner,
    repo,
    author: username,
    per_page: 1,
  });

  return commits.length === 0;
}

async function getFirstTimeContributors(owner: string, repo: string, milestoneNumber: string) {
  const prs = await getPRsByMilestone(owner, repo, milestoneNumber);
  const firstTimeContributors: string[] = [];

  for (const pr of prs) {
    const username = pr.user?.login;
    if (!username) continue;

    const isFirstTime = await isFirstTimeContributor(owner, repo, username);
    if (isFirstTime) {
      firstTimeContributors.push(username);
    }
  }

  return firstTimeContributors;
}

async function getClosedIssuesByPR(owner: string, repo: string, prNumber: number) {
  const { data: events } = await octokit.rest.issues.listEventsForTimeline({
    owner,
    repo,
    issue_number: prNumber,
  });

  const closedIssues = events
    .filter(event => event.event === 'closed' && event.commit_id)
    .map(event => event.issue?.number);

  return closedIssues.filter((issue): issue is number => issue !== undefined);
}

async function getIssueLabels(owner: string, repo: string, issueNumber: number) {
  const { data: issue } = await octokit.rest.issues.get({
    owner,
    repo,
    issue_number: issueNumber,
  });

  return issue.labels.map(label => (typeof label === 'string' ? label : label.name));
}

async function categorizePRsByLabels(owner: string, repo: string, milestoneNumber: string) {
  const prs = await getPRsByMilestone(owner, repo, milestoneNumber);
  const categorizedPRs: Record<string, string[]> = {};

  for (const pr of prs) {
    const prNumber = pr.number;
    const closedIssues = await getClosedIssuesByPR(owner, repo, prNumber);

    for (const issueNumber of closedIssues) {
      const labels = await getIssueLabels(owner, repo, issueNumber);

      for (const label of labels) {
        if (!categorizedPRs[label]) {
          categorizedPRs[label] = [];
        }
        categorizedPRs[label].push(`#${prNumber}`);
      }
    }
  }

  return categorizedPRs;
}

categorizePRsByLabels(REPO_OWNER, REPO_NAME, MILESTONE).then(category => console.log(category));

async function getPRsByMilestone(owner: string, repo: string, milestoneTitle: string) {
  // Get all Milestones
  const { data: milestones } = await octokit.rest.issues.listMilestones({
    owner,
    repo,
  });

  const milestone = milestones.find(m => m.title === milestoneTitle);
  if (!milestone) {
    console.error(
      `Milestone '${milestoneTitle}' was not found in: `,
      milestones.map(milestone => milestone.title),
    );
    return [];
  }

  let page = 1;
  let prs = [];
  while (true) {
    console.log('Atempting ', page, 'st download');
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      milestone: milestone.number.toString(),
      state: 'closed',
      per_page: 100,
      page: page,
    });

    if (issues.length === 0) break;
    prs.push(...issues);
    console.log('downloaded ', issues.length, 'issues');
    page++;
  }

  // Filter our only PRs and PRs created by an user
  prs = prs.filter(
    issue => issue.pull_request && issue.user.type !== 'Bot' && issue.user.login !== 'podman-desktop-bot',
  );

  console.log(prs.length);
  return prs;
}

getPRsByMilestone(REPO_OWNER, REPO_NAME, MILESTONE).then(async prs => {
  console.log(
    'PRs in milestone:',
    prs.map(pr => pr.title),
  );
  console.log(prs[0]);

  const firstTimeContributors = await getFirstTimeContributors(REPO_OWNER, REPO_NAME, MILESTONE);
  console.log(firstTimeContributors);
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  prs = prs.map(pr => ({ ...pr, body: pr.body.replace(/### What issues does this PR fix or reference\?[\s\S]*/, '') }));

  const featAndChorePRs = prs.filter(
    issue =>
      issue.pull_request &&
      !issue.title.startsWith('docs') &&
      !issue.title.startsWith('fix') &&
      !issue.title.startsWith('refactor') &&
      !issue.title.startsWith('test') &&
      !issue.title.startsWith('chore(test'),
  );
  const content = featAndChorePRs.map((pr, index) => `PR${index + 1}: ${pr.title} - ${pr.body}\n}`).join('\n\n');

  // console.log(content);

  const data: HighlitedPR[] = [
    {
      name: 'aaa',
      shortDesc: 'short description aaaa',
      longDesc: 'long description aaa',
    },
    {
      name: 'bbb',
      shortDesc: 'short description bbb',
      longDesc: 'long description bbb',
    },
  ];

  await generateMD(data);
  const raw = JSON.stringify({
    messages: [
      {
        content:
          'Get me a brew summary of most exciting from 3 to 5 PRs (pick only few of them). Each summary should have at most 5 sentences and should contain the title (name of the feature dont copy just the title) of the sumary. Try to make the sentence like: - **Experimental Features**: a new Experimental section in the Settings provides the list of current experiments, and links to related discussions. and Long desc will be Previous versions of Podman Desktop introduced some experimental features, which were activable from the Settings. In Podman Desktop v1.16, these Experimental Features are visible in the new Experimental section of the Settings, and dedicated Discussion pages have been created and can be accessed from this section.',
        role: 'system',
      },
      {
        content: content,
        role: 'user',
      },
    ],
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 600000);

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
    signal: controller.signal,
  };

  console.log('Sending content to AI model');
  fetch('http://localhost:60068/v1/chat/completions', requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => {
      if (error.name === 'AbortError') {
        console.error('Request timed out!');
      } else {
        console.error('Fetch error:', error);
      }
    })
    .finally(() => clearTimeout(timeout));
});
