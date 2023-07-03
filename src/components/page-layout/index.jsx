import React from 'react';
import PropTypes from 'prop-types';
import Footer from 'src/components/footer';
import RecaptchaCredits from 'src/components/recaptcha-credits';
import ResponsiveAppBar from 'src/components/responsive-app-bar';
import { Container } from '@mui/material';
import 'src/components/page-layout/styles.css';
import { useUserAuth } from 'src/context/auth';

export default function PageLayout({ mainBgColor, children }) {
  const { user, logOutContext } = useUserAuth();

  return (
    <Container data-testid="page-layout" className="page-layout">
      <ResponsiveAppBar user={user} logOut={logOutContext} />
      <main className="container-main" data-testid="container-main" style={{ backgroundColor: mainBgColor }}>
        {children}
      </main>
      <RecaptchaCredits />
      <Footer />
    </Container>
  );
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  mainBgColor: PropTypes.string,
};

PageLayout.defaultProps = {
  mainBgColor: '',
};
