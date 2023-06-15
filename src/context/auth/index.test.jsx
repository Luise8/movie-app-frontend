/* eslint-disable no-nested-ternary */
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import { UserAuthContextProvider, useUserAuth } from 'src/context/auth';
import { authStatus, logIn, logOut } from 'src/services/auth';
import { getUser } from 'src/services/get-data';

const currentUser = {
  username: 'userNumber1',
};
const notLoggedInSessionStatus = { currentSession: { isAuth: false, userId: null } };

const loggedInSessionStatus = { currentSession: { isAuth: true, userId: '123456789a8798asd7897d4a' } };

let mockCurrentSession = notLoggedInSessionStatus;

// mock auth functions
jest.mock('src/services/auth', () => ({
  authStatus: jest.fn(() => Promise.resolve(mockCurrentSession)),

  logIn: jest.fn(() => {
    mockCurrentSession = loggedInSessionStatus;
    return Promise.resolve(mockCurrentSession);
  }),

  logOut: jest.fn(() => {
    mockCurrentSession = notLoggedInSessionStatus;
    return Promise.resolve(mockCurrentSession);
  }),
}));

// mock getUser function to return not logged in user by default
jest.mock('src/services/get-data', () => ({
  getUser: jest.fn(() => (mockCurrentSession?.currentSession.isAuth
    ? Promise.resolve(currentUser) : Promise.resolve(null))),
}));

const userLoginInfo = {
  username: 'userNumber1',
  password: 'userNumber1',
};

// Clear mocks and localSorage
beforeEach(async () => {
  localStorage.clear();
  await authStatus.mockClear();
  await getUser.mockClear();
});

function TestComponent() {
  const {
    user, fetcAndSethUserData, logInContext, logOutContext,
  } = useUserAuth();

  async function handleLogIn(e) {
    e.preventDefault();
    await logInContext(userLoginInfo);
  }
  async function handleLogOut(e) {
    e.preventDefault();
    await logOutContext();
  }

  const isObjectEmpty = (objectName) => (
    objectName
      && Object.keys(objectName).length === 0
      && objectName.constructor === Object
  );

  return (
    <div>
      {isObjectEmpty(user) ? (
        <h1>
          Loading...
        </h1>
      )
        : user === null ? (<h1>User not logged in</h1>)
          : (
            <h1>
              User logged in:
              {' '}
              {user.username}
            </h1>
          )}

      <button type="submit" onClick={fetcAndSethUserData}>fetcAndSethUserData</button>
      <form>
        <button type="submit" onClick={handleLogIn}>
          Login
        </button>
      </form>
      <button type="submit" onClick={handleLogOut}>Logout</button>
    </div>
  );
}
describe('UserAuthContextProvider and useUserAuth', () => {
  it('proper data is provide with user not logged in', async () => {
    render(
      <UserAuthContextProvider>
        <TestComponent />
      </UserAuthContextProvider>,
    );
    expect(await screen.findByText(/User not logged in/i)).toBeInTheDocument();
  });

  it('right functions called with logInContext and proper data is provide with user logged in', async () => {
    render(
      <UserAuthContextProvider>
        <TestComponent />
      </UserAuthContextProvider>,
    );

    const user = userEvent.setup();
    await user.click(
      screen.getByRole('button', {
        name: /login/i,
      }),
    );
    // LogIn, authStatus and  getUser functions called
    expect(logIn).toBeCalledWith(userLoginInfo);
    expect(authStatus).toBeCalled();
    expect(getUser).toBeCalled();

    // The localStorage.setItem was called with right data and store it
    expect(localStorage.getItem('user')).toBe(JSON.stringify(currentUser));
    const matcher = `User logged in: ${currentUser.username}`;
    expect(await screen.findByText(new RegExp(matcher, 'i'))).toBeInTheDocument();
  });

  it('right functions called with logOutContext and proper data is provide with user recently logged Out', async () => {
  // Set logged in session
    mockCurrentSession = loggedInSessionStatus;
    await act(async () => {
      render(
        <UserAuthContextProvider>
          <TestComponent />
        </UserAuthContextProvider>,
      );
    });

    // Initial user logged in info
    expect(localStorage.getItem('user')).toBe(JSON.stringify(currentUser));

    const matcher = `User logged in: ${currentUser.username}`;
    expect(await screen.findByText(new RegExp(matcher, 'i'))).toBeInTheDocument();

    // Log Out
    const user = userEvent.setup();
    await user.click(
      screen.getByRole('button', {
        name: /logout/i,
      }),
    );
    // LogOut, authStatus and  getUser functions called
    expect(logOut).toBeCalled();
    expect(authStatus).toBeCalled();
    expect(getUser).toBeCalled();
    // The localStorage.setItem was called with right data and store it
    expect(localStorage.getItem('user')).toBe('');

    expect(await screen.findByText(/User not logged in/i)).toBeInTheDocument();
  });
});
