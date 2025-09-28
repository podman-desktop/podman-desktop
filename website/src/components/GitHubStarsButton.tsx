import { usePluginData } from '@docusaurus/useGlobalData';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { GitHubMetadata } from '@site/src/plugins/github-metadata';

export function GitHubStarsButton({ mobile = false }: { readonly mobile?: boolean }): JSX.Element {
  const { stargazersCount } = usePluginData('docusaurus-plugin-github-metadata') as GitHubMetadata;

  return (
    <a
      href="https://github.com/podman-desktop/podman-desktop"
      target="_blank"
      id="github-stars-button"
      rel="noopener noreferrer"
      // check for mobile or large screen
      className={
        mobile
          ? 'dropdown__link flex items-center gap-2 px-4 py-[9px] font-medium text-base'
          : 'navbar__item navbar__link hidden xl:flex items-center gap-2 px-4 mr-3 py-[9px] border border-black dark:border-white rounded-lg font-medium min-w-[9rem] text-base'
      }>
      <FontAwesomeIcon icon={faGithub} />
      <span>Star</span>
      <span
        id="github-stars-badge"
        className="ml-2 px-2 py-1 bg-charcoal-300 rounded text-white text-xs min-w-[2.5rem] text-center">
        {stargazersCount >= 1000 ? `${(stargazersCount / 1000).toFixed(1)}k` : `${stargazersCount}`}
      </span>
    </a>
  );
}
