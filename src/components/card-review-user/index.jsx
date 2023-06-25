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
import 'src/components/card-review-user/styles.css';
import { Link } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import appResourcesPath from 'src/utils/app-resources-path';

export default function CardReviewUser({
  data,
}) {
  const {
    title, body, date, movieId,
  } = data;
  const releaseDate = movieId.release_date && typeof movieId.release_date === 'string' ? ` (${movieId.release_date.slice(0, 4)})` : '';
  const theme = useTheme();

  return (
    <Card
      data-testid="card-review-user"
      className="card-review-user"
    >
      <CardActionArea
        data-testid="card-review-user-container-image"
        className="card-review-user-container-image"
        component={Link}
        to={linkRoutes.cardReviewUser(movieId.idTMDB)}
      >
        <CardMedia
          className="card-review-user-card-media"
          component="img"
          image={movieId.photo || appResourcesPath.cardMovieSmall.noImageAvailable}
          alt={movieId.name}
        />
      </CardActionArea>
      <Box
        data-testid="card-review-user-container-right"
        className="card-review-user-container-right"
      >
        <CardActionArea
          data-testid="link-title"
          component={Link}
          to={linkRoutes.cardReviewUser(movieId.idTMDB)}
        >
          <CardHeader
            title={`${movieId.name}${releaseDate}`}
            component="h2"
            className="card-review-user-title-1"
            sx={{ color: theme.palette.primary.main }}
          />
        </CardActionArea>
        <CardContent data-testid="card-review-user-container-right-body" className="card-review-user-container-right-body">
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
          >
            <Rating name="customized-1" defaultValue={1} max={1} readOnly />
            <Typography
              variant="body1"
              component="div"
              data-testid="ratingAverage"
            >
              {movieId.rateAverage}
            </Typography>
          </Stack>
          <Box className="card-review-user-container-title-2-date" data-testid="card-review-user-container-title-2-date">
            <Typography
              gutterBottom
              variant="h5"
              component="h3"
            >
              {title}
            </Typography>
            <Typography
              gutterBottom
              variant="body2"
              component="div"
            >
              {new Date(date).toUTCString()}
            </Typography>
          </Box>
          <Typography
            gutterBottom
            variant="body1"
            component="div"
          >
            {body}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

CardReviewUser.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    movieId: PropTypes.shape({
      name: PropTypes.string.isRequired,
      photo: PropTypes.string,
      release_date: PropTypes.string,
      idTMDB: PropTypes.string.isRequired,
      rateAverage: PropTypes.number.isRequired,
    }),
  }).isRequired,
};
