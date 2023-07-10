import {
  act, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';
import testDbHelpers from 'src/utils/test-db-helpers';
import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import darkTheme from 'src/utils/darkTheme';
import Error from 'src/pages/error';
import linkRoutes from 'src/utils/link-routes';
import { useUserAuth } from 'src/context/auth';
import ModalNotification from 'src/components/modal-notification';
import { createList } from 'src/services/list-write';
import ListCreateForm from 'src/pages/list-create-form';

const mockData = testDbHelpers.users.userWithoutData;
const mockCurrentUser = {
  id: mockData.id,
  username: mockData.username,
};
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
  })),
}));

const newList = {
  name: 'New list created Today',
  description: '2',
};
const mockIdNewList = '123';

// mock write data service
jest.mock('src/services/list-write', () => ({
  createList: jest.fn(({
    name, description, id,
  }) => ({
    name,
    description,
    id: mockIdNewList,
    userId: id,
    movies: [],
    date: new Date().toUTCString(),
  })),
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
  createList.mockClear();
  ModalNotification.mockClear();
  mockedUsedNavigate.mockClear();
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUser,
  }));
});

it('render right of initial page data after loading state of user loggedIn', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/list-create-form']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/list-create-form" element={<ListCreateForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-list-create-form');
  expect(page).toBeInTheDocument();

  const h1Matcher = 'create list';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  const inputName = screen.getByRole('textbox', {
    name: /name/i,
  });
  expect(inputName).toHaveValue('');
  expect(inputName).toHaveFocus();

  const labelName = screen.getByLabelText(/name/i);
  expect(labelName).toBeInTheDocument();

  const nameHelperText = screen.getByTestId(/name-helper-text/i);
  expect(nameHelperText).toHaveTextContent('The length must be between 12 and 175 characters. Only letters, numbers, spaces, and the following special characters are allowed, not including parentheses (- \' . ? ,)');

  const inputDescription = screen.getByRole('textbox', {
    name: /description/i,
  });
  expect(inputDescription).toHaveValue('');

  const labelDescription = screen.getByLabelText(/description/i);
  expect(labelDescription).toBeInTheDocument();

  const descriptionHelperText = screen.getByTestId(/description-helper-text/i);
  expect(descriptionHelperText).toHaveTextContent('The length must be max 300 characters. Only letters, numbers, spaces, and the following special characters are allowed, not including parentheses (- \' . ? ,)');

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
        <ListCreateForm />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('right handle of creation of list', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/list-create-form']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/list-create-form" element={<ListCreateForm />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-list-create-form');
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
  expect(inputName).toHaveValue('');
  expect(inputDescription).toHaveValue('');

  const user = userEvent.setup();

  // Change name, this input is already focus
  await user.type(inputName, newList.name);
  expect(screen.getByRole('textbox', {
    name: /name/i,
  })).toHaveValue(newList.name);

  // Change description
  act(() => {
    inputDescription.focus();
  });
  await user.type(inputDescription, newList.description);
  expect(screen.getByRole('textbox', {
    name: /description/i,
  })).toHaveValue(newList.description);

  // Right function handleSave
  // Save the list
  await user.click(screen.getByRole('button', {
    name: /save/i,
  }));

  // Modal notification called with right props
  await waitFor(() => {
    expect(ModalNotification).toHaveBeenLastCalledWith({
      open: true,
      title: 'Successfully created',
      body: 'List successfully created',
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

  // Call of service with right arguments
  expect(createList).toHaveBeenCalledWith({
    name: newList.name,
    description: newList.description,
    id: mockCurrentUser.id,
  });

  expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedUsedNavigate).toHaveBeenCalledWith(linkRoutes.listCreateForm(mockCurrentUser.id));
});

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/list-create-form']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/list-create-form" element={<ListCreateForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-list-create-form')).toHaveClass('page');

  const h1Matcher = 'create list';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  expect(screen.getByTestId('page-list-create-form-form')).toHaveClass('page-form');

  expect(screen.getByRole('button', { name: /save/i })).toHaveStyle(`background-color: ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-list-create-form-alert')).toHaveClass('page-form-alert');
});
