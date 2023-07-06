/* eslint-disable react/jsx-no-bind */
import { LoadingButton } from '@mui/lab';
import {
  Box, Button, Container, Grid, Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import {
  Link, Navigate, useNavigate, useParams,
} from 'react-router-dom';
import throttle from 'just-throttle';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import linkRoutes from 'src/utils/link-routes';
import helperFunctions from 'src/utils/helper-functions';
import useOneListUser from 'src/hooks/use-one-list-user';
import HandymanSharpIcon from '@mui/icons-material/HandymanSharp';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import CardMovieMedium from 'src/components/card-movie-medium';
import ListGeneric from 'src/components/list-generic';
import 'src/pages/user-one-list/styles.css';
import ModalConfirmation from 'src/components/modal-confirmation';
import { deleteList } from 'src/services/list-write';
import ModalNotification from 'src/components/modal-notification';

export default function UserOneList() {
  const { user } = useUserAuth();
  const { userId, listId } = useParams();
  const {
    data, loading, loadingNextPage, setPage, error,
  } = useOneListUser({ userId, listId });
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [modalNotificationDeleted, setModalNotificationDeleted] = useState(false);
  const navigate = useNavigate();

  const debounceHandleNextPage = useMemo(() => throttle(
    () => setPage((prevPage) => prevPage + 1),
    3000,
    { leading: true },
  ), [setPage]);

  const debounceHandleConfirmation = useMemo(() => throttle(
    async () => {
      try {
        await deleteList({ userId, listId });
        setModalConfirmation(false);
        setModalNotificationDeleted(true);
      } catch (e) {
        navigate('/error');
        setModalConfirmation(false);
      }
    },
    5000,
    { leading: true },
  ), [userId, listId, navigate]);

  function handleOpenModalConfirmation() {
    setModalConfirmation(true);
  }

  function handleCloseModalConfirmation() {
    setModalConfirmation(false);
  }

  function handleCloseModalNotificationDeleted() {
    navigate('/');
    setModalNotificationDeleted(false);
  }

  if (loading || helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (error?.status === 404) return <Navigate to="/404" />;

  if (error) return <Navigate to="/error" />;

  return (
    <PageLayout>
      <Container className="page" data-testid="page-user-one-list">
        <Box className="page-container-button-user" data-testid="page-container-button-user">
          <Button
            component={Link}
            to={linkRoutes.userProfile(userId)}
            sx={{
              color: 'primary.light',
            }}
          >
            See profile of
            {' '}
            { data.user_details.username }
          </Button>
        </Box>
        <Box className="page-user-one-list-break-word" data-testid="page-user-one-list-break-word">
          <Typography sx={{ typography: { sm: 'h2', xs: 'h3' } }} component="h1" color="secondary.light">
            List:
            {' '}
            {data.name }
          </Typography>

          <Typography variant="h5" component="h2">{`Total: ${data?.total}`}</Typography>

          <Typography variant="body1" component="p">{data.description}</Typography>

          <Typography variant="body2" component="p" color="text.secondary">
            Created
            {' '}
            {new Date(data.date).toUTCString()}
          </Typography>
        </Box>
        {data.user_details.id === user?.id
          && (
          <Grid container className="page-user-one-list-container-edit-buttons" data-testid="page-user-one-list-container-edit-buttons">
            <Grid item>
              <Button
                component={Link}
                to={linkRoutes.listEditForm({ userId, listId })}
                variant="contained"
                color="info"
                endIcon={<HandymanSharpIcon />}
              >
                Edit List
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleOpenModalConfirmation}
                variant="contained"
                color="error"
                sx={{
                  color: 'background.default',
                }}
                endIcon={<HighlightOffSharpIcon />}
              >
                Delete List
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
        <ModalConfirmation body={'Are you sure you want to delete the list? Can\'t get it back after?'} title="The list will be deleted" open={modalConfirmation} handleClose={handleCloseModalConfirmation} handleConfirm={debounceHandleConfirmation} />
        <ModalNotification title="Successfully deleted" body="List deleted successfully" handleClose={handleCloseModalNotificationDeleted} open={modalNotificationDeleted} />
      </Container>
    </PageLayout>
  );
}
