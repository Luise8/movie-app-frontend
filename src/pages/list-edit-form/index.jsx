import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Container, FormHelperText, Grid, IconButton, FilledInput, InputLabel, Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
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
import 'src/pages/list-edit-form/styles.css';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import CloseIcon from '@mui/icons-material/Close';
import ListDroppable from 'src/components/list-droppable';
import CardMovieEditItem from 'src/components/card-movie-edit-item';
import ModalNotification from 'src/components/modal-notification';
import ReplayIcon from '@mui/icons-material/Replay';
import { editList } from 'src/services/list-write';
import useOneListLight from 'src/hooks/use-list-light';

export default function ListEditForm() {
  const { user, removeItem } = useUserAuth();
  const { userId, listId } = useParams();
  const {
    initialData,
    loading,
    initialError,
    list,
    setList,
    setInitialData,
    name,
    description,
    setName,
    setDescription,
  } = useOneListLight({ userId, listId });

  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [error, setError] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const debounceHandleSave = useMemo(() => throttle(
    async (event) => {
      try {
        event.preventDefault();
        setIsLoadingSave(true);
        setError(false);

        // Checks
        if (name.trim().length < 12 || name.trim().length > 175) {
          const e = new Error('Wrong length of name. Min 12, max 175.');
          e.status = 400;
          throw e;
        }
        if (description.trim().length > 300) {
          const e = new Error('Wrong length of description. Max 300.');
          e.status = 400;
          throw e;
        }
        if (!/^[a-z\d\s',.?-]*$/i.test(name) || !/^[a-z\d\s',.?-]*$/i.test(description)) {
          const e = new Error('Invalid characters.');
          e.status = 400;
          throw e;
        }

        const response = await editList({
          userId: user.id,
          listId,
          description,
          name,
          movies: list.slice().map((item) => item.idTMDB),
        });
        if (response.movies.length !== list.length) {
          throw new Error('Somtheing wrong');
        }

        const newList = list.slice();
        const newIds = newList.map((item) => item.id);
        setInitialData((prevData) => ({
          ...prevData,
          results: newList,
          total: newIds.length,
          listTotalIds: newIds,
          description,
          name,
        }));
        setIsUpdated(true);
        setIsLoadingSave(false);
      } catch (e) {
        if (e.status === 400) {
          if (e.errors) {
            const message = e.errors.map((err) => err.msg).join('\r\n');
            e.message = message;
          } else if (e.error) {
            const message = e.error;
            e.message = message;
          }
        // connection error
        } else if (/can't access property "ready", window.grecaptcha is undefined/i.test(e.message) || !navigator.onLine) {
          e.message = 'Something wrong. Check your connection.';
        } else {
          e.message = 'Something wrong. Please try again or try to refresh the page.';
        }
        setError(e);
        setIsLoadingSave(false);
      }
    },
    5000,
    { leading: true },
  ), [list, setInitialData, user.id, description, listId, name]);

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleCancel = () => {
    const initialList = initialData.results.slice();
    setList(initialList);
    setName(initialData.name);
    setDescription(initialData.description);
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
    // Chaeck if the user is the owner of the list
    if (userId === user.id && user.lists.find((item) => item.id === listId)) {
      removeItem('user');
      return <Navigate to="/registration" />;
    }
  }

  if (initialError) return <Navigate to="/error" />;

  return (
    <PageLayout>
      <Container className="page" data-testid="page-list-edit-form">
        <Box className="page-list-edit-form-container-button-see-list" data-testid="page-list-edit-form-container-button-see-list">
          <Button
            component={Link}
            to={linkRoutes.listEditForm({ userId, listId })}
            sx={{
              color: 'primary.light',
            }}
          >
            See list
          </Button>
        </Box>
        <Box className="page-list-edit-form-break-word" data-testid="page-list-edit-form-container-title">
          <Typography sx={{ typography: { sm: 'h4', xs: 'h5' } }} component="h1" color="secondary.light">
            {`Edit list ${initialData.name}` }
          </Typography>
        </Box>
        <Box component="form" className="page-form" data-testid="page-list-edit-form-form">
          <Grid container className="page-list-edit-form-container-edit-buttons" data-testid="page-list-edit-form-container-edit-buttons">
            <Grid item>
              <Button
                type="reset"
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
                type="submit"
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
          <InputLabel htmlFor="name">Name</InputLabel>
          <FilledInput aria-describedby="name of list" id="name" label="name" variant="contained" value={name} onChange={handleChangeName} autoFocus required multiline inputProps={{ minLength: 12, maxLength: 175 }} />
          <FormHelperText data-testid="name-helper-text" id="Restrictions of name">
            The length must be between 12 and 175 characters.
            Only letters, numbers, spaces,
            and the following special characters are allowed,
            not including parentheses (- &apos; . ? ,)
          </FormHelperText>
          <InputLabel htmlFor="description">Description</InputLabel>
          <FilledInput aria-describedby="description of list" id="description" label="description" variant="contained" value={description} onChange={handleChangeDescription} required multiline inputProps={{ maxLength: 300 }} />
          <FormHelperText id="Restrictions of description" data-testid="description-helper-text">
            The length must be max 300 characters.
            Only letters, numbers, spaces,
            and the following special characters are allowed,
            not including parentheses (- &apos; . ? ,)
          </FormHelperText>
          <Collapse in={Boolean(error?.message)}>
            <Alert
              variant="filled"
              severity="error"
              className="page-form-alert"
              data-testid="page-list-edit-form-alert"
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
        </Box>
        <ModalNotification title="Successfully updated" body="List updated successfully" handleClose={handleCloseIsUpdated} open={isUpdated} />
        <Typography variant="h6" component="h2">{`Total: ${initialData?.total}`}</Typography>
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
