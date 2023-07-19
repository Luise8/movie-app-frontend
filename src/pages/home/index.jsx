import {
  Box,
  Container,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import helperFunctions from 'src/utils/helper-functions';
import Carousel from 'react-material-ui-carousel';
import { images } from 'src/utils/tmdb-resources-url';
import ListGridMovies from 'src/components/list-movie-grid';
import 'src/pages/home/styles.css';
import uniqid from 'uniqid';
import linkRoutes from 'src/utils/link-routes';
import useHome from 'src/hooks/use-home';

export default function Home() {
  const { user } = useUserAuth();
  const {
    rated, latest, popular, trending, loading, error, header,
  } = useHome();

  const theme = useTheme();

  if (loading || helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (error?.status === 404) return <Navigate to="/404" />;

  if (error) return <Navigate to="/error" />;

  return (
    <PageLayout mainBgColor="#000">
      <Container
        className="page page-home"
        data-testid="page-home"
      >
        <Box
          className="page-home-header"
          data-testid="page-home-header"
          component="header"
        >
          <Carousel
            className="page-home-carousel-header"
            animation="slide"
            autoPlay={false}
            indicators={false}
            navButtonsAlwaysVisible
          >
            {
              header.map((item) => (
                <Box
                  key={uniqid()}
                  sx={{
                    position: 'relative',
                  }}
                  className="page-home-container-img-header"
                  data-testid="page-home-container-img-header"
                >
                  <img
                    key={item.id}
                    alt=""
                    src={images.backdropSize1280(item.backdrop_path)}
                  />
                  <Box
                    className="page-home-container-title-movie-header"
                    data-testid="page-home-container-title-movie-header"
                  >
                    <Typography
                      sx={{ typography: { md: 'h4', sm: 'h5', xs: 'body1' } }}
                      component="h2"
                      color="text.primary"
                      textAlign="center"
                    >
                      {item.title}
                    </Typography>
                  </Box>
                </Box>
              ))
}
          </Carousel>
          <Box className="page-home-cover-header" data-testid="page-home-cover-header">
            <Typography
              sx={{ typography: { md: 'h5', sm: 'body1', xs: 'body2' }, zIndex: '3' }}
              component="h1"
              color="text.secondary"
            >
              Trending today
            </Typography>
          </Box>
        </Box>
        <Divider flexItem />
        <Container
          data-testid="page-home-section-popular"
          component="section"
        >
          <Typography
            className="section-header"
            component={Link}
            to={linkRoutes.home.popular}
            variant="h5"
            color="text.primary"
            sx={{
              borderLeft: `5px solid ${theme.palette.primary.main}`,
            }}
          >
            Popular
          </Typography>
          {popular.results.length === 0
            ? <Typography color="text.secondary">There are not movies.</Typography>
            : (
              <Carousel
                animation="slide"
                autoPlay={false}
                indicators={false}
                navButtonsAlwaysVisible
              >
                {
              popular.popularGroups.map((item) => (
                <Box
                  className="page-home-container-items"
                  data-testid="page-home-container-items"
                  key={uniqid()}
                >
                  <ListGridMovies list={item} wrap="noWrap" />
                </Box>
              ))
}
              </Carousel>
            )}
        </Container>

        <Divider flexItem />
        <Container
          data-testid="page-home-section-latest"
          component="section"
        >
          <Typography
            className="section-header"
            component={Link}
            to={linkRoutes.home.latest}
            variant="h5"
            color="text.primary"
            sx={{
              borderLeft: `5px solid ${theme.palette.primary.main}`,
            }}
          >
            Latest
          </Typography>
          {latest.results.length === 0
            ? <Typography color="text.secondary">There are not movies.</Typography>
            : (
              <Carousel
                animation="slide"
                autoPlay={false}
                indicators={false}
                navButtonsAlwaysVisible
              >
                {
              latest.latestGroups.map((item) => (
                <Box
                  className="page-home-container-items"
                  key={uniqid()}
                >
                  <ListGridMovies list={item} wrap="noWrap" />
                </Box>
              ))
}
              </Carousel>
            )}
        </Container>

        <Divider flexItem />
        <Container
          data-testid="page-home-section-trending"
          component="section"
        >
          <Typography
            className="section-header"
            component={Link}
            to={linkRoutes.home.trending}
            variant="h5"
            color="text.primary"
            sx={{
              borderLeft: `5px solid ${theme.palette.primary.main}`,
            }}
          >
            Trending
          </Typography>
          {trending.results.length === 0
            ? <Typography color="text.secondary">There are not movies.</Typography>
            : (
              <Carousel
                animation="slide"
                autoPlay={false}
                indicators={false}
                navButtonsAlwaysVisible
              >
                {
              trending.trendingGroups.map((item) => (
                <Box
                  className="page-home-container-items"
                  key={uniqid()}
                >
                  <ListGridMovies list={item} wrap="noWrap" />
                </Box>
              ))
}
              </Carousel>
            )}
        </Container>
        <Divider flexItem />
        <Container
          data-testid="page-home-section-rated"
          component="section"
        >
          <Typography
            className="section-header"
            component={Link}
            to={linkRoutes.home.rated}
            variant="h5"
            color="text.primary"
            sx={{
              borderLeft: `5px solid ${theme.palette.primary.main}`,
            }}
          >
            Rated by the comunity
          </Typography>
          {rated.results.length === 0
            ? <Typography color="text.secondary">There are not movies.</Typography>
            : (
              <Carousel
                animation="slide"
                autoPlay={false}
                indicators={false}
                navButtonsAlwaysVisible

              >
                {
              rated.ratedGroups.map((item) => (
                <Box
                  className="page-home-container-items"
                  key={uniqid()}
                >
                  <ListGridMovies list={item} wrap="noWrap" />
                </Box>
              ))
}
              </Carousel>
            )}
        </Container>
      </Container>
    </PageLayout>
  );
}
