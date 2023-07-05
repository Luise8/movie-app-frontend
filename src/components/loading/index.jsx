import { CircularProgress } from '@mui/material';
import React from 'react';
import 'src/components/loading/styles.css';

function Loading() {
  return (
    <div className="loading-container" data-testid="loading-container">
      <CircularProgress aria-label="loading..." />
    </div>
  );
}

export default Loading;
