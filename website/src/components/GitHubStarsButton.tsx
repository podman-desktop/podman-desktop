import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

// This function will get the stars from the github API.
// if for ANY reason, this fails, we want to make sure that we return blank ''
// so that we don't show a broken component / it only shows up if we have a valid number of stars
// this is because sometimes we will get rate limited from the github API and we do not want that to break the component
function useGitHubStars(repo: string): string {
  const [stars, setStars] = useState<string>('');

  useEffect(() => {
    let active = true;

    fetch(`https://api.github.com/repos/${repo}`)
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('API error'))))
      .then(data => {
        if (!active) return;
        const count = data.stargazers_count;

        // Add 'k' suffix if above 1000.
        if (typeof count === 'number') {
          setStars(count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`);
        }
      })
      .catch(() => {
        if (active) setStars('');
      });

    return (): void => {
      active = false;
    };
  }, [repo]);

  return stars;
}

export function GitHubStarsButton(): JSX.Element {
  const stars = useGitHubStars('podman-desktop/podman-desktop');

  return (
    <a
      href="https://github.com/podman-desktop/podman-desktop"
      target="_blank"
      rel="noopener noreferrer"
      className="hidden lg:flex items-center gap-2 px-4 py-[9px] border border-black dark:border-white rounded-lg navbar__item navbar__link font-medium min-w-[9rem]">
      <FontAwesomeIcon icon={faGithub} />
      <span>Star</span>
      {stars && (
        <span
          id="github-stars-badge"
          className="ml-2 px-2 py-1 bg-charcoal-300 rounded text-white text-xs min-w-[2.5rem] text-center">
          {stars}
        </span>
      )}
    </a>
  );
}
