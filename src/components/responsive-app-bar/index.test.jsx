import {
  render, screen, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import {
  MemoryRouter, Routes, Route,
} from 'react-router-dom';
import ResponsiveAppBar from 'src/components/responsive-app-bar';
import { ThemeProvider } from '@emotion/react';
import darkTheme from 'src/utils/darkTheme';
import linkRoutes from 'src/utils/link-routes';
import userEvent from '@testing-library/user-event';
import genresTMDB from 'src/utils/movie-genres-TMDB';
import { act } from 'react-dom/test-utils';
import BackToTop from 'src/components/back-to-top';

jest.mock('src/services/get-data', () => ({
  getMoviesBySearch: jest.fn(),
}));

jest.mock('src/components/back-to-top', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const userLoggedIn = {
  id: '123',
  username: 'userNumber1',
};

const userNotLoggedIn = null;

const logOutMock = jest.fn();

beforeEach(() => {
  logOutMock.mockClear();
  BackToTop.mockClear();
});

it('right render when user is logged in', () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <ResponsiveAppBar user={userLoggedIn} logOut={logOutMock} />
      </ThemeProvider>
    </MemoryRouter>,
  );
  expect(screen.getByTestId('responsive-app-bar')).toBeInTheDocument();
  // Menu movies
  const menuMovies = screen.getByTestId(/menu-filter-movies/i);
  expect(menuMovies).toBeInTheDocument();
  expect(menuMovies).not.toBeVisible();
  expect(within(menuMovies).getByText(/rated/i)).toBeInTheDocument();
  expect(within(menuMovies).getByText(/popular/i)).toBeInTheDocument();
  expect(within(menuMovies).getByText(/trending/i)).toBeInTheDocument();
  expect(within(menuMovies).getByText(/genre/i)).toBeInTheDocument();

  const ratedLinks = screen.getAllByText(/rated/i);
  expect(ratedLinks).toHaveLength(2);
  ratedLinks.forEach((item) => {
    expect(item).toHaveAttribute('href', linkRoutes.responsiveAppBar.rated);
    expect(item.nodeName.toLowerCase()).toBe('a');
  });

  const trendingLinks = screen.getAllByText(/trending/i);
  expect(trendingLinks).toHaveLength(2);
  trendingLinks.forEach((item) => {
    expect(item).toHaveAttribute('href', linkRoutes.responsiveAppBar.trending);
    expect(item.nodeName.toLowerCase()).toBe('a');
  });

  const popuarLinks = screen.getAllByText(/popular/i);
  expect(popuarLinks).toHaveLength(2);
  popuarLinks.forEach((item) => {
    expect(item).toHaveAttribute('href', linkRoutes.responsiveAppBar.popular);
    expect(item.nodeName.toLowerCase()).toBe('a');
  });

  const genreLinks = screen.getAllByText(/^genre$/i);
  expect(genreLinks).toHaveLength(2);
  genreLinks.forEach((item) => expect(['li', 'button']).toContain(item.nodeName.toLowerCase()));

  const searchButtons = screen.getAllByRole('button', {
    name: /search/i,
  });
  expect(searchButtons).toHaveLength(2);

  // Menu settings
  const menuSettings = screen.getByTestId(/menu-setting/i);
  expect(menuSettings).toBeInTheDocument();
  expect(menuSettings).not.toBeVisible();
  expect(within(menuSettings).getByText(/profile/i)).toBeInTheDocument();
  expect(within(menuSettings).getByText(/account/i)).toBeInTheDocument();
  expect(within(menuSettings).getByText(/dashboard/i)).toBeInTheDocument();
  expect(within(menuSettings).getByText(/logout/i)).toBeInTheDocument();

  const profileLink = screen.getByText(/profile/i);
  expect(profileLink).toHaveAttribute('href', linkRoutes.responsiveAppBar.profile(userLoggedIn.id));
  expect(profileLink.nodeName.toLowerCase()).toBe('a');

  const accountLink = screen.getByText(/account/i);
  expect(accountLink).toHaveAttribute('href', linkRoutes.responsiveAppBar.account);
  expect(accountLink.nodeName.toLowerCase()).toBe('a');

  const dashboardLink = screen.getByText(/dashboard/i);
  expect(dashboardLink).toHaveAttribute('href', linkRoutes.responsiveAppBar.dashboard);
  expect(dashboardLink.nodeName.toLowerCase()).toBe('a');

  expect(screen.getByText(/logout/i)).toBeInTheDocument();

  expect(screen.queryByText(/registration/i)).not.toBeInTheDocument();

  // modals
  expect(screen.queryByTestId('search-dialog')).not.toBeInTheDocument();
  expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();
  expect(screen.queryByTestId('genre-search-dialog')).not.toBeInTheDocument();

  // Alert error
  expect(screen.getByText(/something wrong/i)).toBeInTheDocument();
  expect(screen.getByText(/something wrong/i)).not.toBeVisible();

  // Back to top button
  expect(BackToTop).toHaveBeenCalled();
  expect(BackToTop).toHaveBeenCalledTimes(1);
  expect(BackToTop.mock.calls[0][0]).toEqual({
    idReference: '#responsive-app-bar',
  });
});

it('right render when user is not logged in', () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <ResponsiveAppBar user={userNotLoggedIn} logOut={logOutMock} />
      </ThemeProvider>
    </MemoryRouter>,
  );

  // Only change this
  // Menu settings
  const menuSettings = screen.getByTestId(/menu-setting/i);
  expect(menuSettings).toBeInTheDocument();
  expect(menuSettings).not.toBeVisible();

  expect(within(menuSettings).queryByText(/profile/i)).not.toBeInTheDocument();
  expect(within(menuSettings).queryByText(/account/i)).not.toBeInTheDocument();
  expect(within(menuSettings).queryByText(/dashboard/i)).not.toBeInTheDocument();
  expect(within(menuSettings).queryByText(/logout/i)).not.toBeInTheDocument();

  const registrationLink = within(menuSettings).getByText(/registration/i);
  expect(registrationLink).toHaveAttribute('href', linkRoutes.responsiveAppBar.registration);
  expect(registrationLink.nodeName.toLowerCase()).toBe('a');
});

it('right handle of events', async () => {
  render(
    <ThemeProvider theme={darkTheme}>
      <MemoryRouter initialEntries={['/']}>

        <Routes>
          <Route path="/" element={<ResponsiveAppBar user={userLoggedIn} logOut={logOutMock} />} />
          <Route path="/genre/:genres" element={<div>Genre page</div>} />
        </Routes>
      </MemoryRouter>
      ,
    </ThemeProvider>,
  );

  const user = userEvent.setup();
  const searchButtons = screen.getAllByRole('button', {
    name: /search/i,
  });

  // MODALSEARCH
  expect(screen.queryByTestId('search-dialog')).not.toBeInTheDocument();
  // Button 0
  await user.click(searchButtons[0]);

  const modalSearch = screen.getByTestId('search-dialog');
  expect(modalSearch).toBeInTheDocument();
  expect(within(modalSearch).getByText(/search movies/i)).toBeInTheDocument();

  await user.click(within(modalSearch).getByRole('button', {
    name: /close/i,
  }));

  // The info of modal is hidden
  expect(within(modalSearch).getByText(/search movies/i)).not.toBeVisible();

  // button 1
  await user.click(searchButtons[1]);

  expect(modalSearch).toBeInTheDocument();
  expect(within(modalSearch).getByText(/search movies/i)).toBeVisible();

  // Right handleClose function passed
  await user.click(within(modalSearch).getByRole('button', {
    name: /close/i,
  }));

  // The info of modal is hidden
  expect(within(modalSearch).getByText(/search movies/i)).not.toBeVisible();

  // MODALNOTIFICAION
  expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();
  expect(logOutMock).not.toHaveBeenCalled();
  const logOut = screen.getByText(/logout/i);

  await user.click(logOut);

  // Right call of logOu function passed to ResponsiveAppBar
  expect(logOutMock).toHaveBeenCalledTimes(1);

  // Modal notification called with right props
  const modalNotification = screen.getByTestId('notification-dialog');
  expect(modalNotification).toBeInTheDocument();

  expect(within(modalNotification).getByText('See you soon')).toBeInTheDocument();
  expect(within(modalNotification).getByText('Successfully logged out')).toBeInTheDocument();

  // Right handleClose function passed
  await user.click(within(modalNotification).getByRole('button', {
    name: /accept/i,
  }));
  // The info of modal is hidden
  expect(within(modalNotification).getByText('See you soon')).not.toBeVisible();

  // MODALGENRE
  const genreLinks = screen.getAllByText(/^genre$/i);

  expect(screen.queryByTestId('genre-search-dialog')).not.toBeInTheDocument();
  // Button/li 0
  await user.click(genreLinks[0]);

  const modalGenre = screen.getByTestId('genre-search-dialog');
  expect(modalGenre).toBeInTheDocument();
  expect(within(modalGenre).getByText(/Find movies by genre/i)).toBeInTheDocument();

  // Right handleClose function passed
  await user.click(within(modalGenre).getByRole('button', {
    name: /close/i,
  }));

  // The info of modal is hidden
  expect(within(modalGenre).getByText(/Find movies by genre/i)).not.toBeVisible();

  // Button/li 1
  await user.click(genreLinks[1]);

  expect(modalGenre).toBeInTheDocument();
  expect(within(modalGenre).getByText(/Find movies by genre/i)).toBeInTheDocument();

  expect(screen.queryByText(genresTMDB[0].name)).not.toBeInTheDocument();
  const input = within(modalGenre).getByRole('combobox');

  // Right handleChange function passed
  act(() => input.focus());
  await user.type(input, 'action');
  await user.keyboard('[ArrowDown]');
  await user.keyboard('[Enter]');
  expect(screen.queryByText(genresTMDB[0].name)).toBeInTheDocument();

  // Right handleConfirm function passed
  await user.click(within(modalGenre).getByRole('button', {
    name: /find/i,
  }));

  expect(screen.getByText(/genre page/i)).toBeInTheDocument();
}, 100000);

it('right classes and inline styles', () => {
  render(
    <ThemeProvider theme={darkTheme}>
      <MemoryRouter>
        <ResponsiveAppBar user={userLoggedIn} logOut={logOutMock} />
      </MemoryRouter>
    </ThemeProvider>,
  );

  expect(screen.getByTestId('responsive-app-bar')).toHaveClass('responsive-app-bar');

  expect(screen.getByTestId('responsive-app-bar-container')).toHaveClass('responsive-app-bar-container');

  expect(screen.getByTestId('responsive-app-bar-hamburger')).toHaveClass('responsive-app-bar-hamburger');

  expect(screen.getByTestId('responsive-app-bar-app-icon-md900')).toHaveClass('responsive-app-bar-app-icon-md900');

  expect(screen.getByTestId('responsive-app-bar-logo-text-md900')).toHaveClass('responsive-app-bar-logo-text-md900');

  expect(screen.getByTestId('responsive-app-bar-app-icon')).toHaveClass('responsive-app-bar-app-icon');

  expect(screen.getByTestId('responsive-app-bar-logo-text')).toHaveClass('responsive-app-bar-logo-text');

  expect(screen.getByTestId('responsive-app-bar-container-left-buttons')).toHaveClass('responsive-app-bar-container-left-buttons');

  expect(screen.getByTestId('responsive-app-bar-container-search-button')).toHaveClass('responsive-app-bar-container-search-button');

  expect(screen.getByTestId('responsive-app-bar-container-genre-button')).toHaveClass('responsive-app-bar-container-genre-button');

  expect(screen.getByTestId('responsive-app-bar-container-settings-menu')).toHaveClass('responsive-app-bar-container-settings-menu');

  expect(screen.getByTestId('menu-setting')).toHaveClass('responsive-app-bar-settings-menu');

  expect(screen.getByTestId('responsive-app-bar-alert')).toHaveClass('responsive-app-bar-alert');
});
