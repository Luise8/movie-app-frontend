import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {
  CardActionArea, CardHeader, Grid, useTheme,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import 'src/components/card-review-movie/styles.css';
import { Link } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';

export default function CardReviewMovie({
  data,
}) {
  const {
    title, body, date, userId,
  } = data;

  const theme = useTheme();

  return (
    <Card
      data-testid="card-review-movie"
      className="card-review-movie"
    >
      <CardHeader
        title={`${title}`}
        subheader={(
          <Grid container spacing={2}>
            <Grid item>
              <CardActionArea
                sx={{ color: theme.palette.primary.light }}
                component={Link}
                to={linkRoutes.cardReviewMovie(userId.id)}
                data-testid="link-user"
              >
                <span>
                  {userId.username}
                </span>
              </CardActionArea>
            </Grid>
            <Grid item>
              {new Date(date).toUTCString()}
            </Grid>
          </Grid>
)}
        component="h2"
        className="card-review-movie-header"
      />
      <CardContent data-testid="card-review-movie-card-content" className="card-review-movie-card-content">
        <Typography
          gutterBottom
          variant="body1"
          component="div"
        >
          {body}
        </Typography>
      </CardContent>
    </Card>
  );
}

CardReviewMovie.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    userId: PropTypes.shape({
      username: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
