import { LoadingButton } from '@mui/lab';
import {
  Box, Button, Container, Grid, Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
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
import { deleteRate } from 'src/services/rate-write';
import ModalNotification from 'src/components/modal-notification';
import ModalConfirmation from 'src/components/modal-confirmation';

export default function UserRates() {
  const { user, removeItem } = useUserAuth();
  const { id } = useParams();
  const [modalDeleted, setModalDeleted] = useState(false);
  const {
    data, loading, loadingNextPage, setPage, error, setError, setLoading,
  } = useRatesUser({ id, modalDeleted });
  const [selectedResource, setSelectedResource] = useState({});

  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);

  const debounceHandleNextPage = useMemo(() => throttle(
    () => setPage((prevPage) => prevPage + 1),
    3000,
    { leading: true },
  ), [setPage]);

  const handleOpenDeleted = () => {
    setModalDeleted(true);
  };

  const handleCloseDeleted = () => {
    setModalDeleted(false);
  };

  const debounceHandleConfirmDelete = useMemo(() => throttle(
    async () => {
      try {
        setLoading(true);
        await deleteRate({
          movieId: selectedResource.movieId,
          rateId: selectedResource.rateId,
        });

        setSelectedResource({});
        setModalConfirmDelete(false);
        handleOpenDeleted();
      } catch (e) {
        setError(e);
        setLoading(false);
        setModalConfirmDelete(false);
      }
    },
    3000,
    { leading: true },
  ), [
    selectedResource.rateId, selectedResource.movieId, setError, setLoading]);

  const handleCloseConfirmDeleted = () => {
    setModalConfirmDelete(false);
    setSelectedResource({});
  };

  if (loading || helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (error?.status === 404) return <Navigate to="/404" />;

  if (error?.status === 401 && id === user?.id) {
    // Chaeck if the user is the owner of the resource
    removeItem('user');
    return <Navigate to="/registration" />;
  }

  if (error) return <Navigate to="/error" />;

  let handleDelete;
  if (user?.id === id) {
    handleDelete = ({ rateId, movieId }) => {
      setModalConfirmDelete(true);
      setSelectedResource({
        rateId,
        movieId,
      });
    };
  }

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
        <Typography
          variant="h5"
          component="h2"
          className="total-results-margin"
          data-testid="total-results-margin"
        >
          {`Total: ${data?.total}`}

        </Typography>
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
              <CardRateUser data={{ ...item, handleDelete }} />
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

        <ModalConfirmation body={'Are you sure you want to delete the resource? Can\'t get it back after?'} title="The resource will be deleted" open={modalConfirmDelete} handleClose={handleCloseConfirmDeleted} handleConfirm={debounceHandleConfirmDelete} />
        <ModalNotification title="Successfully deleted" body="Resource deleted successfully" handleClose={handleCloseDeleted} open={modalDeleted} />
      </Container>
    </PageLayout>
  );
}
