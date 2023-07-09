import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box, Button, Collapse, Container, Grid, IconButton, Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import {
  Link, Navigate,
} from 'react-router-dom';
import throttle from 'just-throttle';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import linkRoutes from 'src/utils/link-routes';
import helperFunctions from 'src/utils/helper-functions';
import 'src/pages/watchlist-form/styles.css';
import useWatchlistLight from 'src/hooks/use-watchlist-light';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import editWatchist from 'src/services/watchlist-write';
import CloseIcon from '@mui/icons-material/Close';
import ListDroppable from 'src/components/list-droppable';
import CardMovieEditItem from 'src/components/card-movie-edit-item';
import ModalNotification from 'src/components/modal-notification';
import ReplayIcon from '@mui/icons-material/Replay';

export default function WatchlistForm() {
  const { user, removeItem } = useUserAuth();
  const {
    initialData, loading, initialError, list, setList, setInitialData,
  } = useWatchlistLight(user.id);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [error, setError] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const debounceHandleSave = useMemo(() => throttle(
    async () => {
      try {
        setIsLoadingSave(true);
        setError(false);
        const response = await editWatchist({
          userId: user.id,
          movies: list.slice().map((item) => item.idTMDB),
        });
        if (response.movies.length !== list.length) {
          throw new Error('Somtheing wrong');
        }
        const newList = list.slice();
        const newIds = newList.map((item) => item.id);
        setInitialData((prevData) => ({
          ...prevData, results: newList, total: newIds.length, watchlistTotalIds: newIds,
        }));
        setIsUpdated(true);
        setIsLoadingSave(false);
      } catch (e) {
        // here the conditional of error
        if (e.errors) {
          const message = e.errors.map((err) => err.msg).join('\r\n');
          e.message = message;
        } else if (e.error) {
          const message = e.error;
          e.message = message;
        }
        setError(e);
        setIsLoadingSave(false);
      }
    },
    5000,
    { leading: true },
  ), [list, setInitialData, user.id]);

  const handleCancel = () => {
    const initialList = initialData.results.slice();
    setList(initialList);
  };

  const handleCloseIsUpdated = () => {
    setIsUpdated(false);
  };

  function reorder(currentList, startIndex, endIndex) {
    const result = Array.from(currentList);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) return;

    setList(reorder(list, source.index, destination.index));
  };

  function handleDelete(index) {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  }

  if (loading || helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (initialError?.status === 404 || error?.status === 404) return <Navigate to="/404" />;

  if (initialError?.status === 401 || error?.status === 401) {
    removeItem('user');
    return <Navigate to="/registration" />;
  }

  if (initialError || (error && error?.status !== 400)) return <Navigate to="/error" />;

  return (
    <PageLayout>
      <Container className="page" data-testid="page-watchlist-form">
        <Box className="page-watchlist-form-container-button-see-list" data-testid="page-watchlist-form-container-button-see-list">
          <Button
            component={Link}
            to={linkRoutes.watchlistForm(user.id)}
            sx={{
              color: 'primary.light',
            }}
          >
            See list
          </Button>
        </Box>
        <Typography sx={{ typography: { sm: 'h4', xs: 'h5' } }} component="h1" color="secondary.light">
          Edit Watchlist
        </Typography>
        <Typography variant="h6" component="h2">{`Total: ${initialData?.total}`}</Typography>
        <Grid container className="page-watchlist-form-container-edit-buttons" data-testid="page-watchlist-form-container-edit-buttons">
          <Grid item>
            <Button
              color="neutral"
              onClick={handleCancel}
              endIcon={<ReplayIcon />}
              variant="contained"
            >
              Revert
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton
              color="primary"
              sx={{
                bgcolor: isLoadingSave ? '' : 'primary',
              }}
              onClick={debounceHandleSave}
              loading={isLoadingSave}
              loadingPosition="end"
              endIcon={isLoadingSave ? <AddCircleOutlineSharpIcon /> : <SaveAsIcon />}
              variant={isLoadingSave ? 'outlined' : 'contained'}
              disabled={isLoadingSave === true}
            >
              Save
            </LoadingButton>
          </Grid>
        </Grid>
        <Collapse in={Boolean(error?.message)}>
          <Alert
            variant="filled"
            severity="error"
            className="page-watchlist-form-alert"
            data-testid="page-watchlist-form-alert"
            action={(
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setError(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            )}
          >
            {error.message}
          </Alert>
        </Collapse>
        <ModalNotification title="Successfully updated" body="List updated successfully" handleClose={handleCloseIsUpdated} open={isUpdated} />
        <ListDroppable
          list={list}
          onDragEnd={handleDragEnd}

        >
          {(item, index) => (
            <CardMovieEditItem data={{ ...item, handleDelete, index }} />
          )}
        </ListDroppable>
      </Container>
    </PageLayout>
  );
}
