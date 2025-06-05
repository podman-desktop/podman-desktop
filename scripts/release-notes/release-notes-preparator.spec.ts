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

import { vi, describe, test, expect, beforeEach } from 'vitest';
import { ReleaseNotesPreparator, HighlitedPR, PRCategory, PRInfo } from './release-notes-preparator';
import { Octokit } from '@octokit/rest';
import * as fsOriginal from 'fs';
import mustache from 'mustache';
import { components } from '@octokit/openapi-types';

type Issue = components['schemas']['issue'];
type Milestone = components['schemas']['milestone'];
type Contributor = components['schemas']['contributor'];

const fetchMock = vi.fn();

export class TestReleaseNotesPreparator extends ReleaseNotesPreparator {
  generateMD(changelog: PRCategory[], firstTimeContributors: PRInfo[], highlighted: HighlitedPR[]): Promise<void> {
    return super.generateMD(changelog, firstTimeContributors, highlighted);
  }

  getMilestonePRs(prs: Issue[]): Promise<{ [key: string]: number }> {
    return super.getMilestonePRs(prs);
  }

  isNewContributor(username: string, contributorsMap, milestoneCommits): Promise<boolean> {
    return super.isNewContributor(username, contributorsMap, milestoneCommits);
  }

  getFirstTimeContributors(prs: Issue[]): Promise<PRInfo[]> {
    return super.getFirstTimeContributors(prs);
  }

  getPRsByMilestone(owner: string, repo: string, milestoneTitle: string): Promise<Issue[]> {
    return super.getPRsByMilestone(owner, repo, milestoneTitle);
  }

  fetchDataFromService(content: string): Promise<HighlitedPR[]> {
    return super.fetchDataFromService(content);
  }

  includeDataFromIssue(owner: string, repo: string, pr: Issue): Promise<Issue> {
    return super.includeDataFromIssue(owner, repo, pr);
  }
}

vi.mock('@octokit/rest');
vi.mock('mustache');
vi.mock('fs', async () => {
  const actualFs = await vi.importActual<typeof fsOriginal>('fs');
  return {
    ...actualFs,
    promises: {
      ...actualFs.promises,
      writeFile: vi.fn(),
      readFile: vi.fn(),
    },
  };
});

vi.spyOn(global, 'fetch').mockImplementation(() =>
  Promise.resolve({ ok: true, json: fetchMock } as unknown as Response),
);

function createMockIssue(
  id: number,
  title: string,
  userLogin: string,
  userHtmlUrl: string,
  htmlUrl: string,
  createdAt: string,
  body?: string,
  userType: 'User' | 'Bot' = 'User',
): Issue {
  return {
    id,
    number: id,
    title,
    user: {
      login: userLogin,
      html_url: userHtmlUrl,
      type: userType,
    },
    html_url: htmlUrl,
    created_at: createdAt,
    body: body || `Body for PR ${id}`,
    pull_request: {
      url: `https://api.github.com/repos/owner/repo/pulls/${id}`,
      html_url: htmlUrl,
    },
    state: 'closed',
    closed_at: new Date().toISOString(),
  } as unknown as Issue;
}

function createMockContributor(login: string, contributions: number): Contributor {
  return {
    login,
    html_url: `https://github.com/${login}`,
    type: 'User',
    contributions,
  };
}

function createMockMilestone(id: number, title: string, number: number): Milestone {
  return {
    url: `https://api.github.com/repos/owner/repo/milestones/${id}`,
    html_url: `https://github.com/owner/repo/milestone/${id}`,
    id,
    number,
    title,
  } as unknown as Milestone;
}

let mockOctokitInstance;
let preparator: TestReleaseNotesPreparator;
const mockToken = 'test-token';
const mockOrg = 'test-org';
const mockRepo = 'test-repo';
const mockMilestoneName = '1.0.0';
const mockUsername = 'test-user';
const mockModel = 'test-model';
const mockPort = '12345';
const mockEndpoint = '/api/test';

beforeEach(() => {
  vi.clearAllMocks();

  mockOctokitInstance = {
    rest: {
      issues: { listMilestones: vi.fn(), listForRepo: vi.fn(), get: vi.fn() },
      repos: { listContributors: vi.fn() },
    },
    issues: {
      get: vi.fn(),
    },
  };
  vi.mocked(Octokit).mockImplementation(() => mockOctokitInstance);

  preparator = new TestReleaseNotesPreparator(
    mockToken,
    mockOrg,
    mockRepo,
    mockMilestoneName,
    mockUsername,
    mockModel,
    mockPort,
    mockEndpoint,
    false,
  );
});

describe('ReleaseNotesPreparator', () => {
  beforeEach(() => {
    vi.mocked(fsOriginal.promises.readFile).mockResolvedValue('Mustache template content {{version}}');
    vi.mocked(fsOriginal.promises.writeFile).mockResolvedValue(undefined);
    vi.mocked(mustache.render).mockReturnValue('Rendered markdown');
  });

  describe('constructor', () => {
    test('should initialize Octokit with the provided token', () => {
      expect(Octokit).toHaveBeenCalledWith({ auth: mockToken });
    });
  });

  describe('getPRsByMilestone', () => {
    test('should fetch and filter PRs for a given milestone', async () => {
      const milestone1: Milestone = createMockMilestone(1, mockMilestoneName, 1);
      mockOctokitInstance.rest.issues.listMilestones.mockResolvedValue({ data: [milestone1] });
      const pr1 = createMockIssue(
        101,
        'feat: New feature',
        'userA',
        'urlA',
        'htmlA',
        '2023-01-01T00:00:00Z',
        'body',
        'User',
      );
      const pr2 = createMockIssue(
        102,
        'feat: New feature',
        'userA',
        'urlA',
        'htmlA',
        '2023-01-01T00:00:00Z',
        'body',
        'User',
      );
      mockOctokitInstance.rest.issues.listForRepo
        .mockResolvedValue({ data: [] })
        .mockResolvedValueOnce({ data: [pr1, pr2] });
      const prs = await preparator.getPRsByMilestone(mockOrg, mockRepo, mockMilestoneName);
      expect(prs).toEqual([pr1, pr2]);
    });

    test('should throw an error if milestone is not found', async () => {
      mockOctokitInstance.rest.issues.listMilestones.mockResolvedValue({ data: [] });
      await expect(preparator.getPRsByMilestone(mockOrg, mockRepo, 'non-existent')).rejects.toThrow(
        /Milestone 'non-existent' was not found/,
      );
    });
  });

  describe('getFirstTimeContributors', () => {
    test('should identify first-time contributors, keeping the latest PR', async () => {
      const prNew1 = createMockIssue(201, 'feat: First PR', 'newUser', 'urlNew', 'htmlNew', '2023-02-01T10:00:00Z');
      const prNew2 = createMockIssue(202, 'fix: Older PR', 'newUser', 'urlNew', 'htmlNew', '2023-02-01T09:00:00Z');

      mockOctokitInstance.rest.repos.listContributors.mockResolvedValue({
        data: [createMockContributor('newUser', 2)],
      });
      vi.spyOn(preparator, 'getMilestonePRs' as any).mockResolvedValue({ newUser: 2 });
      const firstTimers = await preparator.getFirstTimeContributors([prNew2, prNew1]);
      expect(firstTimers).toHaveLength(1);
      expect(firstTimers[0].author.username).toBe('newUser');
      expect(firstTimers[0].number).toBe(prNew1.number);
    });
  });

  describe('getMilestonePRs', () => {
    test('should count PRs per user', async () => {
      const prA1 = createMockIssue(301, 'feat: A1', 'userA', 'urlA', 'htmlA', '2023-03-01T00:00:00Z');
      const prA2 = createMockIssue(302, 'fix: A2', 'userA', 'urlA', 'htmlA', '2023-03-02T00:00:00Z');
      const counts = await preparator.getMilestonePRs([prA1, prA2]);
      expect(counts).toEqual({ userA: 2 });
    });
  });

  describe('isNewContributor', () => {
    test('should return true if total contributions match milestone and are > 0', async () => {
      expect(await preparator.isNewContributor('newUser', { newUser: 2 }, { newUser: 2 })).toBe(true);
    });

    test('should return false if total contributions do not match milestone', async () => {
      expect(await preparator.isNewContributor('oldUser', { oldUser: 5 }, { oldUser: 2 })).toBe(false);
    });
  });

  describe('includeDataFromIssue', () => {
    test('should prepend issue body if "Closes #issueNum" found', async () => {
      const pr = createMockIssue(401, 'feat: X', 'userX', 'urlX', 'htmlX', '2023-04-01Z', 'Closes #123. PR body.');
      const linkedIssue = createMockIssue(123, 'Linked', 'userY', 'urlY', 'htmlY', '2023-03-01Z', 'Issue body.');
      mockOctokitInstance.issues.get.mockResolvedValue({ data: linkedIssue });
      const updatedPr = await preparator.includeDataFromIssue(mockOrg, mockRepo, pr);
      expect(updatedPr.body).toBe('Issue body.Closes #123. PR body.');
    });

    test('should prepend issue body if "Fixes #issueNum" found', async () => {
      const pr = createMockIssue(401, 'feat: X', 'userX', 'urlX', 'htmlX', '2023-04-01Z', 'Fixes #123. PR body.');
      const linkedIssue = createMockIssue(123, 'Linked', 'userY', 'urlY', 'htmlY', '2023-03-01Z', 'Issue body.');
      mockOctokitInstance.issues.get.mockResolvedValue({ data: linkedIssue });
      const updatedPr = await preparator.includeDataFromIssue(mockOrg, mockRepo, pr);
      expect(updatedPr.body).toBe('Issue body.Fixes #123. PR body.');
    });

    test('should not update issue body if "Closes #issueNum" is not found', async () => {
      const pr = createMockIssue(401, 'feat: X', 'userX', 'urlX', 'htmlX', '2023-04-01Z', 'ABCD PR body.');
      const linkedIssue = createMockIssue(123, 'Linked', 'userY', 'urlY', 'htmlY', '2023-03-01Z', 'Issue body.');
      mockOctokitInstance.rest.issues.get.mockResolvedValue({ data: linkedIssue });
      const updatedPr = await preparator.includeDataFromIssue(mockOrg, mockRepo, pr);
      expect(updatedPr.body).toBe('ABCD PR body.');
    });
  });

  describe('fetchDataFromService', () => {
    const content = 'PR1: ...';
    const hlPRs = [{ title: 'HL1', shortDesc: 's', longDesc: 'l' }];

    test('should fetch for AI Lab model', async () => {
      fetchMock.mockResolvedValue({ choices: [{ message: { content: JSON.stringify({ prs: hlPRs }) } }] });
      const result = await preparator.fetchDataFromService(content);
      expect(result).toEqual(hlPRs);
    });

    test('should return empty array on HTTP error', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 500 });
      expect(await preparator.fetchDataFromService(content)).toEqual([]);
    });
  });

  describe('generateMD', () => {
    test('should read template, render, and write file', async () => {
      await preparator.generateMD([], [], []);
      expect(fsOriginal.promises.readFile).toHaveBeenCalled();
      expect(mustache.render).toHaveBeenCalled();
      expect(fsOriginal.promises.writeFile).toHaveBeenCalled();
    });
  });

  describe('generate', () => {
    test('should orchestrate the release note generation', async () => {
      vi.spyOn(preparator, 'getPRsByMilestone').mockResolvedValue([]);
      vi.spyOn(preparator, 'getFirstTimeContributors').mockResolvedValue([]);
      vi.spyOn(preparator, 'fetchDataFromService').mockResolvedValue([]);
      const mdSpy = vi.spyOn(preparator, 'generateMD').mockResolvedValue(undefined);
      await preparator.generate();
      expect(mdSpy).toHaveBeenCalled();
    });
  });
});
