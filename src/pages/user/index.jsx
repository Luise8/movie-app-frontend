import {
  Container,
  Divider,
  Typography,
  useTheme, Grid, Paper,
} from '@mui/material';
import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import helperFunctions from 'src/utils/helper-functions';
import appResourcesPath from 'src/utils/app-resources-path';
import 'src/pages/user/styles.css';
import linkRoutes from 'src/utils/link-routes';
import ListMovieLists from 'src/components/list-movie-lists';
import CardRateUser from 'src/components/card-rate-user';
import ListGeneric from 'src/components/list-generic';
import CardReviewUser from 'src/components/card-review-user';
import useUser from 'src/hooks/use-user';

export default function User() {
  const { user } = useUserAuth();
  const { id } = useParams();
  const {
    data, loading, error,
  } = useUser(id);

  const theme = useTheme();

  if (loading || helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (error?.status === 404) return <Navigate to="/404" />;

  if (error) return <Navigate to="/error" />;

  return (
    <PageLayout>
      <Container
        className="page page-user"
        data-testid="page-user"
      >
        <Grid
          container
          rowGap={3}
          columnGap={1}
          justifyContent="space-between"
          alignItems="flex-start"
          data-testid="page-user-header"
        >
          <Grid
            container
            item
            columnSpacing={1}
            rowSpacing={2}
            sm={8}
            xs={12}
            sx={{
              wordBreak: 'break-word',
            }}
            data-testid="page-user-header-main"
          >
            <Grid
              item
              data-testid="page-user-container-photo-profile"
              className="page-user-container-photo-profile"
            >
              <img src={data.photo ? data.photo : appResourcesPath.userDefaultIcon} alt="" />

            </Grid>
            <Grid item alignSelf="center">
              <Typography variant="h6">
                {data.username}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              Member since:
              {' '}
              <Typography variant="body2">
                {new Date(data.date).toUTCString()}
              </Typography>
            </Grid>
            {data.bio && (
              <Grid item xs={12}>
                Bio:
                {' '}
                <Typography variant="body2">
                  {data.bio}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid
            className="page-user-header-aside"
            data-testid="page-user-header-aside"
            container
            item
            gap={1}
            sm={3}
            xs={12}
            direction="column"
            alignItems="flex-start"
            component={Paper}
            elevation={3}
          >
            <Grid item xs={12}>
              <Typography>Links</Typography>
            </Grid>
            {user && user.id === id
              && (
              <Grid
                item
                xs={12}
                component={Link}
                to={linkRoutes.user.editUser}
                color="primary.light"
              >
                Edit profile
              </Grid>
              )}
            <Grid
              item
              component={Link}
              to={linkRoutes.user.lists(id)}
              color="primary.light"
            >
              Lists
            </Grid>
            {user && user.id === id
              && (
              <Grid
                item
                component={Link}
                to={linkRoutes.user.watchlist(id)}
                color="primary.light"
              >
                Watchlist
              </Grid>
              )}
            <Grid
              item
              component={Link}
              to={linkRoutes.user.reviews(id)}
              color="primary.light"
            >
              Reviews
            </Grid>
            <Grid
              item
              component={Link}
              to={linkRoutes.user.rates(id)}
              color="primary.light"
            >
              Rates
            </Grid>
          </Grid>
        </Grid>
        <Divider flexItem />
        <Typography variant="h4" component="h1">
          Latest from user
        </Typography>
        <Container
          data-testid="page-user-section-lists"
          component="section"
        >
          <Typography
            className="section-header"
            component={Link}
            to={linkRoutes.user.lists(id)}
            variant="h5"
            color="text.primary"
            sx={{
              borderLeft: `5px solid ${theme.palette.primary.main}`,
            }}
          >
            Lists
          </Typography>
          {data.lists.length === 0 ? 'There are not activity.' : <ListMovieLists list={data.lists} />}
        </Container>

        <Divider flexItem />
        <Container
          data-testid="page-user-section-rates"
          component="section"
        >
          <Typography
            className="section-header"
            component={Link}
            to={linkRoutes.user.rates(id)}
            variant="h5"
            color="text.primary"
            sx={{
              borderLeft: `5px solid ${theme.palette.primary.main}`,
            }}
          >
            Rates
          </Typography>
          {data.rates.length === 0 ? 'There are not activity.' : (
            <Grid
              container
              className="page-user-container-rates"
              rowSpacing={2}
              direction="column"
            >
              {data.rates.map((item) => (
                <Grid
                  item
                  xs={5}
                  key={item.id}
                >
                  <CardRateUser data={item} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        <Divider flexItem />
        <Container
          data-testid="page-user-section-reviews"
          component="section"
        >
          <Typography
            className="section-header"
            component={Link}
            to={linkRoutes.user.reviews(id)}
            variant="h5"
            color="text.primary"
            sx={{
              borderLeft: `5px solid ${theme.palette.primary.main}`,
            }}
          >
            Reviews
          </Typography>
          {data.reviews.length === 0 ? 'There are not activity.' : <ListGeneric propKey="id" list={data.reviews} renderItem={CardReviewUser} />}
        </Container>

      </Container>
    </PageLayout>
  );
}
