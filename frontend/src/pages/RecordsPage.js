import React from 'react';
import Records from '../components/Records/Records';

function RecordsPage() {
  return (
    <div className="container">
      <h2>📋 Saved Weather Records</h2>
      <Records />
    </div>
  );
}

export default RecordsPage;