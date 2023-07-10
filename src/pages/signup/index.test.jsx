import {
  act, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';
import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import darkTheme from 'src/utils/darkTheme';
import Error from 'src/pages/error';
import linkRoutes from 'src/utils/link-routes';
import { useUserAuth } from 'src/context/auth';
import ModalNotification from 'src/components/modal-notification';
import SignUp from 'src/pages/signup';
import { createUser } from 'src/services/user-write';

const mockCurrentUser = null;
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
  })),
}));

const newUser = {
  username: 'newUser1',
  password: '12345',
};

// mock write data service
jest.mock('src/services/user-write', () => ({
  createUser: jest.fn(),
}));

// Mock PageLayout
jest.mock('src/components/page-layout', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="page-layout">{children}</div>),
}));

// Mock modal
jest.mock('src/components/modal-notification');
ModalNotification.mockImplementation(jest.requireActual('src/components/modal-notification').default);

// mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Clear mocks
beforeEach(async () => {
  createUser.mockClear();
  ModalNotification.mockClear();
  mockedUsedNavigate.mockClear();
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUser,
  }));
});

it('render right of initial page data after loading state', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-sign-up');
  expect(page).toBeInTheDocument();

  expect(screen.getByTestId(/avatar/i)).toBeInTheDocument();

  const h1Matcher = 'sign up';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  const inputUsername = screen.getByRole('textbox', {
    name: /username/i,
  });
  expect(inputUsername).toHaveValue('');
  expect(inputUsername).toHaveFocus();

  const labelUsername = screen.getByLabelText(/username/i);
  expect(labelUsername).toBeInTheDocument();

  const usernameHelperText = screen.getByTestId(/username-restrictions/i);
  expect(usernameHelperText).toHaveTextContent('Only alphanumeric characters are allowed. The length must be between 5 and 20 characters.');

  const inputPassword = screen.getByLabelText(/password/i);
  expect(inputPassword).toHaveValue('');
  expect(inputPassword).toHaveAttribute('type', 'password');

  const passwordHelperText = screen.getByTestId(/password-restrictions/i);
  expect(passwordHelperText).toHaveTextContent('The length must be min 5 characters. No spaces are allowed in the password.');

  const saveButton = screen.getByRole('button', {
    name: /save/i,
  });
  expect(saveButton).toBeInTheDocument();
});

it('Render right initial loading state', async () => {
  useUserAuth.mockImplementation(() => ({
    user: {},
  }));
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <SignUp />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('right handle of creation of account', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-sign-up');
  expect(page).toBeInTheDocument();

  // The modal is not in the document
  expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();

  const inputUsername = screen.getByRole('textbox', {
    name: /username/i,
  });
  const inputPassword = screen.getByLabelText(/password/i);

  // The data initial is right
  expect(inputUsername).toHaveValue('');
  expect(inputPassword).toHaveValue('');

  const user = userEvent.setup();

  // Change username, this input is already focus
  await user.type(inputUsername, newUser.username);
  expect(screen.getByRole('textbox', {
    name: /username/i,
  })).toHaveValue(newUser.username);

  // Change password
  act(() => {
    inputPassword.focus();
  });
  await user.type(inputPassword, newUser.password);
  expect(screen.getByLabelText(/password/i)).toHaveValue(newUser.password);

  // Right function handleSave
  // Save the account
  await user.click(screen.getByRole('button', {
    name: /save/i,
  }));

  // Modal notification called with right props
  await waitFor(() => {
    expect(ModalNotification).toHaveBeenLastCalledWith({
      open: true,
      title: 'Successfully created',
      body: 'Account successfully created',
      handleClose: expect.any(Function),
    }, {});
  });

  expect(screen.getByTestId('notification-dialog')).toBeInTheDocument();

  // close modal
  await user.click(within(screen.getByTestId('notification-dialog')).getByRole('button', {
    name: /close/i,
  }));

  await waitFor(() => {
    expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();
  });

  // Call to the service with right arguments
  expect(createUser).toHaveBeenCalledWith({
    username: newUser.username,
    password: newUser.password,
  });

  // Redirection to right route
  expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedUsedNavigate).toHaveBeenCalledWith(linkRoutes.signUp);
});

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-sign-up')).toHaveClass('page');

  const h1Matcher = 'sign up';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  expect(screen.getByTestId('page-sign-up-form')).toHaveClass('page-form');

  expect(screen.getByRole('button', { name: /save/i })).toHaveStyle(`background-color: ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-sign-up-alert')).toHaveClass('page-form-alert');
});
