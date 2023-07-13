import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Collapse,
  Container,
  IconButton,
  Typography,
  Rating, FormControl, FormHelperText,
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
import appResourcesPath from 'src/utils/app-resources-path';
import { images } from 'src/utils/tmdb-resources-url';
import 'src/pages/rate-form/styles.css';
import useRateForm from 'src/hooks/use-rate-form';
import { createRate, editRate } from 'src/services/rate-write';

export default function RateForm() {
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
    value,
    setValue,
    movieData,
  } = useRateForm(movieId);

  const debounceHandleSave = useMemo(() => throttle(
    async (event) => {
      try {
        event.preventDefault();
        setIsLoadingSave(true);
        setError(false);
        // Checks
        if (value < 1 || value > 10) {
          const e = new Error('Wrong value. Min 1, max 10.');
          e.status = 400;
          throw e;
        }

        if (data.rate === null) {
          await createRate({
            value,
            id: movieId,
          });
        } else {
          await editRate({
            value,
            movieId,
            rateId: data.rate.id,
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
  ), [value, movieId, data.rate]);

  const handleChangeValue = (e) => {
    setValue(Number(e.currentTarget.value));
  };

  const handleCloseIsSaved = () => {
    setIsSaved(false);
    navigate(linkRoutes.rateForm.rates(user.id));
  };

  if (loading || helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (initialError?.status === 404 || error?.status === 404) return <Navigate to="/404" />;

  if (initialError?.status === 401 || error?.status === 401) {
    removeItem('user');
    return <Navigate to="/registration" />;
  }

  if (initialError?.status === 409 || error?.status === 409) {
    return <Navigate to={linkRoutes.rateForm.rates(user.id)} />;
  }

  if (initialError) return <Navigate to="/error" />;

  const releaseDate = movieData.release_date && typeof movieData.release_date === 'string' ? ` (${movieData.release_date.slice(0, 4)})` : '';

  return (
    <PageLayout>
      <Container className="page" data-testid="page-rate-form">
        <Typography
          variant="h5"
          component={Link}
          className="page-rate-form-movie-title"
          to={linkRoutes.rateForm.movie(movieId)}
          color="primary.main"
        >
          {`${movieData.title}${releaseDate}`}
        </Typography>
        <Box
          className="page-rate-form-container-img"
          data-testid="page-rate-form-container-img"
          component={Link}
          to={linkRoutes.rateForm.movie(movieId)}
        >
          <img
            src={movieData.poster_path
              ? images.posterSize154(movieData.poster_path)
              : appResourcesPath.cardMovieSmall}
            alt={movieData.title}
          />
        </Box>
        <Typography sx={{ typography: { sm: 'h4', xs: 'h5' } }} component="h1" color="secondary.light">
          Your rate
        </Typography>
        <Box component="form" className="page-form" data-testid="page-rate-form-form">
          <FormControl>
            <Typography variant="subtitle1">Value</Typography>
            <Rating
              name="value"
              className="page-rate-form-rating"
              required
              data-testid="rating-average-star-icon"
              value={value}
              onChange={handleChangeValue}
              max={10}
            />
            <FormHelperText data-testid="value-restrictions" id="Restrictions of value">
              The value must be between 1 and 10 stars.
            </FormHelperText>
          </FormControl>

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
              data-testid="page-rate-form-alert"
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
