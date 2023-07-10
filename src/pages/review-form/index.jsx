import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Collapse,
  Container, IconButton, Typography, TextField,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import {
  Link,
  Navigate, useNavigate, useParams,
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
import useReviewForm from 'src/hooks/use-review-form';
import { createReview, editReview } from 'src/services/review-write';
import appResourcesPath from 'src/utils/app-resources-path';
import { images } from 'src/utils/tmdb-resources-url';
import 'src/pages/review-form/styles.css';

export default function ReviewForm() {
  const { user, removeItem } = useUserAuth();
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { movieId } = useParams();
  const navigate = useNavigate();

  const {
    loading,
    initialError,
    data,
    title,
    setTitle,
    body,
    setBody,
    movieData,
  } = useReviewForm(movieId);

  const debounceHandleSave = useMemo(() => throttle(
    async (event) => {
      try {
        event.preventDefault();
        setIsLoadingSave(true);
        setError(false);
        setTitle((prevTitle) => prevTitle.trim());
        setBody((prevBody) => prevBody.trim());
        // Checks
        if (title.length < 12 || title.length > 175) {
          const e = new Error('Wrong length of title. Min 12, max 175.');
          e.status = 400;
          throw e;
        }

        if (body.length < 400 || body.length > 10000) {
          const e = new Error('Wrong length of body. Min 400, max 10000.');
          e.status = 400;
          throw e;
        }

        if (!/^[a-z\d\s',.?-]*$/i.test(title)) {
          const e = new Error('Title has invalid characters.');
          e.status = 400;
          throw e;
        }

        if (!/^[a-z\d\s',.?-]*$/i.test(body)) {
          const e = new Error('Body has invalid characters.');
          e.status = 400;
          throw e;
        }

        if (data.review === null) {
          await createReview({
            body,
            title,
            id: movieId,
          });
        } else {
          await editReview({
            body,
            title,
            movieId,
            reviewId: data.review.id,
          });
        }

        setIsLoadingSave(false);
        setIsSaved(true);
      } catch (e) {
        // Handle errors 400
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
  ), [body, title, setTitle, setBody, movieId, data.review]);

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeBody = (e) => {
    setBody(e.target.value);
  };

  const handleCloseIsSaved = () => {
    setIsSaved(false);
    navigate(linkRoutes.reviewForm.reviews(user.id));
  };

  if (loading || helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (initialError?.status === 404 || error?.status === 404) return <Navigate to="/404" />;

  if (initialError?.status === 401 || error?.status === 401) {
    removeItem('user');
    return <Navigate to="/registration" />;
  }

  if (initialError?.status === 409 || error?.status === 409) {
    return <Navigate to={linkRoutes.reviewForm.reviews(user.id)} />;
  }

  if (initialError) return <Navigate to="/error" />;

  const releaseDate = movieData.release_date && typeof movieData.release_date === 'string' ? ` (${movieData.release_date.slice(0, 4)})` : '';

  return (
    <PageLayout>
      <Container className="page" data-testid="page-review-form">
        <Typography
          variant="h5"
          component={Link}
          className="page-review-form-movie-title"
          to={linkRoutes.reviewForm.movie(movieId)}
          color="primary.main"
        >
          {`${movieData.title}${releaseDate}`}
        </Typography>
        <Box
          className="page-review-form-container-img"
          data-testid="page-review-form-container-img"
          component={Link}
          to={linkRoutes.reviewForm.movie(movieId)}
        >
          <img
            src={movieData.poster_path
              ? images.posterSize154(movieData.poster_path)
              : appResourcesPath.cardMovieSmall}
            alt={movieData.title}
          />
        </Box>
        <Typography sx={{ typography: { sm: 'h4', xs: 'h5' } }} component="h1" color="secondary.light">
          Your review
        </Typography>
        <Box component="form" className="page-form" data-testid="page-review-form-form">
          <TextField
            required
            fullWidth
            placeholder="Write a title for your review here"
            id="title"
            label="Title"
            name="title"
            helperText={(
              <span data-testid="title-restrictions">
                Only letters, numbers, spaces,
                and the following special characters are allowed,
                not including parentheses (- &apos; . ? ,).
                The length must be between 12 and 175 characters.
              </span>
            )}
            value={title}
            onChange={handleChangeTitle}
            autoFocus
            inputProps={{ minLength: 12, maxLength: 175 }}
          />
          <TextField
            required
            fullWidth
            multiline
            minRows={5}
            name="body"
            label="Body"
            id="body"
            value={body}
            placeholder="Write your review here"
            onChange={handleChangeBody}
            inputProps={{ minLength: 400, maxLength: 10000 }}
            helperText={(
              <span data-testid="body-restrictions">
                Only letters, numbers, spaces,
                and the following special characters are allowed,
                not including parentheses (- &apos; . ? ,).
                The length must be between 400 and 10000 characters.
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
              data-testid="page-review-form-alert"
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
