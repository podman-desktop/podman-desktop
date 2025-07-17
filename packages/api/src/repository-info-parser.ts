import { fromUrl } from 'hosted-git-info';

export class RepositoryInfoParser {
  public readonly owner: string;
  public readonly repository: string;

  constructor(private readonly url: string) {
    const infos = fromUrl(this.url);

    if (!infos) {
      throw new Error(`Could not parse repository information from URL: ${this.url}`);
    }

    if (infos.type !== 'github') {
      throw new Error(`Repository type is not GitHub. Detected type: ${infos.type}. URL: ${this.url}`);
    }

    // For valid GitHub URLs, 'user' and 'project' are guaranteed to be strings.
    this.owner = infos.user;
    this.repository = infos.project;
  }
}
