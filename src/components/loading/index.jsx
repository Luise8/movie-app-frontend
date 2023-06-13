import { CircularProgress } from '@mui/material';
import React from 'react';
import styles from 'src/components/loading/styles.css';

function Loading() {
  return (
    <div className="loading-container">
      <CircularProgress />
      <span className="visually-hidden">Loading...</span>

    </div>
  );
}

export default Loading;
