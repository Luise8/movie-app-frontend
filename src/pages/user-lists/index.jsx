import { LoadingButton } from '@mui/lab';
import {
  Box, Button, Container, Grid, Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import { Link, Navigate, useParams } from 'react-router-dom';
import throttle from 'just-throttle';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import linkRoutes from 'src/utils/link-routes';
import helperFunctions from 'src/utils/helper-functions';
import ListMovieLists from 'src/components/list-movie-lists';
import useUserLists from 'src/hooks/use-user-lists';

export default function UserLists() {
  const { user } = useUserAuth();
  const { id } = useParams();
  const {
    data, loading, loadingNextPage, setPage, error,
  } = useUserLists({ id });

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
      <Container className="page" data-testid="page-user-lists">
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
          Lists
        </Typography>
        <Typography className="total-results-margin" data-testid="total-results-margin" variant="h5" component="h2">{`Total: ${data?.total}`}</Typography>
        {id === user?.id
          && (
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button
                component={Link}
                to={linkRoutes.userLists}
                variant="contained"
                color="primary"
                endIcon={<AddCircleOutlineSharpIcon />}
              >
                Create List
              </Button>
            </Grid>
          </Grid>
          )}
        <ListMovieLists list={data.results} />
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
