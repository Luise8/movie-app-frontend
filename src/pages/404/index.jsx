import { Button, Container } from '@mui/material';
import React from 'react';
import appResourcesPath from 'src/utils/app-resources-path';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import 'src/pages/404/styles.css';
import { Link } from 'react-router-dom';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import helperFunctions from 'src/utils/helper-functions';

export default function PageNotFound() {
  const { user } = useUserAuth();

  if (helperFunctions.isObjectEmpty(user)) return <Loading />;

  return (
    <PageLayout>
      <Container className="e404" data-testid="page">
        <Grid container className="e404-container" data-testid="e404-container">
          <Grid item className="e404-container-image" data-testid="e404-container-image">
            <img aria-hidden="true" src={appResourcesPath.e404} alt="Woman looking at the horizon" />
          </Grid>
          <Grid item>
            <Typography variant="h2" component="h1" color="warning.dark" textAlign="center">
              404 - Not Found
            </Typography>
          </Grid>
          <Grid>
            <Button
              component={Link}
              variant="contained"
              to="/"
              color="warning"
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
