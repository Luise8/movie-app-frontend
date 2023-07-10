import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Collapse,
  Container, FormHelperText, IconButton, FilledInput, InputLabel, Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import {
  Navigate, useNavigate,
} from 'react-router-dom';
import throttle from 'just-throttle';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import linkRoutes from 'src/utils/link-routes';
import helperFunctions from 'src/utils/helper-functions';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import CloseIcon from '@mui/icons-material/Close';
import ModalNotification from 'src/components/modal-notification';
import { createList } from 'src/services/list-write';

export default function ListCreateForm() {
  const { user, removeItem } = useUserAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const navigate = useNavigate();
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

        await createList({
          id: user.id,
          description: description.trim(),
          name,
        });
        setIsLoadingSave(false);
        setIsSaved(true);
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
    1000,
    { leading: true },
  ), [user.id, description, name]);

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleCloseIsSaved = () => {
    setIsSaved(false);
    navigate(linkRoutes.listCreateForm(user.id));
  };

  if (helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (error?.status === 404) return <Navigate to="/404" />;

  if (error?.status === 401) {
    removeItem('user');
    return <Navigate to="/registration" />;
  }

  return (
    <PageLayout>
      <Container className="page" data-testid="page-list-create-form">
        <Typography sx={{ typography: { sm: 'h4', xs: 'h5' } }} component="h1" color="secondary.light">
          Create list
        </Typography>
        <Box component="form" className="page-form" data-testid="page-list-create-form-form">
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
          <LoadingButton
            type="submit"
            color="primary"
            fullWidth
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
          <Collapse in={Boolean(error?.message)}>
            <Alert
              variant="filled"
              severity="error"
              className="page-form-alert"
              data-testid="page-list-create-form-alert"
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
        <ModalNotification title="Successfully created" body="List successfully created" handleClose={handleCloseIsSaved} open={isSaved} />
      </Container>
    </PageLayout>
  );
}
