import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ModalNotification from 'src/components/modal-notification';

it('right render with data provided and when open is true', async () => {
  const body = 'Some body';
  const title = 'Some title';
  const handleClose = jest.fn();
  const open = true;

  render(
    <ModalNotification
      title={title}
      body={body}
      handleClose={handleClose}
      open={open}
    />,
  );
  expect(screen.getByTestId('notification-dialog')).toBeInTheDocument();
  expect(screen.getByText(title)).toBeInTheDocument();
  expect(screen.getByText(body)).toBeInTheDocument();

  const user = userEvent.setup();

  await user.click(
    screen.getByRole('button', {
      name: /accept/i,
    }),
  );

  expect(handleClose).toBeCalledTimes(1);
});

it('right render when open is false', () => {
  const body = 'Some body';
  const title = 'Some title';
  const handleClose = jest.fn();
  const open = false;

  render(
    <ModalNotification
      title={title}
      body={body}
      handleClose={handleClose}
      open={open}
    />,
  );

  expect(screen.queryByTestId('notifiaction-dialog')).not.toBeInTheDocument();
});
