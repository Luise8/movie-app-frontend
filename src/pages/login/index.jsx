import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Collapse,
  Container, IconButton, Typography, Avatar, TextField,
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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LogIn() {
  const { user, logInContext } = useUserAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        setPassword((prevPassword) => prevPassword.trim());
        setUsername((prevUsername) => prevUsername.trim());
        // Checks
        if (username.length < 5 || username.length > 20) {
          const e = new Error('Wrong length of username. Min 5, max 20.');
          e.status = 400;
          throw e;
        }

        if (!/^[a-z\d]+$/i.test(username)) {
          const e = new Error('Username has non-alphanumeric characters.');
          e.status = 400;
          throw e;
        }

        if (password.length < 5) {
          const e = new Error('Wrong length of password. Min 5.');
          e.status = 400;
          throw e;
        }
        if (/\s/i.test(password)) {
          const e = new Error('No spaces are allowed in the password.');
          e.status = 400;
          throw e;
        }

        await logInContext({
          password,
          username,
        });
        setIsLoadingSave(false);
        setIsSaved(true);
      } catch (e) {
        // Handle errors 400
        if (e.status === 400) {
          if (e.errors) {
            const message = e.errors.map((err) => err.msg).join('\r\n');
            e.message = message;
          } else if (e.error) {
            // Retrieve the username taken error to show the user a clearer message.
            if (new RegExp(`the username \`${username}\` is taken`, 'i').test(e.error)) {
              e.message = `The username '${username}' is taken.`;
            } else {
              const message = e.error;
              e.message = message;
            }
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
  ), [password, username, logInContext]);

  const handleChangeName = (e) => {
    setUsername(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setPassword(e.target.value);
  };

  const handleCloseIsSaved = () => {
    setIsSaved(false);
    navigate(linkRoutes.logIn);
  };

  if (helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (error?.status === 404) return <Navigate to="/404" />;

  return (
    <PageLayout>
      <Container className="page" data-testid="page-log-in">
        <Avatar data-testid="avatar" sx={{ m: 1, bgcolor: 'info.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography sx={{ typography: { sm: 'h4', xs: 'h5' } }} component="h1" color="secondary.light">
          Log in
        </Typography>
        <Box component="form" className="page-form" data-testid="page-log-in-form">
          <TextField
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            helperText={(
              <span data-testid="username-restrictions">
                Only alphanumeric characters are allowed.
                The length must be between 5 and 20 characters.
              </span>
            )}
            value={username}
            onChange={handleChangeName}
            autoFocus
            inputProps={{ minLength: 5, maxLength: 20 }}
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={handleChangeDescription}
            inputProps={{ maxLength: 30 }}
            helperText={(
              <span data-testid="password-restrictions">
                The length must be min 5 characters.
                No spaces are allowed in the password.
              </span>
)}
          />
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
              data-testid="page-log-in-alert"
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
        <ModalNotification title="Welcome" body="Successfully logged in" handleClose={handleCloseIsSaved} open={isSaved} />
      </Container>
    </PageLayout>
  );
}
