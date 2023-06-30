import React, { useState } from 'react';
import {
  render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import ModalSearch from 'src/components/modal-search';
import testDbHelpers from 'src/utils/test-db-helpers';
import {
  Link, MemoryRouter, Route, Routes,
} from 'react-router-dom';

const mockData = { ...testDbHelpers.moviesBySearch };
// mock getMoviesBySearch function to get movies data
jest.mock('src/services/get-data', () => ({
  getMoviesBySearch: jest.fn(async ({ query }) => {
    if (query === 'data') {
      return Promise.resolve({ ...mockData });
    }
    if (query === 'empty') {
      return Promise.resolve({ ...mockData, results: [] });
    }
    if (query === 'error') {
      return Promise.reject(new Error('Error'));
    }
    return 'No option selected';
  }),

}));
describe('when open is true', () => {
  it('right render and right functionalities with data provided to modal', async () => {
    const open = true;
    const handleClose = jest.fn();

    function TestComponent() {
      return (
        <ModalSearch
          handleClose={handleClose}
          open={open}
        />
      );
    }

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<TestComponent />} />
          <Route
            path="/movie/:id"
            element={(
              <div>
                <div>Search movie selected</div>
                <Link to="/">Return home</Link>
              </div>
)}
          />
          <Route
            path="/search/:keyword"
            element={(
              <div>
                <div>Search query</div>
                <Link to="/">Return home</Link>
              </div>
)}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('search-dialog')).toBeInTheDocument();
    const autocomplete = screen.getByTestId('autocomplete-search');
    expect(autocomplete).toBeInTheDocument();

    const user = userEvent.setup();
    const input = within(autocomplete).getByRole('combobox');

    // Title to match
    const title = mockData.results[0]?.release_date ? `${mockData.results[0].title} (${mockData.results[0].release_date.slice(0, 4)})`
      : mockData.results[0].title;

    // Enter to page search with the query entered with click on find button
    act(() => input.focus());
    await user.type(input, 'data');
    await waitFor(
      () => {
      // First result
        expect(screen.getByText(title)).toBeInTheDocument();
      },
    );

    await user.click(screen.getByRole('button', {
      name: /find/i,
    }));

    expect(screen.queryByText('Search query')).toBeInTheDocument();

    // Go back to initial page
    await user.click(
      screen.getByText(/return home/i),
    );

    // Check cancel button
    await user.click(
      screen.getByRole('button', {
        name: /close/i,
      }),
    );
    expect(handleClose).toBeCalledTimes(1);
  });

  it('right route of autocomplete with enter over option selected', async () => {
    const open = true;
    const handleClose = jest.fn();

    function TestComponent() {
      return (
        <ModalSearch
          handleClose={handleClose}
          open={open}
        />
      );
    }

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<TestComponent />} />
          <Route
            path="/movie/:id"
            element={(
              <div>
                <div>Search movie selected</div>
                <Link to="/">Return home</Link>
              </div>
)}
          />
          <Route
            path="/search/:keyword"
            element={(
              <div>
                <div>Search query</div>
                <Link to="/">Return home</Link>
              </div>
)}
          />
        </Routes>
      </MemoryRouter>,
    );

    const autocomplete = screen.getByTestId('autocomplete-search');
    expect(autocomplete).toBeInTheDocument();

    const user = userEvent.setup();
    const input = within(autocomplete).getByRole('combobox');

    // Title to match
    const title = mockData.results[0]?.release_date ? `${mockData.results[0].title} (${mockData.results[0].release_date.slice(0, 4)})`
      : mockData.results[0].title;

    // Enter to movie selected page with enter key
    act(() => input.focus());
    await user.type(input, 'data');
    await waitFor(
      () => {
      // First result
        expect(screen.getByText(title)).toBeInTheDocument();
      },
    );
    await user.keyboard('[ArrowDown]');
    await user.keyboard('[Enter]');
    expect(screen.queryByText('Search movie selected')).toBeInTheDocument();
  }, 100000);

  it('right route of autocomplete with enter key to page search with the query', async () => {
    const open = true;
    const handleClose = jest.fn();

    function TestComponent() {
      return (
        <ModalSearch
          handleClose={handleClose}
          open={open}
        />
      );
    }

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<TestComponent />} />
          <Route
            path="/movie/:id"
            element={(
              <div>
                <div>Search movie selected</div>
                <Link to="/">Return home</Link>
              </div>
)}
          />
          <Route
            path="/search/:keyword"
            element={(
              <div>
                <div>Search query</div>
                <Link to="/">Return home</Link>
              </div>
)}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('search-dialog')).toBeInTheDocument();
    const autocomplete = screen.getByTestId('autocomplete-search');
    expect(autocomplete).toBeInTheDocument();

    const user = userEvent.setup();
    const input = within(autocomplete).getByRole('combobox');

    // Title to match
    const title = mockData.results[0]?.release_date ? `${mockData.results[0].title} (${mockData.results[0].release_date.slice(0, 4)})`
      : mockData.results[0].title;

    // Enter to page search with the query entered with enter key
    act(() => input.focus());
    await user.type(input, 'data');

    await waitFor(
      async () => {
      // First result
        expect(screen.getByText(title)).toBeInTheDocument();
      },
    );
    await user.keyboard('[Enter]');
    expect(screen.queryByText('Search query')).toBeInTheDocument();
  }, 100000);

  it('right route of autocomplete to option selected using click over the option', async () => {
    const open = true;
    const handleClose = jest.fn();

    function TestComponent() {
      return (
        <ModalSearch
          handleClose={handleClose}
          open={open}
        />
      );
    }

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<TestComponent />} />
          <Route
            path="/movie/:id"
            element={(
              <div>
                <div>Search movie selected</div>
                <Link to="/">Return home</Link>
              </div>
)}
          />
          <Route
            path="/search/:keyword"
            element={(
              <div>
                <div>Search query</div>
                <Link to="/">Return home</Link>
              </div>
)}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('search-dialog')).toBeInTheDocument();
    const autocomplete = screen.getByTestId('autocomplete-search');
    expect(autocomplete).toBeInTheDocument();

    const user = userEvent.setup();
    const input = within(autocomplete).getByRole('combobox');

    // Title to match
    const title = mockData.results[0]?.release_date ? `${mockData.results[0].title} (${mockData.results[0].release_date.slice(0, 4)})`
      : mockData.results[0].title;

    // Enter to page movie with the query entered and using click over the option
    act(() => input.focus());
    await user.type(input, 'data');
    await waitFor(
      () => {
      // First result
        expect(screen.getByText(title)).toBeInTheDocument();
      },
    );

    await user.click(screen.getByText(title));
    expect(screen.queryByText('Search movie selected')).toBeInTheDocument();
  }, 100000);

  it('right handle of no data', async () => {
    const open = true;
    const handleClose = jest.fn();

    function TestComponent() {
      return (
        <ModalSearch
          handleClose={handleClose}
          open={open}
        />
      );
    }

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<TestComponent />} />
          <Route
            path="/movie/:id"
            element={(
              <div>
                <div>Search movie selected</div>
                <Link to="/">Return home</Link>
              </div>
            )}
          />
          <Route
            path="/search/:keyword"
            element={(
              <div>
                <div>Search query</div>
                <Link to="/">Return home</Link>
              </div>
            )}
          />
        </Routes>
      </MemoryRouter>,
    );

    const autocomplete = screen.getByTestId('autocomplete-search');
    expect(autocomplete).toBeInTheDocument();

    const user = userEvent.setup();
    const input = within(autocomplete).getByRole('combobox');

    // Title to match
    const title = mockData.results[0]?.release_date ? `${mockData.results[0].title} (${mockData.results[0].release_date.slice(0, 4)})`
      : mockData.results[0].title;

    // Enter to movie selected page with enter key
    act(() => input.focus());
    await user.type(input, 'empty');

    expect(await screen.findByText('No movies')).toBeInTheDocument();
    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });
});

describe('When there is not open the modal', () => {
  it('right render when open is false', () => {
    const open = false;
    const handleClose = jest.fn();

    render(
      <MemoryRouter>
        <ModalSearch
          handleClose={handleClose}
          open={open}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('search-dialog')).not.toBeInTheDocument();
  });
});
