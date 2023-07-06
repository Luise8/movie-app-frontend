import {
  Box, Divider, Grid, List, ListItemButton, ListItemText, useTheme,
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import linkRoutes from 'src/utils/link-routes';

export default function ListMovieLists({ list }) {
  const theme = useTheme();
  return (
    <Box sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>

      <List component="section" aria-label="list of lists">
        {list.map((item, index) => (
          <div key={item.id}>
            <ListItemButton
              data-testid="list-item"
              component={Link}
              to={linkRoutes.ListMovieItem({ userId: item.userId, listId: item.id })}
            >
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{ color: theme.palette.primary.light }}
                secondary={(
                  <Grid
                    container
                    component="span"
                  >
                    <Grid
                      component="span"
                      item
                      xs={12}
                    >
                      {item?.movies?.length}
                      {' '}
                      movies
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      component="span"
                    >
                      {`Created ${new Date(item.date).toUTCString()}`}
                    </Grid>
                  </Grid>
          )}
              />
            </ListItemButton>
            { list[index + 1] !== undefined
     && <Divider />}
          </div>
        ))}
      </List>
    </Box>
  );
}

ListMovieLists.propTypes = {
  list: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};
