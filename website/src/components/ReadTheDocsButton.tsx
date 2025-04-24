import Link from '@docusaurus/Link';

export function ReadTheDocsButton(): JSX.Element {
  return (
    <div>
      <Link
        className="no-underline hover:no-underline inline-flex text-white font-bold hover:text-white bg-purple-600 border-0 py-2 px-4 mt-6 mb-1 focus:outline-hidden hover:bg-purple-700 rounded-lg text-base"
        to="/docs/intro">
        Read the Docs
      </Link>
    </div>
  );
}
