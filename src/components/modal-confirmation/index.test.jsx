import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalConfirmation from 'src/components/modal-confirmation';
import userEvent from '@testing-library/user-event';

it('right render with data provided and when open true', async () => {
  const body = 'Some body';
  const title = 'Some title';
  const handleConfirm = jest.fn();
  const handleClose = jest.fn();
  const open = true;

  render(
    <ModalConfirmation
      title={title}
      body={body}
      handleClose={handleClose}
      handleConfirm={handleConfirm}
      open={open}
    />,
  );
  expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByText(body)).toBeInTheDocument();

  const user = userEvent.setup();
  await user.click(
    screen.getByRole('button', {
      name: /cancel/i,
    }),
  );
  expect(handleClose).toBeCalledTimes(1);

  await user.click(
    screen.getByRole('button', {
      name: /accept/i,
    }),
  );

  expect(handleConfirm).toBeCalledTimes(1);
});

it('right render when open is false', () => {
  const body = 'Some body';
  const title = 'Some title';
  const handleConfirm = jest.fn();
  const handleClose = jest.fn();
  const open = false;

  render(
    <ModalConfirmation
      title={title}
      body={body}
      handleClose={handleClose}
      handleConfirm={handleConfirm}
      open={open}
    />,
  );

  expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
});
