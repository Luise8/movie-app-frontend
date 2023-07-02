import { Container, Link, useTheme } from '@mui/material';
import React from 'react';
import Box from '@mui/material/Box';

export default function RecaptchaCredits() {
  const theme = useTheme();
  return (
    <Container sx={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '10px',
      marginTop: '10px',
    }}
    >
      <Box sx={{
        backgroundColor: theme.palette.grey[900], width: '500px', maxWidth: '90vw', padding: '5px', margin: 'auto', textAlign: 'center',
      }}
      >
        This site is protected by reCAPTCHA and the Google
        {' '}
        <Link color="primary.light" href="https://policies.google.com/privacy">Privacy Policy</Link>
        {' '}
        and
        {' '}
        <Link color="primary.light" href="https://policies.google.com/terms">Terms of Service</Link>
        {' '}
        apply.
      </Box>
    </Container>
  );
}
