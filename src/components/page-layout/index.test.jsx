import {
  render, screen, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import PageLayout from 'src/components/page-layout';

jest.mock('src/context/auth', () => ({

  useUserAuth: jest.fn(() => Promise.resolve({
    user: {
      id: '123',
      username: 'userNumber1',
    },
  })),
}));

jest.mock('src/components/responsive-app-bar', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="responsive-app-bar" />),
}));

jest.mock('src/components/recaptcha-credits', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="recaptcha-credits" />),
}));

jest.mock('src/components/footer', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="footer" />),
}));

function TestComponent() {
  return <div>Children</div>;
}

it('right render of data', () => {
  render(
    <PageLayout>
      <TestComponent />
    </PageLayout>,
  );

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const responsiveAppBar = within(pageLayout).getByTestId('responsive-app-bar');
  expect(responsiveAppBar).toBeInTheDocument();

  const containerMain = within(pageLayout).getByRole('main');
  expect(containerMain).toBeInTheDocument();
  expect(containerMain).toHaveAttribute('data-testid', 'container-main');

  const childrenComponent = within(containerMain).getByText(/children/i);
  expect(childrenComponent).toBeInTheDocument();

  const recaptchaCredits = within(pageLayout).getByTestId('recaptcha-credits');
  expect(recaptchaCredits).toBeInTheDocument();

  const footer = within(pageLayout).getByTestId('footer');
  expect(footer).toBeInTheDocument();
});

it('right render when pass the mainBgColor', () => {
  const mainBgColor = 'red';
  render(
    <PageLayout mainBgColor={mainBgColor}>
      <TestComponent />
    </PageLayout>,
  );

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const containerMain = within(pageLayout).getByTestId('container-main');

  expect(containerMain).toHaveStyle(`background-color: ${mainBgColor}`);
});

it('right classes', () => {
  render(
    <PageLayout>
      <TestComponent />
    </PageLayout>,
  );

  expect(screen.getByTestId('page-layout')).toHaveClass('page-layout');

  expect(screen.getByTestId('container-main')).toHaveClass('container-main');
});
