import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
  CardActionArea, Rating, Stack,
} from '@mui/material';
import { images } from 'src/utils/tmdb-resources-url';
import { PropTypes } from 'prop-types';
import 'src/components/card-movie-small/styles.css';
import { Link } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import appResourcesPath from 'src/utils/app-resources-path';

export default function CardMovieSmall({
  cardData,
}) {
  const {
    rateAverage, title, photo, poster_path: posterPath, idTMDB, id, name,
  } = cardData;

  let cardPhoto;
  let cardId;
  let cardTitle;
  if (idTMDB) {
    cardId = idTMDB;
    cardPhoto = photo;
    cardTitle = name;
  } else {
    cardId = id;
    cardPhoto = posterPath ? images.posterSize185(posterPath) : '';
    cardTitle = title;
  }

  return (
    <Card className="card-movie-small">
      <CardActionArea
        component={Link}
        to={linkRoutes.cardMovieSmall(cardId)}
        data-testid="card-movie-small-link"
      >
        <CardMedia
          className="card-movie-small-card-media"
          component="img"
          image={cardPhoto || appResourcesPath.cardMovieSmall.noImageAvailable}
          alt={cardTitle}
        />
        <CardContent className="card-movie-small-card-content" data-testid="card-movie-small-card-content">
          {idTMDB
            ? (
              <Stack
                direction="row"
                alignItems="flex-start"
                spacing={0.5}

              >
                <Rating name="customized-1" defaultValue={1} max={1} size="small" readOnly />
                <Typography variant="body2">
                  {rateAverage}
                </Typography>
              </Stack>
            ) : null}
          <Typography
            gutterBottom
            variant="body2"
            component="div"
            data-testid="typography-two-lines-elipsis"
            className="typography-two-lines-elipsis"
          >
            {cardTitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function checkOneOfTwoStringRequired(props) {
  if (props.title && props.name) {
    return new Error('"title" or "name" is required and must be strings with a minimum length of 1');
  }
  const propToCheck = props.title ? props.title : props.name;

  if (typeof propToCheck !== 'string' || !propToCheck?.length > 0) {
    return new Error('"title" or "name" is required and must be strings with a minimum length of 1');
  }
  return null;
}

CardMovieSmall.propTypes = {
  cardData: PropTypes.shape({
    title: checkOneOfTwoStringRequired,
    name: checkOneOfTwoStringRequired,
    rateAverage: PropTypes.number,
    photo: PropTypes.string,
    poster_path: PropTypes.string,
    idTMDB: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
};
