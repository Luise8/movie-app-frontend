import {
  render, screen, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import darkTheme from 'src/utils/darkTheme';
import linkRoutes from 'src/utils/link-routes';
import Footer from 'src/components/footer';
import { MemoryRouter } from 'react-router-dom';

it('right render', () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <Footer />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  expect(screen.getByTestId('footer')).toBeInTheDocument();
  const footer = screen.getByRole('contentinfo');
  expect(footer).toBeInTheDocument();

  const githubLinkOne = within(footer).getByRole('link', {
    name: /Created by Luis E. Gamez/i,
  });
  expect(githubLinkOne).toHaveAttribute('href', linkRoutes.footer.github);

  const creditsLink = within(footer).getByRole('link', {
    name: /credits/i,
  });
  expect(creditsLink).toHaveAttribute('href', linkRoutes.footer.credits);

  const websiteLink = within(footer).getByRole('link', {
    name: /Website for Luis E. Gamez/i,
  });
  expect(websiteLink).toHaveAttribute('href', linkRoutes.footer.website);

  const githubLinkTwo = within(footer).getByRole('link', {
    name: /Github account for Luis E. Gamez/i,
  });
  expect(githubLinkTwo).toHaveAttribute('href', linkRoutes.footer.github);

  const linkedinLink = within(footer).getByRole('link', {
    name: /Linkedin account for Luis E. Gamez/i,
  });
  expect(linkedinLink).toHaveAttribute('href', linkRoutes.footer.linkedin);
});

it('right classes and inline styles', () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <Footer />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );

  expect(screen.getByTestId('footer')).toHaveClass('footer');

  expect(screen.getByTestId('footer-container-links')).toHaveClass('footer-container-links');
});
