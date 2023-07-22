import React from 'react';
import PageLayout from 'src/components/page-layout';
import {
  Container, Button, Grid, Paper, Divider, Avatar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import 'src/pages/registration/styles.css';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Loading from 'src/components/loading';
import helperFunctions from 'src/utils/helper-functions';
import { useUserAuth } from 'src/context/auth';

export default function Registration() {
  const { user } = useUserAuth();

  if (helperFunctions.isObjectEmpty(user)) return <Loading />;

  return (
    <PageLayout>
      <Container className="page page-registration" data-testid="page-registration">
        <Grid
          data-testid="page-registration-grid-container"
          component={Paper}
          elevation={2}
          container
          justifyContent="center"
          alignItems="center"
          width="500px"
          maxWidth="90vw"
          height="400px"
          p={1}
        >
          <Grid
            container
            data-testid="page-registration-grid-items"
            item
            gap={1}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Avatar data-testid="avatar" sx={{ bgcolor: 'info.main' }}>
                <LockOutlinedIcon />
              </Avatar>
            </Grid>
            <Grid item>Create a new account</Grid>
            <Grid
              item
            >
              <Button
                component={Link}
                to={linkRoutes.registration.signUp}
                variant="contained"
              >
                Sign up
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Divider
              flexItem
            >
              Or
            </Divider>
          </Grid>
          <Grid
            container
            item
            gap={1}
            direction="column"
            justifyContent="center"
            alignItems="center"
            data-testid="page-registration-grid-items"
          >
            <Grid item>
              <Avatar data-testid="avatar" sx={{ bgcolor: 'info.main' }} />
            </Grid>
            <Grid item>
              Log in to your account
            </Grid>
            <Grid
              item
            >
              <Button
                component={Link}
                to={linkRoutes.registration.logIn}
                variant="contained"
              >
                Log in
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </PageLayout>
  );
}
