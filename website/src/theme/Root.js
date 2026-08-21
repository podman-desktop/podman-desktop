import React from 'react';

import { PrototypeScopeBar } from '../components/PrototypeScope/PrototypeScopeBar';
import { prototypeScopeStore } from '../components/PrototypeScope/store';

function ScopeBootstrap({ children }) {
  React.useEffect(() => {
    prototypeScopeStore.syncFromLocation();
  }, []);
  return children;
}

export default function Root({ children }) {
  return (
    <ScopeBootstrap>
      <PrototypeScopeBar />
      {children}
    </ScopeBootstrap>
  );
}
