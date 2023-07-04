import { Button, Container } from '@mui/material';
import React from 'react';
import appResourcesPath from 'src/utils/app-resources-path';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import 'src/pages/error/styles.css';
import { Link } from 'react-router-dom';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import helperFunctions from 'src/utils/helper-functions';

export default function Error() {
  /* const { user } = useUserAuth(); */
  const user = null;

  if (helperFunctions.isObjectEmpty(user)) return <Loading />;

  return (
    <PageLayout>
      <Container className="error" data-testid="page">
        <Grid container className="error-container" data-testid="error-container">
          <Grid item className="error-container-image" data-testid="error-container-image">
            <img aria-hidden="true" src={appResourcesPath.errorIcon} alt="Sign with the word oops" />
          </Grid>
          <Grid item>
            <Typography variant="h2" component="h1" color="error.dark" textAlign="center">
              Something wrong
            </Typography>
          </Grid>
          <Grid>
            <Button
              component={Link}
              variant="contained"
              to="/"
              color="error"
              sx={{
                color: 'background.default',
              }}
            >
              Go back home
            </Button>
          </Grid>
        </Grid>
      </Container>
    </PageLayout>
  );
}
