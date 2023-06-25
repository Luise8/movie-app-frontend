import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
  Box,
  CardActionArea, CardHeader, Rating, Stack, useTheme,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import 'src/components/card-rate-user/styles.css';
import { Link } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import appResourcesPath from 'src/utils/app-resources-path';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function CardReviewUser({
  data,
}) {
  const {
    value, date, movieId,
  } = data;
  const releaseDate = movieId.release_date && typeof movieId.release_date === 'string' ? ` (${movieId.release_date.slice(0, 4)})` : '';
  const theme = useTheme();
  const breakpointSm = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Card
      data-testid="card-rate-user"
      className="card-rate-user"
    >
      <CardActionArea
        data-testid="card-rate-user-container-image"
        className="card-rate-user-container-image"
        component={Link}
        to={linkRoutes.cardRateUser(movieId.idTMDB)}
      >
        <CardMedia
          className="card-rate-user-card-media"
          component="img"
          image={movieId.photo || appResourcesPath.cardMovieSmall.noImageAvailable}
          alt={movieId.name}
        />
      </CardActionArea>
      <Box>
        <CardActionArea
          data-testid="link-title"
          component={Link}
          to={linkRoutes.cardRateUser(movieId.idTMDB)}
        >
          <CardHeader
            title={`${movieId.name}${releaseDate}`}
            component="h2"
            className="card-rate-user-title-1"
            sx={{ color: theme.palette.primary.main }}
          />
        </CardActionArea>
        <CardContent>
          <Stack
            direction="column"
            spacing={0.5}
            className="card-rate-user-all-rates-container"
            data-testid="card-rate-user-all-rates-container"
          >
            <Box className="card-rate-user-rating-row-container" data-testid="card-rate-user-rating-row-container">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="h6"
                  component="h3"
                  data-testid="user-rating-number"
                >
                  {`${value}`}
                </Typography>
                <Rating
                  name="userRating"
                  data-testid="user-rating-star-icon"
                  max={breakpointSm ? 1 : 10}
                  readOnly
                  value={breakpointSm ? 1 : value}
                />
              </Stack>
              <Typography
                variant="h6"
                component="h3"
                sx={{ color: theme.palette.secondary.light }}
              >
                Your rating
              </Typography>
            </Box>
            <Box className="card-rate-user-rating-row-container" data-testid="card-rate-user-rating-row-container">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="h6"
                  component="h3"
                  data-testid="rating-average-number"
                >
                  {`${movieId.rateAverage}`}
                </Typography>
                <Rating
                  name="ratingAverage"
                  data-testid="rating-average-star-icon"
                  value={breakpointSm ? 1 : Math.floor(movieId.rateAverage)}
                  max={breakpointSm ? 1 : 10}
                  readOnly
                />
              </Stack>
              <Typography
                variant="h6"
                component="h3"
                sx={{ color: theme.palette.secondary.light }}
              >
                The movie average
              </Typography>
            </Box>
          </Stack>
          <Typography
            gutterBottom
            variant="body2"
            component="div"
          >
            {new Date(date).toUTCString()}
          </Typography>
          <Typography
            gutterBottom
            variant="body1"
            component="div"
          >
            {movieId.description || ''}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

CardReviewUser.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    movieId: PropTypes.shape({
      name: PropTypes.string.isRequired,
      photo: PropTypes.string,
      description: PropTypes.string,
      release_date: PropTypes.string,
      idTMDB: PropTypes.string.isRequired,
      rateAverage: PropTypes.number.isRequired,
    }),
  }).isRequired,
};
