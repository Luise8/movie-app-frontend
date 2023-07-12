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
import testDbHelpers from 'src/utils/test-db-helpers';
import { editUser } from 'src/services/user-write';
import { getUser } from 'src/services/get-data';
import UserEditForm from 'src/pages/user-edit-form';

const newFilePhoto = new File(['newPhoto'], 'photo.png', { type: 'image/png' });
const newUserInfo = {
  username: 'usernameChanged',
  password: 'password2',
  bio: '',
};

// User
const mockCurrentUser = testDbHelpers.users.userFullData;
// mock get data services
jest.mock('src/services/get-data', () => ({
  getUser: jest.fn(() => Promise.resolve(mockCurrentUser)),
}));

// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
  })),
}));

// mock write data service
jest.mock('src/services/user-write', () => ({
  editUser: jest.fn(() => Promise.resolve('some feedback')),
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
  ModalNotification.mockClear();
  mockedUsedNavigate.mockClear();
  getUser.mockClear();
  editUser.mockClear();
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUser,
  }));
});

it('render right of initial page data after loading state', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/user-edit-form']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user-edit-form" element={<UserEditForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-edit-form');
  expect(page).toBeInTheDocument();

  const LinkUserMatcher = 'see profile';
  const linkUser = screen.getByRole('link', {
    name: new RegExp(LinkUserMatcher, 'i'),
  });
  expect(linkUser).toBeInTheDocument();

  expect(linkUser).toHaveAttribute('href', linkRoutes.userEditForm(mockCurrentUser.id));

  const h1Matcher = 'edit profile';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  const img = within(screen.getByTestId('page-user-edit-form-container-img')).getByRole('img');
  expect(img).toHaveAttribute('src', mockCurrentUser.photo);

  const inputPhoto = screen.getByLabelText(/profile image/i);
  expect(inputPhoto).toBeInTheDocument();
  expect(inputPhoto.files).toHaveLength(0);
  expect(inputPhoto).toHaveAttribute('accept', 'image/png, image/gif, image/jpeg');

  const inputUsername = screen.getByRole('textbox', {
    name: /username/i,
  });
  expect(inputUsername).toHaveValue(mockCurrentUser.username);
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

  const inputBio = screen.getByRole('textbox', {
    name: /bio/i,
  });
  expect(inputBio).toHaveValue(mockCurrentUser.bio);

  const labelBio = screen.getByLabelText(/bio/i);
  expect(labelBio).toBeInTheDocument();

  const biolperText = screen.getByTestId(/bio-restrictions/i);
  expect(biolperText).toHaveTextContent('Only letters, numbers, spaces, and the following special characters are allowed, not including parentheses (- \' . ? ,). The length must be max 300 characters.');

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
        <UserEditForm />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('right handle of update', async () => {
  const newSrcImg = 'newSrcImg';
  global.URL.createObjectURL = jest.fn(() => newSrcImg);

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/user-edit-form']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user-edit-form" element={<UserEditForm />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-edit-form');
  expect(page).toBeInTheDocument();

  // The modal is not in the document
  expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();

  const inputPhoto = screen.getByLabelText(/profile image/i);
  const inputUsername = screen.getByRole('textbox', {
    name: /username/i,
  });
  const inputPassword = screen.getByLabelText(/password/i);
  const bio = screen.getByRole('textbox', {
    name: /bio/i,
  });
  const img = within(screen.getByTestId('page-user-edit-form-container-img')).getByRole('img');

  // The data initial is right
  expect(inputPhoto.files).toHaveLength(0);
  expect(inputUsername).toHaveValue(mockCurrentUser.username);
  expect(inputPassword).toHaveValue('');
  expect(bio).toHaveValue(mockCurrentUser.bio);
  expect(img).toHaveAttribute('src', mockCurrentUser.photo);

  const user = userEvent.setup();

  // Change photo
  await user.upload(inputPhoto, newFilePhoto);
  expect(inputPhoto.files[0]).toStrictEqual(newFilePhoto);
  expect(inputPhoto.files.item(0)).toStrictEqual(newFilePhoto);
  expect(inputPhoto.files).toHaveLength(1);

  // The img to display the input was updated
  expect(within(screen.getByTestId('page-user-edit-form-container-img')).getByRole('img')).toHaveAttribute('src', newSrcImg);

  // Change username, this input is already focus
  await user.clear(inputUsername);
  await user.type(inputUsername, newUserInfo.username);
  expect(screen.getByRole('textbox', {
    name: /username/i,
  })).toHaveValue(newUserInfo.username);

  // Change password
  act(() => {
    inputPassword.focus();
  });
  await user.type(inputPassword, newUserInfo.password);
  expect(screen.getByLabelText(/password/i)).toHaveValue(newUserInfo.password);

  // Change bio
  await user.clear(bio);
  // the newUserInfo.bio is now '', so the line below is comment
  // to avoid error of userEvent. If newUserInfo.bio has lenght > 0, uncomment
  // await user.type(bio, newUserInfo.bio);
  expect(screen.getByRole('textbox', {
    name: /bio/i,
  })).toHaveValue(newUserInfo.bio);

  // Right function handleSave
  // Save the account
  await user.click(screen.getByRole('button', {
    name: /save/i,
  }));

  // Modal notification called with right props
  await waitFor(() => {
    expect(screen.getByTestId('notification-dialog')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(ModalNotification).toHaveBeenLastCalledWith({
      open: true,
      title: 'Success',
      body: 'The operation was carried out successfully.',
      handleClose: expect.any(Function),
    }, {});
  });

  // close modal
  await user.click(within(screen.getByTestId('notification-dialog')).getByRole('button', {
    name: /close/i,
  }));

  await waitFor(() => {
    expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();
  });

  // Call to the service with right arguments
  expect(editUser).toHaveBeenCalledWith({
    username: newUserInfo.username,
    password: newUserInfo.password,
    bio: newUserInfo.bio,
    photo: newFilePhoto,
    id: mockCurrentUser.id,
  });

  // Redirection to right route
  expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedUsedNavigate)
    .toHaveBeenCalledWith(linkRoutes.userEditForm(mockCurrentUser.id));
});

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/user-edit-form']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user-edit-form" element={<UserEditForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-user-edit-form')).toHaveClass('page');

  expect(screen.getByTestId('page-container-button-user')).toHaveClass('page-container-button-user');

  const linkUser = screen.getByRole('link', {
    name: /see profile/i,
  });
  expect(linkUser).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);

  const h1Matcher = 'edit profile';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  expect(screen.getByTestId('page-user-edit-form-form')).toHaveClass('page-form');

  expect(screen.getByTestId('page-user-edit-form-container-photo-field')).toHaveClass('page-user-edit-form-container-photo-field');

  expect(screen.getByTestId('page-user-edit-form-container-img-and-input')).toHaveClass('page-user-edit-form-container-img-and-input');

  expect(screen.getByTestId('page-user-edit-form-container-img')).toHaveClass('page-user-edit-form-container-img');

  expect(screen.getByRole('button', { name: /save/i })).toHaveStyle(`background-color: ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-user-edit-form-alert')).toHaveClass('page-form-alert');
});
