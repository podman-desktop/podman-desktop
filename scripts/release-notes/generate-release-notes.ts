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

const { GITHUB_TOKEN, GITHUB_USER, API_KEY } = process.env;
const API_URL = "https://granite-8b-code-instruct-maas-apicast-production.apps.prod.rhoai.rh-aiservices-bu.com:443"
const REPO_OWNER = 'podman-desktop';
const REPO_NAME = 'podman-desktop';
const MILESTONE = '1.18.0';

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

async function generateMD(highlitedPRs: HighlitedPR[], prChangelog: PRCategory[]): Promise<void> {
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];

  const version = MILESTONE.slice(0, -2);
  const releaseNotesTemplate = fs.readFileSync('./scripts/release-notes/release-notes.mustache', 'utf8');
  const renderedMarkdown = mustache.render(releaseNotesTemplate, { highlitedPRs: highlitedPRs, prChangelog: prChangelog, version: version, username: GITHUB_USER });

  await fs.promises.writeFile(`website/blog/${formattedDate}-release-${version}.md`, renderedMarkdown, {
    flag: 'w+',
  });
}

async function isFirstTimeContributor(username: string) {
  const { data: commits } = await octokit.rest.repos.listCommits({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    author: username,
    per_page: 1,
  });

  return commits.length === 0;
}

async function getFirstTimeContributors(prs: unknown[]) {
  const firstTimeContributors: string[] = [];

  for (const pr of prs) {
    const username = pr.user.login;
    if (!username) continue;

    const isFirstTime = await isFirstTimeContributor(username);
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

// categorizePRsByLabels(REPO_OWNER, REPO_NAME, MILESTONE).then(category => console.log(category));

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

  console.log("Valid PRs: ", prs.length);
  return prs;
}

async function main () {
  let prs = await getPRsByMilestone(REPO_OWNER, REPO_NAME, MILESTONE);
  // const firstTimeContributors = await getFirstTimeContributors(prs);
  // console.log("First time contributors: ", firstTimeContributors);

  // prs = prs.map(pr => ({ ...pr, body: pr.body.replace(/### What issues does this PR fix or reference\?[\s\S]*/, '') }));

  // const featAndChorePRs = prs.filter(
  //   issue =>
  //     issue.pull_request &&
  //     !issue.title.startsWith('docs') &&
  //     !issue.title.startsWith('fix') &&
  //     !issue.title.startsWith('refactor') &&
  //     !issue.title.startsWith('test') &&
  //     !issue.title.startsWith('chore(test'),
  // );
  // const content = featAndChorePRs.map((pr, index) => `PR${index + 1}: ${pr.title} - ${pr.body}\n}`).join('\n\n');
  // let part = content.slice(0, Math.floor(content.length / 4));
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

  const categorizedPRs = prs.reduce((acc, pr) => {
    const match = pr.title.match(/^(chore|feat|docs|fix|refactor|test|ci)/);
    if (!match) return acc;
    const category = match[0];

    const prInfo: PRInfo = {
      prTitle: pr.title,
      prAuthor: pr.user.login,
      prNumber: pr.number,
      prLink: pr.html_url,
    };
  
    // Pokud kategorie už existuje, přidáme PR do ní, jinak ji vytvoříme
    if (!acc[category]) {
      console.log(acc[category], { prCategory: category, prs: [] })
      acc[category] = { prCategory: category, prs: [] };
    }
    acc[category].prs.push(prInfo);
  
    return acc;
  });

  // const prChangelog: PRCategory[] = prs.map(pr => {
  //   return {
  //     "prTitle": pr.title,
  //     "prAuthor": pr.user.login,
  //     "prNumber": pr.number,
  //     "prLink": pr.html_url
  //   }
  // }));
  const prChangelog: PRCategory[] = Object.values(categorizedPRs);
  console.log(prChangelog[0])
  await generateMD(data, prChangelog);
  console.log(content.length)

  // console.log(part)
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "granite-8b-code-instruct-128k",
      messages: [
        {"role": "system", "content": "You are an AI asistant specialized on generating text based given input (GitHub PRs). I want for you generate title, short description (2 sentences), long description (3-5 sentences), for 3 highlited PRs that I sent in the DATA section, try to be a litle creative and try to fulfill the number of sentences. Those highlited Prs will be showed on blog post. Return those in json format PRs:[{title:string, longDesc: string, shortDesc:string}]"},
        {"role": "user", "content": part}
      ]
    }),
  };
  
  console.log("Sending request to AI model...");
  
  await fetch(`${API_URL}/v1/chat/completions`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => console.log("AI Response:", result.choices))
    .catch((error) => console.error("Fetch error:", error));

  // const myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");

  // const raw = JSON.stringify({
  //   "messages": [
  //     {
  //       "content": "You are a helpful assistant.",
  //       "role": "system"
  //     },
  //     {
  //       "content": "What is the capital of France?",
  //       "role": "user"
  //     }
  //   ]
  // });

  // const requestOptions = {
  //   method: "POST",
  //   headers: myHeaders,
  //   body: raw,
  //   redirect: "follow"
  // };

  // fetch("http://localhost:41575/v1/chat/completions", requestOptions)
  //   .then((response) => response.text())
  //   .then((result) => console.log(result))
  //   .catch((error) => console.error(error));
  };

await main();
