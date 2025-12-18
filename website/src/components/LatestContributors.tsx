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

import { usePluginData } from '@docusaurus/useGlobalData';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Contributor, GitHubMetadata } from '@site/src/plugins/github-metadata';

import GradientButton from './GradientButton';

interface ContributorCardProps {
  readonly contributor: Contributor;
}

function ContributorCard({ contributor }: ContributorCardProps): JSX.Element {
  return (
    <a
      href={contributor.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-row items-center gap-3 no-underline hover:no-underline group">
      <img
        src={contributor.avatarUrl}
        alt={`${contributor.login}'s avatar`}
        className="w-15 h-15 rounded-full border border-white group-hover:opacity-90 transition-opacity"
      />
      <div className="flex flex-col">
        <span className="text-sky-500 font-semibold">{contributor.login}</span>
        <span className="text-white">
          {contributor.commitCount} {contributor.commitCount === 1 ? 'commit' : 'commits'}
        </span>
      </div>
    </a>
  );
}

export default function LatestContributors(): JSX.Element | null {
  const { latestContributors } = usePluginData('docusaurus-plugin-github-metadata') as GitHubMetadata;

  // Don't render the section if there are no contributors
  if (!latestContributors || latestContributors.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Contributors grid */}
      <div className="flex flex-wrap justify-center gap-8 mb-10">
        {latestContributors.map((contributor: Contributor) => (
          <ContributorCard key={contributor.login} contributor={contributor} />
        ))}
      </div>

      {/* View all contributors button */}
      <div className="flex justify-center">
        <GradientButton href="https://github.com/podman-desktop/podman-desktop/graphs/contributors">
          <FontAwesomeIcon icon={faGithub} className="mr-2" />
          View all contributors
        </GradientButton>
      </div>
    </div>
  );
}
