import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loading from 'src/components/loading';

it('right render in document', () => {
  render(<Loading />);

  // Role of CircularProgress MUI component
  expect(screen.getByRole('progressbar')).toBeInTheDocument();

  expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
});

it('right classes', async () => {
  await act(async () => {
    render(<Loading />);
  });

  expect(screen.getByTestId(/loading-container/i)).toHaveClass('loading-container');
});
