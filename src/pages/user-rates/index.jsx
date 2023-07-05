import { LoadingButton } from '@mui/lab';
import {
  Box, Button, Container, Grid, Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import useRatesUser from 'src/hooks/use-rates-user';
import { Link, Navigate, useParams } from 'react-router-dom';
import throttle from 'just-throttle';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import CardRateUser from 'src/components/card-rate-user';
import helperFunctions from 'src/utils/helper-functions';
import linkRoutes from 'src/utils/link-routes';

export default function UserRates() {
  const { user } = useUserAuth();
  const { id } = useParams();
  const {
    data, loading, loadingNextPage, setPage, error,
  } = useRatesUser({ id });

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
      <Container className="page" data-testid="page-user-rates">
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
        <Typography sx={{ typography: { sm: 'h2', xs: 'h3' } }} component="h1" color="secondary.light" align="center">
          Rates
        </Typography>
        <Typography variant="h5" component="h2">{`Total: ${data?.total}`}</Typography>
        <Grid
          container
          sx={{
            alignItems: 'center',
          }}
          rowSpacing={2}
          direction="column"
        >
          {data.results.map((item) => (
            <Grid
              item
              xs={12}
              key={item.id}
            >
              <CardRateUser data={item} />
            </Grid>
          ))}
        </Grid>
        <Box
          className="page-container-button-more"
          data-testid="page-container-button-more"
        >
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
