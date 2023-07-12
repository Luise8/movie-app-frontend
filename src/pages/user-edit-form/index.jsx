import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Collapse,
  Container, IconButton,
  Typography, OutlinedInput,
  FormHelperText, FormLabel, FormControl, Button,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import {
  Link,
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
import useUserEditForm from 'src/hooks/use-user-edit-form';
import { editUser } from 'src/services/user-write';
import 'src/pages/user-edit-form/styles.css';

export default function UserEditForm() {
  const { user, removeItem } = useUserAuth();
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const {
    loading,
    initialError,
    username,
    bio,
    setUsername,
    setBio,
    password,
    setPassword,
    photo,
    setPhoto,
    inputPhoto,
    setInputPhoto,
  } = useUserEditForm(user.id);

  const debounceHandleSave = useMemo(() => throttle(
    async (event) => {
      try {
        event.preventDefault();
        setIsLoadingSave(true);
        setError(false);
        setUsername((prevUsername) => prevUsername.trim());
        setPassword((prevPassword) => prevPassword.trim());
        setBio((prevBio) => prevBio.trim());

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

        if (bio.length > 300) {
          const e = new Error('Wrong length of bio. Max 300 characters.');
          e.status = 400;
          throw e;
        }

        if (!/^[a-z\d\s',.?-]*$/i.test(bio)) {
          const e = new Error('Bio has invalid characters.');
          e.status = 400;
          throw e;
        }

        if (inputPhoto?.size > 1000000) {
          const e = new Error('Max size of image is 1mb.');
          e.status = 400;
          throw e;
        }
        if (!/^image\/(jpeg|jpg|png|gif)/.test(inputPhoto?.type) && inputPhoto !== undefined) {
          const e = new Error('Invalid file. The image must be png, jpeg, jpg or gif');
          e.status = 400;
          throw e;
        }

        await editUser({
          username,
          password,
          bio,
          id: user.id,
          photo: inputPhoto,
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
    2000,
    { leading: true },
  ), [username, password, bio, inputPhoto, setBio, setPassword, setUsername, user.id]);

  const handleChangeUsername = (e) => {
    setUsername(e.currentTarget.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.currentTarget.value);
  };

  const handleChangeBio = (e) => {
    setBio(e.currentTarget.value);
  };

  const handleChangeInputPhoto = (e) => {
    setInputPhoto(e.target.files[0]);
    setPhoto(URL.createObjectURL(e.target.files[0]));
  };

  const handleCloseIsSaved = () => {
    setIsSaved(false);
    navigate(linkRoutes.userEditForm(user.id));
  };

  if (loading || helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (initialError?.status === 404 || error?.status === 404) return <Navigate to="/404" />;

  if (initialError?.status === 401 || error?.status === 401) {
    removeItem('user');
    return <Navigate to="/registration" />;
  }

  if (initialError) return <Navigate to="/error" />;

  return (
    <PageLayout>
      <Container className="page" data-testid="page-user-edit-form">
        <Box className="page-container-button-user" data-testid="page-container-button-user">
          <Button
            component={Link}
            to={linkRoutes.userEditForm(user.id)}
            sx={{
              color: 'primary.light',
            }}
          >
            See profile
          </Button>
        </Box>
        <Typography sx={{ typography: { sm: 'h4', xs: 'h5' } }} component="h1" color="secondary.light">
          Edit profile
        </Typography>
        <Box component="form" className="page-form" data-testid="page-user-edit-form-form">
          <Box
            className="page-user-edit-form-container-photo-field"
            data-testid="page-user-edit-form-container-photo-field"
          >
            <FormLabel htmlFor="select-image">
              Profile image
            </FormLabel>
            <Box
              className="page-user-edit-form-container-img-and-input"
              data-testid="page-user-edit-form-container-img-and-input"
            >
              <Box
                className="page-user-edit-form-container-img"
                data-testid="page-user-edit-form-container-img"
              >
                <img onLoad={() => URL.revokeObjectURL(inputPhoto)} src={photo} alt="" />
              </Box>
              <OutlinedInput
                variant="contained"
                type="file"
                id="select-image"
                inputProps={{
                  accept: 'image/png, image/gif, image/jpeg',
                }}
                onChange={handleChangeInputPhoto}
              />
            </Box>
          </Box>
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <OutlinedInput
              aria-describedby="Username"
              id="username"
              label="Username"
              name="username"
              required
              placeholder="Write your username here"
              value={username}
              onChange={handleChangeUsername}
              inputProps={{ minLength: 5, maxLength: 20 }}
              autoFocus
            />
            <FormHelperText data-testid="username-restrictions" id="Restrictions of username">
              Only alphanumeric characters are allowed.
              The length must be between 5 and 20 characters.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <OutlinedInput
              aria-describedby="Password"
              name="password"
              label="Password"
              id="password"
              type="password"
              required
              placeholder="Write your password here"
              value={password}
              onChange={handleChangePassword}
              inputProps={{ minLength: 5, maxLength: 30 }}
            />
            <FormHelperText data-testid="password-restrictions" id="Restrictions of password">
              The length must be min 5 characters.
              No spaces are allowed in the password.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="bio">Bio</FormLabel>
            <OutlinedInput
              aria-describedby="Bio"
              id="bio"
              label="Bio"
              name="bio"
              required
              placeholder="Write your bio here"
              value={bio}
              onChange={handleChangeBio}
              inputProps={{ maxLength: 300 }}
              multiline
              minRows={5}
            />
            <FormHelperText data-testid="bio-restrictions" id="Restrictions of bio">
              Only letters, numbers, spaces,
              and the following special characters are allowed,
              not including parentheses (- &apos; . ? ,).
              The length must be max 300 characters.
            </FormHelperText>
          </FormControl>
          <LoadingButton
            type="submit"
            color="primary"
            sx={{
              bgcolor: isLoadingSave ? '' : 'primary',
            }}
            onClick={debounceHandleSave}
            loading={isLoadingSave}
            loadingPosition="end"
            fullWidth
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
              data-testid="page-user-edit-form-alert"
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
        <ModalNotification title="Success" body="The operation was carried out successfully." handleClose={handleCloseIsSaved} open={isSaved} />
      </Container>
    </PageLayout>
  );
}
