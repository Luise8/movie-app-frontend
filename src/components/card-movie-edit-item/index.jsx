import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
  Box,
  CardActionArea, CardHeader, Grid, IconButton, Rating, Stack,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import 'src/components/card-movie-edit-item/styles.css';
import { Link } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import appResourcesPath from 'src/utils/app-resources-path';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CardMovieEditItem({
  data,
}) {
  const {
    name, photo, release_date: release, idTMDB, rateAverage, handleDelete, index,
  } = data;
  const releaseDate = release && typeof release === 'string' ? `${release.slice(0, 4)}` : '';

  return (
    <Card
      data-testid="card-movie-edit-item"
      className="card-movie-edit-item"
    >
      <CardActionArea
        data-testid="card-movie-edit-item-container-image"
        className="card-movie-edit-item-container-image"
        component={Link}
        to={linkRoutes.cardMovieEditItem(idTMDB)}
      >
        <CardMedia
          className="card-movie-edit-item-card-media"
          data-testid="card-movie-edit-item-card-media"
          component="img"
          image={photo || appResourcesPath.cardMovieSmall.noImageAvailable}
        />
      </CardActionArea>
      <Box
        className="card-movie-edit-item-container-right"
        data-testid="card-movie-edit-item-container-right"
      >
        <CardActionArea
          data-testid="link-title"
          component={Link}
          to={linkRoutes.cardMovieEditItem(idTMDB)}
        >
          <CardHeader
            title={`${name}`}
            component="h2"
            className="card-movie-edit-item-title-1"
            titleTypographyProps={{ variant: 'body1' }}
            sx={{ color: 'primary.light' }}
          />
        </CardActionArea>
        <CardContent data-testid="card-movie-edit-item-container-right-body" className="card-movie-edit-item-container-right-body">
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography
                variant="body2"
                component="div"
                textAlign="bottom"
              >
                {releaseDate}
              </Typography>
            </Grid>
            <Grid item>
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
            </Grid>
            <Grid item>
              <IconButton aria-label="delete" onClick={() => handleDelete(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Box>
    </Card>
  );
}

CardMovieEditItem.propTypes = {

  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    photo: PropTypes.string,
    release_date: PropTypes.string,
    idTMDB: PropTypes.string.isRequired,
    rateAverage: PropTypes.number.isRequired,
    handleDelete: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
};
