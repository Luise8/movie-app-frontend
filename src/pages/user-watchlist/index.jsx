import { LoadingButton } from '@mui/lab';
import {
  Box, Button, Container, Grid, Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import {
  Link, Navigate, useParams,
} from 'react-router-dom';
import throttle from 'just-throttle';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import linkRoutes from 'src/utils/link-routes';
import helperFunctions from 'src/utils/helper-functions';
import HandymanSharpIcon from '@mui/icons-material/HandymanSharp';
import CardMovieMedium from 'src/components/card-movie-medium';
import ListGeneric from 'src/components/list-generic';
import 'src/pages/user-watchlist/styles.css';
import useWatchlist from 'src/hooks/use-watchlist';

export default function UserWatchlist() {
  const { user } = useUserAuth();
  const { id } = useParams();
  const {
    data, loading, loadingNextPage, setPage, error,
  } = useWatchlist({ id });

  const debounceHandleNextPage = useMemo(() => throttle(
    () => setPage((prevPage) => prevPage + 1),
    3000,
    { leading: true },
  ), [setPage]);

  if (loading || helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (error?.status === 404) return <Navigate to="/404" />;

  if (error) return <Navigate to="/error" />;

  return (
    <PageLayout>
      <Container className="page" data-testid="page-user-watchlist">
        <Box className="page-container-button-user" data-testid="page-container-button-user">
          <Button
            component={Link}
            to={linkRoutes.userProfile(id)}
            sx={{
              color: 'primary.light',
            }}
          >
            See profile of
            {' '}
            { data.user_details.username }
          </Button>
        </Box>
        <Typography sx={{ typography: { sm: 'h2', xs: 'h3' } }} component="h1" color="secondary.light">
          Watchlist
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          className="total-results-margin"
          data-testid="total-results-margin"
        >
          {`Total: ${data?.total}`}

        </Typography>
        {data.user_details.id === user?.id
          && (
          <Grid container className="page-watchlist-container-edit-button" data-testid="page-watchlist-container-edit-button">
            <Grid item>
              <Button
                component={Link}
                to={linkRoutes.watchlist}
                variant="contained"
                color="info"
                endIcon={<HandymanSharpIcon />}
              >
                Edit List
              </Button>
            </Grid>
          </Grid>
          )}
        <ListGeneric list={data.results} renderItem={CardMovieMedium} />
        <Box className="page-container-button-more" data-testid="page-container-button-more">
          <LoadingButton
            color="secondary"
            onClick={debounceHandleNextPage}
            loading={loadingNextPage}
            loadingPosition="end"
            endIcon={<AddCircleOutlineSharpIcon />}
            variant={loadingNextPage || data.next_page === '' ? 'outlined' : 'contained'}
            disabled={data.next_page === ''}
          >
            More
          </LoadingButton>
        </Box>
      </Container>
    </PageLayout>
  );
}
