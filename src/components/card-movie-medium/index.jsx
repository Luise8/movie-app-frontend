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
import 'src/components/card-movie-medium/styles.css';
import { Link } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import appResourcesPath from 'src/utils/app-resources-path';

export default function CardMovieMedium({
  data,
}) {
  const {
    name, photo, description, release_date: release, idTMDB, rateAverage,
  } = data;
  const releaseDate = release && typeof release === 'string' ? ` (${release.slice(0, 4)})` : '';
  const theme = useTheme();

  return (
    <Card
      data-testid="card-movie-medium"
      className="card-movie-medium"
    >
      <CardActionArea
        data-testid="card-movie-medium-container-image"
        className="card-movie-medium-container-image"
        component={Link}
        to={linkRoutes.cardMovieMedium(idTMDB)}
      >
        <CardMedia
          className="card-movie-medium-card-media"
          component="img"
          image={photo || appResourcesPath.cardMovieSmall.noImageAvailable}
          alt={name}
        />
      </CardActionArea>
      <Box
        data-testid="card-movie-medium-container-right"
        className="card-movie-medium-container-right"
      >
        <CardActionArea
          data-testid="link-title"
          component={Link}
          to={linkRoutes.cardMovieMedium(idTMDB)}
        >
          <CardHeader
            title={`${name}${releaseDate}`}
            component="h2"
            className="card-movie-medium-title-1"
            sx={{ color: theme.palette.primary.main }}
          />
        </CardActionArea>
        <CardContent data-testid="card-movie-medium-container-right-body" className="card-movie-medium-container-right-body">
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
          >
            <Rating name="card-movie-medim-rate-average" defaultValue={rateAverage ? 1 : 0} max={1} readOnly />
            <Typography
              variant="body1"
              component="div"
              data-testid="ratingAverage"
              textAlign="bottom"
            >
              {rateAverage > 0 ? rateAverage : ''}
            </Typography>
          </Stack>
          <Typography
            gutterBottom
            variant="body1"
            component="div"
          >
            {description}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

CardMovieMedium.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    photo: PropTypes.string,
    description: PropTypes.string.isRequired,
    release_date: PropTypes.string,
    idTMDB: PropTypes.string.isRequired,
    rateAverage: PropTypes.number.isRequired,
  }).isRequired,
};
