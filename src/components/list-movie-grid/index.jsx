import React from 'react';
import {
  Grid,
} from '@mui/material';
import 'src/components/list-movie-grid/styles.css';
import CardMovieSmall from 'src/components/card-movie-small';
import PropTypes from 'prop-types';

export default function ListGridMovies({ list }) {
  return (
    <Grid
      container
      sx={{ maxWidth: '1000px' }}
      spacing={2}
      justifyContent="center"
      alignItems="flex-start"
    >
      {list.map((item) => (
        <Grid
          item
          data-testid="card-grid-items-small"
          className="card-grid-items-small"
          key={item.id || item.idTMDB}
        >
          <CardMovieSmall cardData={item} />
        </Grid>
      ))}
    </Grid>
  );
}

ListGridMovies.propTypes = {
  list: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};
