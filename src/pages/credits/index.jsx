import React from 'react';
import PageLayout from 'src/components/page-layout';
import {
  Container, Box, Typography, Link,
} from '@mui/material';
import Loading from 'src/components/loading';
import helperFunctions from 'src/utils/helper-functions';
import { useUserAuth } from 'src/context/auth';
import appResourcesPath from 'src/utils/app-resources-path';
import 'src/pages/credits/styles.css';

export default function Credits() {
  const { user } = useUserAuth();

  if (helperFunctions.isObjectEmpty(user)) return <Loading />;

  return (
    <PageLayout>
      <Container className="page page-credits" data-testid="page-credits">
        <Box className="page-credits-container-info">
          <Typography variant="h3" component="h1">Credits</Typography>

          <Typography variant="h5" component="h2">Film data</Typography>
          <Typography>
            All film-related metadata used in this website, including movies, synopses,
            release dates, trailers and poster art
            is supplied by
            {' '}
            <Link
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              color="primary.light"
            >
              The Movie Database
            </Link>
            {' '}
            (TMDb).
          </Typography>
          <Box className="page-credits-container-tmdb-logo">
            <img src={appResourcesPath.tmdbLogo} alt="tmdb" />
          </Box>
          <Typography>
            To make it clear: This product uses the TMDB API but is not endorsed or
            certified by TMDB.
          </Typography>
        </Box>
      </Container>
    </PageLayout>
  );
}
