import { LoadingButton } from '@mui/lab';
import {
  Box, Container, Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import { Navigate, useParams } from 'react-router-dom';
import throttle from 'just-throttle';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import helperFunctions from 'src/utils/helper-functions';
import ListGridMovies from 'src/components/list-movie-grid';
import useSearch from 'src/hooks/use-search';
import 'src/pages/search/styles.css';

export default function Search() {
  const { user } = useUserAuth();
  const { query } = useParams();
  const {
    data, loading, loadingNextPage, setPage, error,
  } = useSearch({ query });

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
      <Container className="page" data-testid="page-search">
        <Typography sx={{ typography: { sm: 'h2', xs: 'h3' } }} component="h1" color="secondary.light" textAlign="center">
          Movies by search
        </Typography>
        <Typography className="total-results-margin" data-testid="total-results-margin" variant="h5" component="h2">{`Total: ${data?.total_results}`}</Typography>
        <Box className="list-break-word" data-testid="list-break-word">
          <Typography color="primary.light" variant="body1" component="p">
            Query:
            {' '}
            {query ? `"${decodeURIComponent(query)}"` : ''}
          </Typography>
        </Box>
        <ListGridMovies list={data.results} />
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
