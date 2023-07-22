import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
  Box,
  CardActionArea, CardHeader, Collapse, IconButton, Rating, Stack,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import 'src/components/card-review-user/styles.css';
import { Link } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import appResourcesPath from 'src/utils/app-resources-path';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HandymanSharpIcon from '@mui/icons-material/HandymanSharp';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';

export default function CardReviewUser({
  data,
}) {
  const {
    title, body, date, movieId, handleDelete, id,
  } = data;
  const releaseDate = movieId.release_date && typeof movieId.release_date === 'string' ? ` (${movieId.release_date.slice(0, 4)})` : '';

  return (
    <Card
      data-testid="card-review-user"
      className="card-review-user"
    >
      <CardActionArea
        data-testid="card-review-user-container-image"
        className="card-review-user-container-image"
        component={Link}
        to={linkRoutes.cardReviewUser.movie(movieId.idTMDB)}
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
          to={linkRoutes.cardReviewUser.movie(movieId.idTMDB)}
          sx={{
            width: {
              xs: '95%',
            },
          }}
        >
          <CardHeader
            title={`${movieId.name}${releaseDate}`}
            component="h2"
            className="card-review-user-title-1"
            sx={{ color: 'primary.main' }}
          />
        </CardActionArea>
        <CardContent data-testid="card-review-user-container-right-body" className="card-review-user-container-right-body">
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
          >
            <Rating name="customized-1" defaultValue={movieId.rateAverage ? 1 : 0} max={1} readOnly />
            <Typography
              variant="body1"
              component="div"
              data-testid="ratingAverage"
            >
              {movieId.rateAverage > 0 ? movieId.rateAverage : ''}
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
          <Collapse
            timeout="auto"
            collapsedSize="100px"
            // Manual expand
            onClick={(e) => {
              if (e.currentTarget.style.height !== 'auto') {
                e.currentTarget.style.height = 'auto'; // This expand
                // The icon is svg. If you have more svg, you have to change this selector
                const expandIcon = e.currentTarget.querySelector('svg');
                expandIcon.style.display = 'none';
              }
            }}
          >
            <Typography
              gutterBottom
              variant="body1"
              component="div"
              sx={{
                whiteSpace: 'pre-wrap',
              }}
            >
              {body}
            </Typography>
            <ExpandMoreIcon sx={{
              position: 'absolute',
              bottom: '30px',
              right: '10px',
              color: 'secondary',
              cursor: 'pointer',
            }}
            />
          </Collapse>
        </CardContent>
      </Box>
      {handleDelete && (
        <Box
          className="card-review-user-container-edit-buttons"
          data-testid="card-review-user-container-edit-buttons"
        >
          <IconButton
            component={Link}
            to={linkRoutes.cardReviewUser.editReview(movieId.idTMDB)}
            size="small"
            variant="contained"
            aria-label="update review"
            color="info"
          >
            <HandymanSharpIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete({
              movieId: movieId.idTMDB, reviewId: id,
            })}
            size="small"
            variant="contained"
            aria-label="delete review"
            color="error"
          >
            <HighlightOffSharpIcon />
          </IconButton>

        </Box>
      )}
    </Card>
  );
}

CardReviewUser.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    handleDelete: PropTypes.func,
    id: PropTypes.string.isRequired,
    movieId: PropTypes.shape({
      name: PropTypes.string.isRequired,
      photo: PropTypes.string,
      release_date: PropTypes.string,
      idTMDB: PropTypes.string.isRequired,
      rateAverage: PropTypes.number.isRequired,
    }),
  }).isRequired,
};
