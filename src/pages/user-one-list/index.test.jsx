import {
  act, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { getOneListUser } from 'src/services/get-data';
import userEvent from '@testing-library/user-event';
import testDbHelpers from 'src/utils/test-db-helpers';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import darkTheme from 'src/utils/darkTheme';
import ListGeneric from 'src/components/list-generic';
import Error from 'src/pages/error';
import linkRoutes from 'src/utils/link-routes';
import UserOneList from 'src/pages/user-one-list';
import { deleteList } from 'src/services/list-write';
import CardMovieMedium from 'src/components/card-movie-medium';
import ModalConfirmation from 'src/components/modal-confirmation';
import ModalNotification from 'src/components/modal-notification';
import { useUserAuth } from 'src/context/auth';

const mockData = testDbHelpers.oneListuser;
// mock get data service
jest.mock('src/services/get-data', () => ({
  getOneListUser: jest.fn(() => (Promise.resolve(mockData))),
}));

// mock write data service
jest.mock('src/services/list-write', () => ({
  deleteList: jest.fn(() => (Promise.resolve('deleted'))),
}));

const mockCurrentUser = {
  id: mockData.user_details.id,
  username: mockData.user_details.username,
};
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
  })),
}));

// Mock ListGeneric
jest.mock('src/components/list-generic', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Item
jest.mock('src/components/card-movie-medium', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock modals
jest.mock('src/components/modal-confirmation');
ModalConfirmation.mockImplementation(jest.requireActual('src/components/modal-confirmation').default);
jest.mock('src/components/modal-notification');
ModalNotification.mockImplementation(jest.requireActual('src/components/modal-notification').default);

// Mock PageLayout
jest.mock('src/components/page-layout', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="page-layout">{children}</div>),
}));

// Clear mocks
beforeEach(async () => {
  getOneListUser.mockClear();
  deleteList.mockClear();
  ListGeneric.mockClear();
  ModalConfirmation.mockClear();
  ModalNotification.mockClear();
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUser,
  }));
});

it('render right of initial page data after loading state with user loggedIn that is the owner of the resource', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/lists/${mockData.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:userId/lists/:listId" element={<UserOneList />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getOneListUser).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-one-list');
  expect(page).toBeInTheDocument();

  const LinkUserMatcher = `see profile of ${mockData.user_details.username}`;
  const linkUser = screen.getByRole('link', {
    name: new RegExp(LinkUserMatcher, 'i'),
  });
  expect(linkUser).toBeInTheDocument();

  expect(linkUser).toHaveAttribute('href', linkRoutes.userProfile(mockCurrentUser.id));

  const h1Matcher = `List: ${mockData.name}`;
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  expect(screen.getByText(`Total: ${mockData.total}`)).toBeInTheDocument();

  expect(screen.getByText(mockData.description)).toBeInTheDocument();

  const dateMatcher = `created ${new Date(mockData.date).toUTCString()}`;
  expect(screen.getByText(new RegExp(dateMatcher, 'i'))).toBeInTheDocument();

  const editListLink = screen.getByRole('link', {
    name: /edit list/i,
  });
  expect(editListLink).toBeInTheDocument();
  expect(editListLink).toHaveAttribute('href', linkRoutes.listEditForm({ userId: mockCurrentUser.id, listId: mockData.id }));

  expect(screen.getByRole('button', {
    name: /delete list/i,
  })).toBeInTheDocument();

  // Call of ListGeneric with right data and right renderItem component
  expect(ListGeneric).toHaveBeenLastCalledWith({
    list: mockData.results,
    renderItem: CardMovieMedium,
  }, {});

  expect(screen.getByRole('button', {
    name: /more/i,
  })).toBeInTheDocument();

  // Modals called with right data and are not visible
  expect(ModalNotification).toHaveBeenLastCalledWith({
    open: false,
    title: 'Successfully deleted',
    body: 'List deleted successfully',
    handleClose: expect.any(Function),
  }, {});

  expect(ModalConfirmation).toHaveBeenLastCalledWith({
    open: false,
    title: 'The list will be deleted',
    body: 'Are you sure you want to delete the list? Can\'t get it back after?',
    handleClose: expect.any(Function),
    handleConfirm: expect.any(Function),
  }, {});
});

it('render right of initial page data after loading state with user that is not the owner of the resource', async () => {
  useUserAuth.mockImplementation(() => ({
    user: {
      id: '1212',
      username: 'AnotherUser',
    },
  }));
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/lists/${mockData.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:userId/lists/:listId" element={<UserOneList />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getOneListUser).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-one-list');
  expect(page).toBeInTheDocument();

  // Just changed this buttons. This shouldn't be to any other
  // user is not the owner of the resource
  expect(screen.queryByRole('link', {
    name: /edit list/i,
  })).not.toBeInTheDocument();

  expect(screen.queryByRole('button', {
    name: /delete list/i,
  })).not.toBeInTheDocument();
});

it('Render right initial loading state', async () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <UserOneList />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('Render the correct error page when there is any error other than 404', async () => {
  getOneListUser.mockImplementationOnce(() => Promise.reject(new Error('something wrong')));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/lists/${mockData.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:userId/lists/:listId" element={<UserOneList />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getOneListUser).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  expect(screen.queryByTestId(/page-user-one-list/i)).not.toBeInTheDocument();

  expect(screen.getByTestId(/^error-container$/i)).toBeInTheDocument();
});

it('right handle of pagintation', async () => {
  // Change mock get data service to give max only 1 item per
  // page to make more easy pagination tests. Real implementation gives max 20.

  // Fist page
  const pageOne = {
    ...mockData, page: 0, total: 2, page_zise: 1, next_page: 'next page url', results: [mockData.results[0]],
  };

  // Second Page
  const pageTwo = {
    ...mockData, page: 1, total: 2, page_zise: 1, prev_page: 'perv page url', next_page: '', results: [mockData.results[1]],
  };

  // new max data
  const newTotalResult = pageOne.results.slice().concat(pageTwo.results);

  getOneListUser
    .mockImplementationOnce(() => Promise.resolve(pageOne))
    .mockImplementationOnce(() => Promise.resolve(pageTwo));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/lists/${mockData.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:userId/lists/:listId" element={<UserOneList />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-one-list');
  expect(page).toBeInTheDocument();

  // The button more is not disabled when there are more data
  expect(screen.getByRole('button', {
    name: /more/i,
  })).not.toHaveAttribute('disabled');

  expect(ListGeneric).toHaveBeenLastCalledWith({
    list: pageOne.results,
    renderItem: CardMovieMedium,
  }, {});

  const user = userEvent.setup();
  const buttonMore = screen.getByRole('button', {
    name: /more/i,
  });

  await user.click(buttonMore);

  expect(ListGeneric).toHaveBeenLastCalledWith({
    list: newTotalResult,
    renderItem: CardMovieMedium,
  }, {});

  // The button more is disabled when there are not more data
  expect(await screen.findByRole('button', {
    name: /more/i,
  })).toHaveAttribute('disabled');
});

it('Right list deletion handling', async () => {
  render(
    <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/lists/${mockData.id}`]}>
      <ThemeProvider theme={darkTheme}>
        <Routes>
          <Route path="/user/:userId/lists/:listId" element={<UserOneList />} />
          <Route path="/error" element={<Error />} />
          <Route path="/" element={<div>home</div>} />
        </Routes>
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );

  const pageLayout = await screen.findByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-one-list');
  expect(page).toBeInTheDocument();

  // The modals are not in the document
  expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();

  expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();

  const deleteButton = screen.getByRole('button', {
    name: /delete list/i,
  });

  const user = userEvent.setup();
  await user.click(deleteButton);

  // Modal called with right props after clicking delete button, and therefore is visible
  expect(ModalConfirmation).toHaveBeenLastCalledWith({
    open: true,
    title: 'The list will be deleted',
    body: 'Are you sure you want to delete the list? Can\'t get it back after?',
    handleClose: expect.any(Function),
    handleConfirm: expect.any(Function),
  }, {});

  // The modal confirmation is in the document
  const modalConfirmation = screen.getByTestId('confirm-dialog');
  expect(modalConfirmation).toBeInTheDocument();

  // Right handleClose function passed
  await user.click(within(modalConfirmation).getByRole('button', {
    name: /close/i,
  }));

  // The modal is not in the document
  await waitFor(() => {
    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
  });

  // open again modal confirmation
  await user.click(screen.getByRole('button', {
    name: /delete list/i,
  }));

  // The modal is in the document again
  expect(screen.queryByTestId('confirm-dialog')).toBeInTheDocument();

  // Right handleConfirm function passed
  await user.click(screen.getByRole('button', {
    name: /Accept/i,
  }));

  // Modal notificaion now is in the document and modal confirmation is not in the document
  await waitFor(() => {
    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
  });

  expect(screen.getByTestId('notification-dialog')).toBeInTheDocument();

  // Call of modal notification with right props to open it
  expect(ModalNotification).toHaveBeenLastCalledWith({
    open: true,
    title: 'Successfully deleted',
    body: 'List deleted successfully',
    handleClose: expect.any(Function),
  }, {});

  // Right call of service to delete resource with right arguments
  expect(deleteList).toHaveBeenCalledTimes(1);
  expect(deleteList).toHaveBeenCalledWith({ userId: mockCurrentUser.id, listId: mockData.id });

  // Right handleClose function passed to modal
  await user.click(screen.getByRole('button', {
    name: /close/i,
  }));

  // Right redirection after close modal notification
  expect(screen.getByText(/home/i)).toBeInTheDocument();
  expect(screen.queryByTestId(/page-user-one-list/i)).not.toBeInTheDocument();
});

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/lists/${mockData.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:userId/lists/:listId" element={<UserOneList />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-user-one-list')).toHaveClass('page');

  expect(screen.getByTestId('page-container-button-user')).toHaveClass('page-container-button-user');

  expect(screen.getByTestId('page-container-button-more')).toHaveClass('page-container-button-more');

  const LinkUserMatcher = `see profile of ${mockData.user_details.username}`;
  const linkUser = screen.getByRole('link', {
    name: new RegExp(LinkUserMatcher, 'i'),
  });

  expect(linkUser).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);

  const h1Matcher = `List: ${mockData.name}`;
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  const editListLink = screen.getByRole('link', {
    name: /edit list/i,
  });

  expect(editListLink).toHaveStyle(`background-color: ${darkTheme.palette.info.main}`);

  expect(screen.getByRole('button', {
    name: /delete list/i,
  })).toHaveStyle(`background-color: ${darkTheme.palette.error.main}`);

  // atribute of Button color secondary and variant outlined
  expect(screen.getByRole('button', {
    name: /more/i,
  })).toHaveClass('MuiButton-outlinedSecondary');
});
