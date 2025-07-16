import type { Plugin } from '@docusaurus/types';

import type { GitHubMetadata } from './github-metadata';
import { GitHubService } from './github-service';

export default async function githubMetadataPlugin(): Promise<Plugin<GitHubMetadata>> {
  const githubService = new GitHubService('podman-desktop', 'podman-desktop');

  return {
    name: 'docusaurus-plugin-github-metadata',

    async loadContent(): Promise<GitHubMetadata> {
      return githubService.getLatestReleaseMetadata();
    },

    async contentLoaded({ content, actions }): Promise<void> {
      const { setGlobalData } = actions;
      setGlobalData(content);
    },
  };
}
