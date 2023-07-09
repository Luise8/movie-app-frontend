import {
  act, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';
import testDbHelpers from 'src/utils/test-db-helpers';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import darkTheme from 'src/utils/darkTheme';
import Error from 'src/pages/error';
import linkRoutes from 'src/utils/link-routes';
import { useUserAuth } from 'src/context/auth';
import CardMovieEditItem from 'src/components/card-movie-edit-item';
import ModalNotification from 'src/components/modal-notification';
import ListEditForm from 'src/pages/list-edit-form';
import { getOneListUserLight } from 'src/services/get-data';
import { editList } from 'src/services/list-write';

const mockData = testDbHelpers.oneListUserLight;
// mock get data service
jest.mock('src/services/get-data', () => ({
  getOneListUserLight: jest.fn(() => (Promise.resolve(mockData))),
}));

// mock write data service
jest.mock('src/services/list-write', () => ({
  editList: jest.fn(({
    movies, name, description, listId, userId,
  }) => ({
    userId,
    name,
    description,
    movies: movies.slice().map((e) => e.id),
    id: listId,
    date: mockData.date,
  })),
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

// Mock PageLayout
jest.mock('src/components/page-layout', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="page-layout">{children}</div>),
}));

// Mock item
jest.mock('src/components/card-movie-edit-item');
CardMovieEditItem.mockImplementation(jest.requireActual('src/components/card-movie-edit-item').default);

// Mock modal
jest.mock('src/components/modal-notification');
ModalNotification.mockImplementation(jest.requireActual('src/components/modal-notification').default);

// Clear mocks
beforeEach(async () => {
  getOneListUserLight.mockClear();
  editList.mockClear();
  CardMovieEditItem.mockClear();
  ModalNotification.mockClear();
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUser,
  }));
});

it('render right of initial page data after loading state of user loggedIn that is the owner of the resource', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/list-edit-form/${mockCurrentUser.id}/${mockData.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/list-edit-form/:userId/:listId" element={<ListEditForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getOneListUserLight).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-list-edit-form');
  expect(page).toBeInTheDocument();

  const linkListMatcher = 'see list';
  const linkList = screen.getByRole('link', {
    name: new RegExp(linkListMatcher, 'i'),
  });
  expect(linkList).toBeInTheDocument();

  expect(linkList).toHaveAttribute('href', linkRoutes.listEditForm({ userId: mockCurrentUser.id, listId: mockData.id }));

  const h1Matcher = `edit list ${mockData.name}`;
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  const revertButton = screen.getByRole('button', {
    name: /revert/i,
  });
  expect(revertButton).toBeInTheDocument();

  const saveButton = screen.getByRole('button', {
    name: /save/i,
  });
  expect(saveButton).toBeInTheDocument();

  const inputName = screen.getByRole('textbox', {
    name: /name/i,
  });
  expect(inputName).toHaveValue(mockData.name);
  expect(inputName).toHaveFocus();

  const labelName = screen.getByLabelText(/name/i);
  expect(labelName).toBeInTheDocument();

  const nameHelperText = screen.getByTestId(/name-helper-text/i);
  expect(nameHelperText).toHaveTextContent('The length must be between 12 and 175 characters. Only letters, numbers, spaces, and the following special characters are allowed, not including parentheses (- \' . ? ,)');

  const inputDescription = screen.getByRole('textbox', {
    name: /description/i,
  });
  expect(inputDescription).toHaveValue(mockData.description);

  const labelDescription = screen.getByLabelText(/description/i);
  expect(labelDescription).toBeInTheDocument();

  const descriptionHelperText = screen.getByTestId(/description-helper-text/i);
  expect(descriptionHelperText).toHaveTextContent('The length must be max 300 characters. Only letters, numbers, spaces, and the following special characters are allowed, not including parentheses (- \' . ? ,)');

  expect(screen.getByText(`Total: ${mockData.total}`)).toBeInTheDocument();

  const items = screen.getAllByTestId('card-movie-edit-item');
  expect(items).toHaveLength(mockData.total);
  // The list only has 3 items
  expect(CardMovieEditItem).toBeCalledTimes(mockData.total);
  // First item
  expect(CardMovieEditItem).toHaveBeenNthCalledWith(1, {
    data: {
      ...mockData.results[0],
      handleDelete: expect.any(Function),
      index: 0,
    },
  }, {});
  // Second item
  expect(CardMovieEditItem).toHaveBeenNthCalledWith(2, {
    data: {
      ...mockData.results[1],
      handleDelete: expect.any(Function),
      index: 1,
    },
  }, {});
  // Third item
  expect(CardMovieEditItem).toHaveBeenLastCalledWith({
    data: {
      ...mockData.results[mockData.total - 1],
      handleDelete: expect.any(Function),
      index: mockData.total - 1,
    },
  }, {});
});

it('Render right initial loading state', async () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <ListEditForm />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('Render the correct error page when there is any initial error other than 404 and 401', async () => {
  getOneListUserLight.mockImplementationOnce(() => Promise.reject(new Error('something wrong')));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/list-edit-form/${mockCurrentUser.id}/${mockData.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/list-edit-form/:userId/:listId" element={<ListEditForm />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getOneListUserLight).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  expect(screen.queryByTestId(/page-list-edit-form/i)).not.toBeInTheDocument();

  expect(screen.getByTestId(/^error-container$/i)).toBeInTheDocument();
});

it('right handle of events', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/list-edit-form/${mockCurrentUser.id}/${mockData.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/list-edit-form/:userId/:listId" element={<ListEditForm />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  const typeInput = ' changed';
  const newName = `${mockData.name}${typeInput}`;
  const newDescription = `${mockData.description}${typeInput}`;

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-list-edit-form');
  expect(page).toBeInTheDocument();

  // The modal is not in the document
  expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();

  const inputName = screen.getByRole('textbox', {
    name: /name/i,
  });
  const inputDescription = screen.getByRole('textbox', {
    name: /description/i,
  });

  // The data initial is right
  const h1Matcher = `edit list ${mockData.name}`;
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  expect(inputName).toHaveValue(mockData.name);
  expect(inputDescription).toHaveValue(mockData.description);

  // Right amount initial items rendered
  const items = screen.getAllByTestId('card-movie-edit-item');
  expect(items).toHaveLength(mockData.total);

  const user = userEvent.setup();

  // Change name, this input is already focus
  await user.type(inputName, typeInput);
  expect(screen.getByRole('textbox', {
    name: /name/i,
  })).toHaveValue(newName);

  // Change description
  act(() => {
    inputDescription.focus();
  });
  await user.type(inputDescription, typeInput);
  expect(screen.getByRole('textbox', {
    name: /description/i,
  })).toHaveValue(newDescription);

  // delete first item
  await user.click(within(items[0]).getByRole('button', {
    name: /delete/i,
  }));

  expect(screen.getAllByTestId('card-movie-edit-item')).toHaveLength(mockData.total - 1);

  // The title and total have not changed until the changes have been saved
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  expect(screen.getByText(`Total: ${mockData.total}`)).toBeInTheDocument();

  // Right function handleCancel
  // Revert delete of item
  await user.click(screen.getByRole('button', {
    name: /revert/i,
  }));

  // The input values were restored to the initial state
  expect(screen.getByRole('textbox', {
    name: /name/i,
  })).toHaveValue(mockData.name);

  expect(screen.getByRole('textbox', {
    name: /description/i,
  })).toHaveValue(mockData.description);

  // The items were restored to the initial state
  const itemsSecondTime = screen.getAllByTestId('card-movie-edit-item');
  expect(itemsSecondTime).toHaveLength(mockData.total);

  // The list item was restored
  expect(within(itemsSecondTime[0]).getByText(mockData.results[0].name)).toBeInTheDocument();

  // Change inputs again
  act(() => {
    screen.getByRole('textbox', {
      name: /name/i,
    }).focus();
  });
  await user.type(screen.getByRole('textbox', {
    name: /name/i,
  }), typeInput);

  act(() => {
    screen.getByRole('textbox', {
      name: /description/i,
    }).focus();
  });
  await user.type(screen.getByRole('textbox', {
    name: /description/i,
  }), typeInput);

  expect(screen.getByRole('textbox', {
    name: /name/i,
  })).toHaveValue(newName);

  expect(screen.getByRole('textbox', {
    name: /description/i,
  })).toHaveValue(newDescription);

  // delete item again
  await user.click(within(itemsSecondTime[0]).getByRole('button', {
    name: /delete/i,
  }));

  expect(screen.getAllByTestId('card-movie-edit-item')).toHaveLength(mockData.total - 1);

  // Right function handleSave
  // Save the list without the item deleted and with the changes made on inputs
  await user.click(screen.getByRole('button', {
    name: /save/i,
  }));

  // Modal notification called with right props
  await waitFor(() => {
    expect(ModalNotification).toHaveBeenLastCalledWith({
      open: true,
      title: 'Successfully updated',
      body: 'List updated successfully',
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

  // The title now was changed
  const h1MatcherUpdated = `edit list ${newName}`;
  expect(screen.getByRole('heading', {
    name: new RegExp(h1MatcherUpdated, 'i'),
    level: 1,
  })).toBeInTheDocument();

  // The total now was changed
  expect(screen.getByText(`Total: ${mockData.total - 1}`)).toBeInTheDocument();

  // Trying to revert doesn't work when the change was saved
  await user.click(screen.getByRole('button', {
    name: /revert/i,
  }));

  // The inputs remain updated
  expect(screen.getByRole('textbox', {
    name: /name/i,
  })).toHaveValue(newName);

  expect(screen.getByRole('textbox', {
    name: /description/i,
  })).toHaveValue(newDescription);

  // The item remains deleted
  expect(screen.getAllByTestId('card-movie-edit-item')).toHaveLength(mockData.total - 1);

  // the title did not changed with the revert button
  expect(screen.getByRole('heading', {
    name: new RegExp(h1MatcherUpdated, 'i'),
    level: 1,
  })).toBeInTheDocument();

  // the total did not change with the revert button
  expect(screen.getByText(`Total: ${mockData.total - 1}`)).toBeInTheDocument();
}, 100000);

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/list-edit-form/${mockCurrentUser.id}/${mockData.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/list-edit-form/:userId/:listId" element={<ListEditForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-list-edit-form')).toHaveClass('page');

  expect(screen.getByTestId('page-list-edit-form-container-button-see-list')).toHaveClass('page-list-edit-form-container-button-see-list');

  const linkListMatcher = 'see list';
  const linkList = screen.getByRole('link', {
    name: new RegExp(linkListMatcher, 'i'),
  });
  expect(linkList).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);

  expect(screen.getByTestId('page-list-edit-form-container-title')).toHaveClass('page-list-edit-form-break-word');

  const h1Matcher = `edit list ${mockData.name}`;
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  expect(screen.getByTestId('page-list-edit-form-form')).toHaveClass('page-form');

  expect(screen.getByTestId('page-list-edit-form-container-edit-buttons')).toHaveClass('page-list-edit-form-container-edit-buttons');

  expect(screen.getByRole('button', { name: /revert/i })).toHaveStyle(`background-color: ${darkTheme.palette.neutral.main}`);

  expect(screen.getByRole('button', { name: /save/i })).toHaveStyle(`background-color: ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-list-edit-form-alert')).toHaveClass('page-form-alert');
});
