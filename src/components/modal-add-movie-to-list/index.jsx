import React, { useEffect, useMemo, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import BootstrapDialogTitle from 'src/components/bootstrap-dialog-title/modal-notification';
import { getAllListUserLight } from 'src/services/get-data';
import throttle from 'just-throttle';
import { editList } from 'src/services/list-write';
import editWatchist from 'src/services/watchlist-write';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import { LoadingButton } from '@mui/lab';
import { Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

function AutocompleteAddMovieToList({
  handleChange, list, lists,
}) {
  return (
    <Autocomplete
      data-testid="autocomplete-add-movie-to-list"
      options={lists}
      onChange={handleChange} // prints the selected
      value={list}
      filterSelectedOptions
      getOptionLabel={(option) => option.name || ''}
      freeSolo
      loading
      noOptionsText="No option matched"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Lists"
          placeholder="Select one list"
        />
      )}
    />
  );
}

AutocompleteAddMovieToList.propTypes = {
  handleChange: PropTypes.func.isRequired,
  list: PropTypes.objectOf(
    PropTypes
      .oneOfType([PropTypes.string, PropTypes.arrayOf(
        PropTypes
          .oneOfType([PropTypes.string, PropTypes.number]),

      ),
      ]),
  ),
  lists: PropTypes.arrayOf(PropTypes.objectOf(
    PropTypes
      .oneOfType([PropTypes.string, PropTypes.arrayOf(
        PropTypes
          .oneOfType([PropTypes.string, PropTypes.number]),

      ),
      ]),
  )),
};

AutocompleteAddMovieToList.defaultProps = {
  list: {},
  lists: [],
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalAddMovieToList({
  handleClose, open, userId, movieId,
}) {
  const [lists, setLists] = useState([]);
  const [list, setList] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const data = await getAllListUserLight(userId);
        if (mounted) {
          setLists(data.results);
        }
      } catch (e) {
        setError(e);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [setError, userId, open]);

  const handleChange = (event, value) => {
    setList(value);
  };

  useEffect(() => {
    if (open === false) {
      setIsAdded(false);
      setList({});
      setError(false);
    }
  }, [open]);

  const debounceHandleConfirm = useMemo(() => throttle(
    async () => {
      try {
        setLoading(true);

        if (!lists.some((elem) => JSON.stringify(list) === JSON
          .stringify(elem))) {
          setList({});
          setLoading(false);
          return;
        }
        const listWithMovie = list.movies.slice();
        listWithMovie.push(movieId);
        setList({ ...list, movies: listWithMovie });
        if (list.name === 'Watchlist') {
          await editWatchist({ movies: listWithMovie, userId });
        } else {
          await editList({ movies: listWithMovie, listId: list.id, userId });
        }

        setLoading(false);
        setIsAdded(true);
      } catch (e) {
        setError(e);
      }
    },
    3000,
    { leading: true },
  ), [setError, movieId, list, userId, lists]);

  const handleCloseLoadding = () => {
    if (loading) return;
    handleClose();
  };

  if (error?.status === 404) return <Navigate to="/404" />;

  if (error) return <Navigate to="/error" />;

  return (
    <BootstrapDialog
      onClose={handleCloseLoadding}
      data-testid="add-movie-to-list-dialog"
      aria-labelledby="add-movie-to-list-dialog"
      open={open}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '500px', // Set your width here
          },
        },
      }}
    >

      <BootstrapDialogTitle onClose={handleCloseLoadding}>
        {isAdded ? (
          <>
            Movie added to the list
            {' '}
            <DoneOutlineIcon color="success" />
          </>
        ) : 'Select one list to add the movie'}
      </BootstrapDialogTitle>
      <DialogContent dividers>
        {!isAdded
          && <AutocompleteAddMovieToList lists={lists} handleChange={handleChange} list={list} />}
        {isAdded && <Box>Close the Pop-up to continue</Box> }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseLoadding}>
          Close
        </Button>
        {isAdded ? '' : (
          <LoadingButton
            onClick={debounceHandleConfirm}
            loading={loading}
            loadingPosition="end"
            endIcon={<AddCircleOutlineSharpIcon />}
            variant={loading ? 'outlined' : 'contained'}
            disabled={!!loading}
          >
            Add
          </LoadingButton>
        )}
      </DialogActions>
    </BootstrapDialog>
  );
}

ModalAddMovieToList.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  movieId: PropTypes.string.isRequired,
};
