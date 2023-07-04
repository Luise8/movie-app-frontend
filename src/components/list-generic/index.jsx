import React from 'react';
import {
  Grid,
} from '@mui/material';
import 'src/components/list-movie-grid/styles.css';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';

export default function ListGeneric({ list, renderItem, propKey }) {
  return (
    <Grid
      container
      sx={{
        alignItems: 'center',
      }}
      rowSpacing={2}
      direction="column"
    >
      {list.map((item) => (
        <Grid
          item
          xs={12}
          key={propKey ? item[propKey] : uniqid()}
        >
          { renderItem({ data: item })}
        </Grid>
      ))}
    </Grid>
  );
}

ListGeneric.propTypes = {
  list: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  renderItem: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  propKey: PropTypes.string,
};

ListGeneric.defaultProps = {
  propKey: undefined,
  list: [],
};
