import { useHistory } from '@docusaurus/router';
import { useEffect } from 'react';

export default function Extensions(): JSX.Element {
  const history = useHistory();

  useEffect(() => {
    // Redirect to the new internal registry
    history.replace('/registry');
  }, [history]);

  return (
    <div className="container mx-auto px-5 py-24 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">Redirecting to Extension Registry...</p>
    </div>
  );
}
