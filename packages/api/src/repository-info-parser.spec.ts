import { describe, expect, test } from 'vitest';

import { RepositoryInfoParser } from './repository-info-parser.js';

describe('RepositoryInfoParser', () => {
  test('should correctly extract owner and repository from a standard GitHub URL', () => {
    const url = 'https://github.com/podman-desktop/podman-desktop';
    const parser = new RepositoryInfoParser(url);

    expect(parser.owner).toBe('podman-desktop');
    expect(parser.repository).toBe('podman-desktop');
  });

  test('should correctly parse a URL with the .git suffix', () => {
    const url = 'https://github.com/some-user/another-repo.git';
    const parser = new RepositoryInfoParser(url);

    expect(parser.owner).toBe('some-user');
    expect(parser.repository).toBe('another-repo');
  });

  test('should throw an error for a non-GitHub repository URL', () => {
    const url = 'https://gitlab.com/foo/bar';

    // Check that the constructor throws the expected error.
    expect(() => new RepositoryInfoParser(url)).toThrow(
      'Repository type is not GitHub. Detected type: gitlab. URL: https://gitlab.com/foo/bar',
    );
  });

  test('should throw an error for an unparseable repository URL', () => {
    const url = 'this is not a valid url';

    expect(() => new RepositoryInfoParser(url)).toThrow(`Could not parse repository information from URL: ${url}`);
  });

  test('should throw an error for a missing or undefined URL', () => {
    // We pass undefined to simulate a missing repository field in package.json
    expect(() => new RepositoryInfoParser(undefined as unknown as string)).toThrow(
      'Could not parse repository information from URL: undefined',
    );
  });
});
