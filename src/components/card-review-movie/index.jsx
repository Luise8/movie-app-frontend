import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {
  CardActionArea, CardHeader, Collapse, Grid,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import 'src/components/card-review-movie/styles.css';
import { Link } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function CardReviewMovie({
  data,
}) {
  const {
    title, body, date, userId,
  } = data;

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
                sx={{ color: 'primary.light' }}
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
      <Collapse
        id="card-review-movie-collapse"
        timeout="auto"
        collapsedSize="100px"
        className="MuiCollapse-entered"
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
        <CardContent data-testid="card-review-movie-card-content" className="card-review-movie-card-content">

          <Typography
            gutterBottom
            variant="body1"
            component="div"
          >
            {body}
          </Typography>
        </CardContent>
        <ExpandMoreIcon sx={{
          position: 'absolute',
          bottom: '30px',
          right: '10px',
          color: 'secondary',
          cursor: 'pointer',
        }}
        />
      </Collapse>
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
