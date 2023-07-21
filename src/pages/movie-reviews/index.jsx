import { LoadingButton } from '@mui/lab';
import {
  Box, Container, Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import { Link, Navigate, useParams } from 'react-router-dom';
import throttle from 'just-throttle';
import ListGeneric from 'src/components/list-generic';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import linkRoutes from 'src/utils/link-routes';
import helperFunctions from 'src/utils/helper-functions';
import CardReviewMovie from 'src/components/card-review-movie';
import useReviewsMovie from 'src/hooks/use-reviews-movie';
import 'src/pages/movie-reviews/styles.css';
import appResourcesPath from 'src/utils/app-resources-path';

export default function MovieReviews() {
  const { user } = useUserAuth();
  const { id } = useParams();
  const {
    data, loading, loadingNextPage, setPage, error,
  } = useReviewsMovie({ id });

  const debounceHandleNextPage = useMemo(() => throttle(
    () => setPage((prevPage) => prevPage + 1),
    3000,
    { leading: true },
  ), [setPage]);

  if (loading || helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (error?.status === 404) return <Navigate to="/404" />;

  if (error) return <Navigate to="/error" />;

  const releaseDate = data.movie_details.release_date && typeof data.movie_details.release_date === 'string' ? ` (${data.movie_details.release_date.slice(0, 4)})` : '';

  return (
    <PageLayout>
      <Container className="page" data-testid="page-movie-reviews">
        <Typography
          variant="h5"
          component={Link}
          className="page-movie-reviews-movie-title"
          data-testid="page-movie-reviews-movie-title"
          to={linkRoutes.reviewsMovie(id)}
          color="primary.main"
        >
          {`${data.movie_details.name}${releaseDate}`}
        </Typography>
        <Typography sx={{ typography: { sm: 'h2', xs: 'h3' } }} component="h1" color="secondary.light">
          Reviews
        </Typography>
        <Box
          className="page-movie-reviews-container-img"
          data-testid="page-movie-reviews-container-img"
          component={Link}
          to={linkRoutes.reviewsMovie(id)}
        >
          <img
            src={data.movie_details.photo
              ? data.movie_details.photo
              : appResourcesPath.cardMovieSmall}
            alt={data.movie_details.name}
          />
        </Box>
        <Typography className="total-results-margin" data-testid="total-results-margin" variant="h5" component="h2">{`Total: ${data?.total}`}</Typography>
        <ListGeneric propKey="id" list={data.results} renderItem={CardReviewMovie} />
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
