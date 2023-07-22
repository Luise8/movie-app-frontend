import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { useUserAuth } from 'src/context/auth';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from 'src/components/protected-route';
import Loading from 'src/components/loading';

// mock Loading
const loadingText = 'Loading...';
jest.mock('src/components/loading', () => ({
  __esModule: true,
  default: jest.fn(() => <div>{loadingText}</div>),
}));

// mock Navigate
const navigateText = 'Other component';
jest.mock('react-router-dom', () => ({
  Navigate: jest.fn(() => <div>{ navigateText}</div>),
}));
const userLoggedIn = {
  username: 'userNumber1',
};
const userNotLoggedIn = null;

const initalUser = {};
let mockCurrentUser = initalUser;

// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
    fetcAndSethUserData: jest.fn(),
    logInContext: jest.fn(),
    logOutContext: jest.fn(),
  })),
}));

// Clear mocks
beforeEach(async () => {
  Navigate.mockClear();
  Loading.mockClear();
  useUserAuth.mockClear();
});

// eslint-disable-next-line react/prop-types
function TestComponent({ info }) {
  const { user } = useUserAuth();
  return (
    <div>
      <h1>{`${info}${user.username}`}</h1>
    </div>
  );
}

it('right render when user is logged in', async () => {
  const info = 'Protected route, user: ';
  // LogIn user
  mockCurrentUser = userLoggedIn;

  render(
    <ProtectedRoute>
      <TestComponent info={info} />
    </ProtectedRoute>,
  );

  expect(Navigate).not.toHaveBeenCalled();
  const matcher = `Protected route, user: ${mockCurrentUser.username}`;
  expect(await screen.findByText(new RegExp(matcher, 'i'))).toBeInTheDocument();
});

it('right render when user is not logged in', async () => {
  const info = 'Protected route, user: ';
  // LogOut user
  mockCurrentUser = userNotLoggedIn;
  render(
    <ProtectedRoute>
      <TestComponent info={info} />
    </ProtectedRoute>,
  );
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();

    // Redirect to right page
    expect(Navigate).toHaveBeenCalledWith({
      to: '/registration',
    }, {});
  });
});

it('right render while getting user data', async () => {
  const info = 'Protected route, user: ';
  // Retrieving user
  mockCurrentUser = {};
  render(
    <ProtectedRoute>
      <TestComponent info={info} />
    </ProtectedRoute>,
  );
  expect(Loading).toHaveBeenCalled();
  expect(await screen.findByText(new RegExp(loadingText, 'i'))).toBeInTheDocument();
  screen.debug();
});
