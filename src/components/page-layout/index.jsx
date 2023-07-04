import React from 'react';
import PropTypes from 'prop-types';
import Footer from 'src/components/footer';
import RecaptchaCredits from 'src/components/recaptcha-credits';
import ResponsiveAppBar from 'src/components/responsive-app-bar';
import { Container } from '@mui/material';
import 'src/components/page-layout/styles.css';

export default function PageLayout({ mainBgColor, children }) {
  return (
    <Container data-testid="page-layout" className="page-layout">
      <ResponsiveAppBar />
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
